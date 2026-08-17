import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  books,
  categories,
  bookNotes,
  InsertBook,
  InsertCategory,
  InsertBookNote,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all books for a user
 */
export async function getUserBooks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(books)
    .where(eq(books.userId, userId))
    .orderBy(books.createdAt);
}

/**
 * Get a single book by ID (with user verification)
 */
export async function getBookById(bookId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(books)
    .where(and(eq(books.id, bookId), eq(books.userId, userId)))
    .limit(1);
  
  if (result.length === 0 || result[0].userId !== userId) {
    return undefined;
  }

  return result[0];
}

/**
 * Create a new book
 */
export async function createBook(book: InsertBook) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(books).values(book);
  return result;
}

/**
 * Update a book
 */
export async function updateBook(bookId: number, userId: number, updates: Partial<InsertBook>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verify ownership
  const book = await getBookById(bookId, userId);
  if (!book) throw new Error("Book not found or unauthorized");
  
  return db
    .update(books)
    .set(updates)
    .where(and(eq(books.id, bookId), eq(books.userId, userId)));
}

/**
 * Delete a book
 */
export async function deleteBook(bookId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verify ownership
  const book = await getBookById(bookId, userId);
  if (!book) throw new Error("Book not found or unauthorized");
  
  return db
    .delete(books)
    .where(and(eq(books.id, bookId), eq(books.userId, userId)));
}

/**
 * Get all categories for a user
 */
export async function getUserCategories(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(categories.createdAt);
}

/**
 * Create a new category
 */
export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(categories).values(category);
  return result;
}

/**
 * Get book statistics for a user
 */
export async function getBookStatistics(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const allBooks = await getUserBooks(userId);
  
  const stats = {
    totalBooks: allBooks.length,
    readBooks: allBooks.filter((b) => b.readingStatus === "مقروء").length,
    readingBooks: allBooks.filter((b) => b.readingStatus === "قيد القراءة").length,
    unreadBooks: allBooks.filter((b) => b.readingStatus === "لم يُقرأ").length,
    averageRating:
      allBooks.length > 0
        ? Math.round(
            (allBooks.reduce((sum, b) => sum + (b.rating || 0), 0) /
              allBooks.length) *
              10
          ) / 10
        : 0,
  };
  
  return stats;
}

export async function getBookNote(bookId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(bookNotes)
    .where(and(eq(bookNotes.bookId, bookId), eq(bookNotes.userId, userId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertBookNote(note: InsertBookNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const ownedBook = await getBookById(note.bookId, note.userId);
  if (!ownedBook) throw new Error("Book not found or unauthorized");

  const existing = await getBookNote(note.bookId, note.userId);
  const values: InsertBookNote = {
    userId: note.userId,
    bookId: note.bookId,
    note: note.note !== undefined ? note.note : existing?.note ?? null,
    personalRating:
      note.personalRating !== undefined
        ? note.personalRating
        : existing?.personalRating ?? null,
  };

  if (values.note === null && values.personalRating === null) {
    throw new Error("Add a note or a personal rating, or delete the note");
  }

  return db.insert(bookNotes).values(values).onDuplicateKeyUpdate({
    set: {
      note: values.note,
      personalRating: values.personalRating,
      updatedAt: new Date(),
    },
  });
}

export async function deleteBookNote(bookId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const ownedBook = await getBookById(bookId, userId);
  if (!ownedBook) throw new Error("Book not found or unauthorized");

  return db
    .delete(bookNotes)
    .where(and(eq(bookNotes.bookId, bookId), eq(bookNotes.userId, userId)));
}
