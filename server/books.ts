import { eq } from "drizzle-orm";
import { books, categories } from "../drizzle/schema";
import { getDb } from "./db";

export async function createBook(data: {
  title: string;
  author: string;
  description?: string;
  categoryId: number;
  subcategoryId?: number;
  language: string;
  isbn?: string;
  publishDate?: Date;
  publisher?: string;
  pages?: number;
  coverImage?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const category = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, data.categoryId)).limit(1);
  if (!category.length) throw new Error("التصنيف غير موجود");
  if (data.isbn) {
    const duplicate = await db.select({ id: books.id }).from(books).where(eq(books.isbn, data.isbn)).limit(1);
    if (duplicate.length) throw new Error("يوجد كتاب مسجل بهذا ISBN");
  }
  const result = await db.insert(books).values({
    title: data.title.trim(), author: data.author.trim(), description: data.description?.trim() || null,
    categoryId: data.categoryId, subcategoryId: data.subcategoryId ?? null, language: data.language.trim(),
    isbn: data.isbn?.trim() || null, publishDate: data.publishDate ?? null, publisher: data.publisher?.trim() || null,
    pages: data.pages ?? null, coverImage: data.coverImage?.trim() || null,
  });
  return { success: true as const, bookId: Number((result as any)[0]?.insertId) };
}
