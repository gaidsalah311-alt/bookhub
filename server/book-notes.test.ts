import { describe, expect, it, vi } from "vitest";
import { appRouter, parseBookNoteInput } from "./routers";
import { deleteBookNote, getBookNote, upsertBookNote } from "./db";

vi.mock("./db", () => ({
  deleteBookNote: vi.fn(),
  getBookNote: vi.fn(),
  upsertBookNote: vi.fn(),
  getUserBooks: vi.fn(),
  getBookById: vi.fn(),
  createBook: vi.fn(),
  updateBook: vi.fn(),
  deleteBook: vi.fn(),
  getUserCategories: vi.fn(),
  createCategory: vi.fn(),
  getBookStatistics: vi.fn(),
}));

const context = {
  user: {
    id: 7,
    openId: "test-user",
    name: "Test User",
    email: "test@example.com",
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: {} as any,
  res: {} as any,
} as any;

describe("bookNotes input validation", () => {
  it("rejects an empty payload and a whitespace-only note", () => {
    expect(() => parseBookNoteInput({ bookId: 42 })).toThrow();
    expect(() => parseBookNoteInput({ bookId: 42, note: "   " })).toThrow();
  });

  it("accepts a trimmed note or a personal rating from 1 to 5", () => {
    expect(parseBookNoteInput({ bookId: 42, note: "  ملاحظة شخصية  " })).toEqual({
      bookId: 42,
      note: "ملاحظة شخصية",
    });
    expect(parseBookNoteInput({ bookId: 42, personalRating: 1 })).toEqual({
      bookId: 42,
      personalRating: 1,
    });
    expect(parseBookNoteInput({ bookId: 42, personalRating: 5 })).toEqual({
      bookId: 42,
      personalRating: 5,
    });
  });

  it("rejects ratings outside the 1 to 5 integer range", () => {
    expect(() => parseBookNoteInput({ bookId: 42, personalRating: 0 })).toThrow();
    expect(() => parseBookNoteInput({ bookId: 42, personalRating: 6 })).toThrow();
    expect(() => parseBookNoteInput({ bookId: 42, personalRating: 2.5 })).toThrow();
  });
});

describe("bookNotes router ownership context", () => {
  it("always passes the authenticated user id to note queries and mutations", async () => {
    vi.mocked(getBookNote).mockResolvedValue(undefined);
    vi.mocked(upsertBookNote).mockResolvedValue({} as any);
    vi.mocked(deleteBookNote).mockResolvedValue({} as any);

    const caller = appRouter.createCaller(context);

    await caller.bookNotes.get(42);
    await caller.bookNotes.upsert({ bookId: 42, personalRating: 4 });
    await caller.bookNotes.delete(42);

    expect(getBookNote).toHaveBeenCalledWith(42, 7);
    expect(upsertBookNote).toHaveBeenCalledWith({
      userId: 7,
      bookId: 42,
      personalRating: 4,
    });
    expect(deleteBookNote).toHaveBeenCalledWith(42, 7);
  });

  it("rejects invalid book ids before reaching the database", async () => {
    const caller = appRouter.createCaller(context);

    await expect(caller.bookNotes.get(0)).rejects.toThrow();
    await expect(caller.bookNotes.delete(-1)).rejects.toThrow();
    expect(getBookNote).not.toHaveBeenCalledWith(0, 7);
  });
});
