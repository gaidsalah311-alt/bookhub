import { eq, desc, and, like, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  categories,
  authors,
  publishers,
  bookstores,
  books,
  advertisements,
  subscriptionPlans,
  userSubscriptions,
  orders,
  reviews,
  type User,
  type Category,
  type Author,
  type Publisher,
  type Bookstore,
  type Book,
  type Advertisement,
  type SubscriptionPlan,
  type UserSubscription,
  type Order,
  type Review,
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

// ============================================================================
// USER OPERATIONS
// ============================================================================

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

    const textFields = ["name", "email", "loginMethod", "profileImage", "bio"] as const;
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

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// CATEGORY OPERATIONS
// ============================================================================

export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(categories);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// BOOK OPERATIONS
// ============================================================================

export async function getBooks(limit: number = 20, offset: number = 0): Promise<Book[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(books)
    .where(eq(books.isPublished, true))
    .orderBy(desc(books.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getBookById(id: number): Promise<Book | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(books).where(eq(books.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBookBySlug(slug: string): Promise<Book | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(books).where(eq(books.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFeaturedBooks(limit: number = 10): Promise<Book[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(books)
    .where(and(eq(books.isPublished, true), eq(books.isFeatured, true)))
    .orderBy(desc(books.rating))
    .limit(limit);
}

export async function searchBooks(
  query: string,
  categoryId?: number,
  minPrice?: number,
  maxPrice?: number,
  language?: string,
  limit: number = 20,
  offset: number = 0
): Promise<Book[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(books.isPublished, true), like(books.title, `%${query}%`)];

  if (categoryId) {
    conditions.push(eq(books.categoryId, categoryId));
  }
  if (minPrice !== undefined) {
    conditions.push(gte(books.price, minPrice.toString()));
  }
  if (maxPrice !== undefined) {
    conditions.push(lte(books.price, maxPrice.toString()));
  }
  if (language) {
    conditions.push(eq(books.language, language));
  }

  return await db
    .select()
    .from(books)
    .where(and(...conditions))
    .orderBy(desc(books.createdAt))
    .limit(limit)
    .offset(offset);
}

// ============================================================================
// AUTHOR OPERATIONS
// ============================================================================

export async function getAuthorByUserId(userId: number): Promise<Author | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(authors).where(eq(authors.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAuthorBooks(authorId: number, limit: number = 20): Promise<Book[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(books)
    .where(and(eq(books.authorId, authorId), eq(books.isPublished, true)))
    .orderBy(desc(books.createdAt))
    .limit(limit);
}

// ============================================================================
// PUBLISHER OPERATIONS
// ============================================================================

export async function getPublisherByUserId(userId: number): Promise<Publisher | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(publishers).where(eq(publishers.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPublisherBooks(publisherId: number, limit: number = 20): Promise<Book[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(books)
    .where(and(eq(books.publisherId, publisherId), eq(books.isPublished, true)))
    .orderBy(desc(books.createdAt))
    .limit(limit);
}

// ============================================================================
// BOOKSTORE OPERATIONS
// ============================================================================

export async function getBookstoreByUserId(userId: number): Promise<Bookstore | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(bookstores).where(eq(bookstores.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// SUBSCRIPTION OPERATIONS
// ============================================================================

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.isActive, true));
}

export async function getUserSubscription(userId: number): Promise<UserSubscription | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(userSubscriptions)
    .where(and(eq(userSubscriptions.userId, userId), eq(userSubscriptions.status, 'active')))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// ADVERTISEMENT OPERATIONS
// ============================================================================

export async function getActiveAdvertisements(limit: number = 10): Promise<Advertisement[]> {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  return await db
    .select()
    .from(advertisements)
    .where(
      and(
        eq(advertisements.status, 'active'),
        eq(advertisements.isPaid, true),
        lte(advertisements.startDate, now),
        gte(advertisements.endDate, now)
      )
    )
    .limit(limit);
}

// ============================================================================
// REVIEW OPERATIONS
// ============================================================================

export async function getBookReviews(bookId: number, limit: number = 20): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.bookId, bookId))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
}

// ============================================================================
// ORDER OPERATIONS
// ============================================================================

export async function getUserOrders(userId: number, limit: number = 20): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(limit);
}
