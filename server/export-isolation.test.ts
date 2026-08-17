import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  queuedResults: [] as unknown[][],
}));

const fakeDb = vi.hoisted(() => ({
  select: vi.fn(() => {
    const result = state.queuedResults.shift() ?? [];
    const chain: any = {
      from: () => chain,
      where: () => chain,
      orderBy: () => chain,
      limit: () => Promise.resolve(result),
      then: (resolve: (value: unknown[]) => unknown, reject: (reason: unknown) => unknown) =>
        Promise.resolve(result).then(resolve, reject),
    };
    return chain;
  }),
}));

vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: vi.fn(() => fakeDb),
}));

import { getUserLibraryExport } from "./db";

const bookFor = (userId: number, title: string, id: number) => ({
  id,
  userId,
  title,
  author: `مؤلف ${userId}`,
  description: `وصف ${userId}`,
  categoryId: userId,
  publishYear: 2024,
  rating: 4,
  readingStatus: "لم يُقرأ",
  coverImageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const categoryFor = (userId: number) => ({
  id: userId,
  userId,
  name: `تصنيف ${userId}`,
});

describe("getUserLibraryExport content isolation", () => {
  beforeEach(() => {
    process.env.DATABASE_URL = "mysql://export-isolation-test";
    state.queuedResults.length = 0;
  });

  it("excludes another user's book and category from the exported rows", async () => {
    state.queuedResults.push(
      [bookFor(1, "كتاب المستخدم الأول", 101), bookFor(2, "كتاب المستخدم الآخر", 202)],
      [categoryFor(1), categoryFor(2)],
      [{ note: "ملاحظة خاصة بالمستخدم الأول", personalRating: 5 }],
    );

    const rows = await getUserLibraryExport(1);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      id: 101,
      title: "كتاب المستخدم الأول",
      categoryName: "تصنيف 1",
      personalNote: "ملاحظة خاصة بالمستخدم الأول",
    });
    expect(JSON.stringify(rows)).not.toContain("كتاب المستخدم الآخر");
    expect(JSON.stringify(rows)).not.toContain("تصنيف 2");
  });

  it("does not expose the first user's note when exporting the second user", async () => {
    state.queuedResults.push(
      [bookFor(1, "كتاب المستخدم الأول", 101), bookFor(2, "كتاب المستخدم الآخر", 202)],
      [categoryFor(1), categoryFor(2)],
      [{ note: "ملاحظة خاصة بالمستخدم الآخر", personalRating: 3 }],
    );

    const rows = await getUserLibraryExport(2);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      id: 202,
      title: "كتاب المستخدم الآخر",
      personalNote: "ملاحظة خاصة بالمستخدم الآخر",
    });
    expect(JSON.stringify(rows)).not.toContain("ملاحظة خاصة بالمستخدم الأول");
  });
});
