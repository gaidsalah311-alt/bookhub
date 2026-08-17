import { describe, expect, it, vi } from "vitest";
import { appRouter, parseCoverUploadInput } from "./routers";
import { getUserLibraryExport } from "./db";
import { storagePut } from "./storage";

vi.mock("./db", () => ({
  getUserBooks: vi.fn(),
  getBookById: vi.fn(),
  createBook: vi.fn(),
  updateBook: vi.fn(),
  deleteBook: vi.fn(),
  getUserCategories: vi.fn(),
  createCategory: vi.fn(),
  getBookStatistics: vi.fn(),
  getBookNote: vi.fn(),
  upsertBookNote: vi.fn(),
  deleteBookNote: vi.fn(),
  getUserLibraryExport: vi.fn(),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn(),
}));

const context = {
  user: {
    id: 19,
    openId: "export-user",
    name: "Export User",
    email: "export@example.com",
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: {} as any,
  res: {} as any,
} as any;

describe("cover upload validation", () => {
  it("accepts supported image types and sanitizes the filename", () => {
    expect(
      parseCoverUploadInput({
        fileName: "../my cover!.png",
        mimeType: "image/png",
        dataBase64: "aGVsbG8=",
      }),
    ).toMatchObject({
      fileName: "my-cover-.png",
      mimeType: "image/png",
    });
  });

  it("rejects unsupported types and missing files", () => {
    expect(() =>
      parseCoverUploadInput({
        fileName: "cover.svg",
        mimeType: "image/svg+xml",
        dataBase64: "aGVsbG8=",
      }),
    ).toThrow();
    expect(() => parseCoverUploadInput({ fileName: "cover.png" })).toThrow();
  });
});

describe("cover and export ownership context", () => {
  it("uploads into the authenticated user's storage prefix", async () => {
    vi.mocked(storagePut).mockResolvedValue({
      key: "users/19/covers/cover.png",
      url: "https://storage.example/cover.png",
    });

    const caller = appRouter.createCaller(context);
    const result = await caller.cover.upload({
      fileName: "cover.png",
      mimeType: "image/png",
      dataBase64: "aGVsbG8=",
    });

    expect(storagePut).toHaveBeenCalledWith(
      "users/19/covers/cover.png",
      expect.any(Buffer),
      "image/png",
    );
    expect(result).toMatchObject({
      key: "users/19/covers/cover.png",
      mimeType: "image/png",
      size: 5,
    });
  });

  it("requests export data with the authenticated user's id", async () => {
    const rows = [
      {
        id: 3,
        title: "كتاب المستخدم",
        author: "مؤلف",
        personalNote: "ملاحظة خاصة",
        personalRating: 5,
      },
    ];
    vi.mocked(getUserLibraryExport).mockResolvedValue(rows as any);

    const caller = appRouter.createCaller(context);
    await expect(caller.exports.library()).resolves.toEqual(rows);
    expect(getUserLibraryExport).toHaveBeenCalledWith(19);
  });
});
