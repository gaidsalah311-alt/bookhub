import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  selectLimit: vi.fn(),
  updateWhere: vi.fn(),
  deleteWhere: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: vi.fn(() => ({
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({ limit: mocks.selectLimit })),
      })),
    })),
    update: mocks.update,
    delete: mocks.delete,
  })),
}));

import {
  deleteBook,
  deleteBookNote,
  getBookById,
  updateBook,
  upsertBookNote,
} from "./db";

describe("ownership enforcement", () => {
  beforeEach(() => {
    process.env.DATABASE_URL = "mysql://test";
    mocks.selectLimit.mockResolvedValue([
      {
        id: 99,
        userId: 8,
        title: "Book owned by another user",
      },
    ]);
    mocks.update.mockReturnValue({
      set: vi.fn(() => ({ where: mocks.updateWhere })),
    });
    mocks.delete.mockReturnValue({ where: mocks.deleteWhere });
    vi.clearAllMocks();
  });

  it("does not return a book owned by another user", async () => {
    await expect(getBookById(99, 7)).resolves.toBeUndefined();
  });

  it("rejects update and delete operations for a foreign book", async () => {
    await expect(updateBook(99, 7, { title: "Attempted change" })).rejects.toThrow(
      "Book not found or unauthorized"
    );
    await expect(deleteBook(99, 7)).rejects.toThrow(
      "Book not found or unauthorized"
    );
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.delete).not.toHaveBeenCalled();
  });

  it("rejects note upsert and deletion for a foreign book", async () => {
    await expect(
      upsertBookNote({ userId: 7, bookId: 99, personalRating: 4 })
    ).rejects.toThrow("Book not found or unauthorized");
    await expect(deleteBookNote(99, 7)).rejects.toThrow(
      "Book not found or unauthorized"
    );
  });
});
