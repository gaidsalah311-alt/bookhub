import { index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Books table - stores book information for each user
 */
export const books = mysqlTable(
  "books",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    description: text("description"),
    categoryId: int("categoryId"),
    publishYear: int("publishYear"),
    rating: int("rating").default(0), // 0-5 stars
    readingStatus: mysqlEnum("readingStatus", [
      "مقروء",
      "قيد القراءة",
      "لم يُقرأ",
    ]).default("لم يُقرأ"),
    coverImageUrl: text("coverImageUrl"), // URL to book cover image
    coverImageKey: text("coverImageKey"), // S3/storage object key
    coverImageMimeType: varchar("coverImageMimeType", { length: 64 }),
    coverImageSize: int("coverImageSize"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("userIdIdx").on(table.userId),
    categoryIdIdx: index("categoryIdIdx").on(table.categoryId),
  })
);

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

/**
 * Categories table - stores book categories
 */
export const categories = mysqlTable(
  "categories",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    color: varchar("color", { length: 7 }).default("#3B82F6"), // Hex color
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("userIdIdx").on(table.userId),
  })
);

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Private notes and personal ratings owned by the user for a specific book.
 * A user can have at most one note record per book.
 */
export const bookNotes = mysqlTable(
  "bookNotes",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    bookId: int("bookId").notNull(),
    note: text("note"),
    personalRating: int("personalRating"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userBookUniqueIdx: uniqueIndex("bookNotesUserBookUnique").on(
      table.userId,
      table.bookId
    ),
    userIdIdx: index("bookNotesUserIdIdx").on(table.userId),
    bookIdIdx: index("bookNotesBookIdIdx").on(table.bookId),
  })
);

export type BookNote = typeof bookNotes.$inferSelect;
export type InsertBookNote = typeof bookNotes.$inferInsert;