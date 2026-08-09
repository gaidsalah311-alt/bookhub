import { eq, and, or, desc, asc, like, inArray, between, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  categories,
  listings,
  books,
  authorProfiles,
  libraryProfiles,
  publisherProfiles,
  subscriptionPlans,
  subscriptions,
  conversations,
  messages,
  favorites,
  follows,
  notifications,
  ratings,
  reports,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod", "profileImage", "bio", "country", "language", "currency"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => { const value = user[field]; if (value === undefined) return; const normalized = value ?? null; values[field] = normalized; updateSet[field] = normalized; };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result.length > 0 ? result[0] : undefined; }
export async function getUserById(id: number) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.id, id)).limit(1); return result.length > 0 ? result[0] : undefined; }
export async function getUserByEmail(email: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.email, email)).limit(1); return result.length > 0 ? result[0] : undefined; }

export async function getCategories() { const db = await getDb(); if (!db) return []; return await db.select().from(categories).orderBy(asc(categories.name)); }
export async function getCategoryBySlug(slug: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1); return result.length > 0 ? result[0] : undefined; }

export async function searchListings(query: string, filters?: { categoryId?: number; country?: string; language?: string; minPrice?: number; maxPrice?: number; type?: string; limit?: number; offset?: number; }) {
  const db = await getDb(); if (!db) return [];
  const limit = filters?.limit ?? 20; const offset = filters?.offset ?? 0;
  const conditions = [eq(listings.status, "active"), or(like(books.title, `%${query}%`), like(books.author, `%${query}%`), like(books.description, `%${query}%`))];
  if (filters?.categoryId) conditions.push(eq(books.categoryId, filters.categoryId));
  if (filters?.country) conditions.push(eq(listings.country, filters.country));
  if (filters?.language) conditions.push(eq(books.language, filters.language));
  if (filters?.type) conditions.push(eq(listings.type, filters.type as any));
  if (filters?.minPrice !== undefined) conditions.push(gte(listings.price, filters.minPrice.toString()));
  if (filters?.maxPrice !== undefined) conditions.push(lte(listings.price, filters.maxPrice.toString()));
  return await db.select().from(listings).innerJoin(books, eq(listings.bookId, books.id)).innerJoin(users, eq(listings.userId, users.id)).where(and(...conditions)).orderBy(desc(listings.createdAt)).limit(limit).offset(offset);
}
export async function getListingById(id: number) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(listings).innerJoin(books, eq(listings.bookId, books.id)).innerJoin(users, eq(listings.userId, users.id)).where(eq(listings.id, id)).limit(1); return result.length > 0 ? result[0] : undefined; }
export async function getUserListings(userId: number, limit: number = 20, offset: number = 0) { const db = await getDb(); if (!db) return []; return await db.select().from(listings).innerJoin(books, eq(listings.bookId, books.id)).where(eq(listings.userId, userId)).orderBy(desc(listings.createdAt)).limit(limit).offset(offset); }

export async function getUserConversations(userId: number, limit: number = 20, offset: number = 0) { const db = await getDb(); if (!db) return []; return await db.select().from(conversations).where(or(eq(conversations.userId1, userId), eq(conversations.userId2, userId))).orderBy(desc(conversations.lastMessageAt)).limit(limit).offset(offset); }
export async function getConversationMessages(conversationId: number, limit: number = 50, offset: number = 0) { const db = await getDb(); if (!db) return []; return await db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(desc(messages.createdAt)).limit(limit).offset(offset); }
export async function getUserFavorites(userId: number, limit: number = 20, offset: number = 0) { const db = await getDb(); if (!db) return []; return await db.select().from(favorites).innerJoin(listings, eq(favorites.listingId, listings.id)).innerJoin(books, eq(listings.bookId, books.id)).where(eq(favorites.userId, userId)).orderBy(desc(favorites.createdAt)).limit(limit).offset(offset); }
export async function getUserFollowing(userId: number, limit: number = 20, offset: number = 0) { const db = await getDb(); if (!db) return []; return await db.select().from(follows).innerJoin(users, eq(follows.followingId, users.id)).where(eq(follows.followerId, userId)).orderBy(desc(follows.createdAt)).limit(limit).offset(offset); }
export async function getUserFollowers(userId: number, limit: number = 20, offset: number = 0) { const db = await getDb(); if (!db) return []; return await db.select().from(follows).innerJoin(users, eq(follows.followerId, users.id)).where(eq(follows.followingId, userId)).orderBy(desc(follows.createdAt)).limit(limit).offset(offset); }

export async function getSubscriptionPlans() { const db = await getDb(); if (!db) return []; return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true)); }
export async function getUserActiveSubscription(userId: number) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(subscriptions).innerJoin(subscriptionPlans, eq(subscriptions.planId, subscriptionPlans.id)).where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active"), gte(subscriptions.endDate, new Date()))).limit(1); return result.length > 0 ? result[0] : undefined; }
export async function getUserNotifications(userId: number, limit: number = 20, offset: number = 0) { const db = await getDb(); if (!db) return []; return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit).offset(offset); }
export async function getUnreadNotificationsCount(userId: number) { const db = await getDb(); if (!db) return 0; const result = await db.select({ count: notifications.id }).from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false))); return result.length > 0 ? result.length : 0; }
export async function getUserRatings(userId: number, limit: number = 20, offset: number = 0) { const db = await getDb(); if (!db) return []; return await db.select().from(ratings).where(eq(ratings.targetUserId, userId)).orderBy(desc(ratings.createdAt)).limit(limit).offset(offset); }
export async function getUserAverageRating(userId: number) { const db = await getDb(); if (!db) return 0; const result = await db.select({ avgRating: ratings.rating }).from(ratings).where(eq(ratings.targetUserId, userId)); if (result.length === 0) return 0; const sum = result.reduce((acc, r) => acc + (r.avgRating || 0), 0); return Math.round((sum / result.length) * 10) / 10; }
export async function getPendingReports(limit: number = 20, offset: number = 0) { const db = await getDb(); if (!db) return []; return await db.select().from(reports).where(eq(reports.status, "pending")).orderBy(desc(reports.createdAt)).limit(limit).offset(offset); }

export async function getAuthorProfile(userId: number) {
  const db = await getDb(); if (!db) return null;
  const result = await db.select({ ...authorProfiles, name: users.name, profileImage: users.profileImage, email: users.email }).from(authorProfiles).innerJoin(users, eq(authorProfiles.userId, users.id)).where(eq(authorProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}
export async function getLibraryProfile(userId: number) {
  const db = await getDb(); if (!db) return null;
  const result = await db.select({ ...libraryProfiles, name: users.name, profileImage: users.profileImage, userEmail: users.email }).from(libraryProfiles).innerJoin(users, eq(libraryProfiles.userId, users.id)).where(eq(libraryProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}
export async function getPublisherProfile(userId: number) {
  const db = await getDb(); if (!db) return null;
  const result = await db.select({ ...publisherProfiles, name: users.name, profileImage: users.profileImage, userEmail: users.email }).from(publisherProfiles).innerJoin(users, eq(publisherProfiles.userId, users.id)).where(eq(publisherProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateAuthorProfile(userId: number, data: { bio?: string, website?: string, socialLinks?: Record<string, string> }) {
  const db = await getDb(); if (!db) { console.warn("[Database] Cannot update author profile: database not available"); return { success: false }; }
  const valuesToInsert = { userId, bio: data.bio ?? null, website: data.website ?? null, socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : null };
  const valuesToUpdate: Record<string, any> = {}; if (data.bio !== undefined) valuesToUpdate.bio = data.bio; if (data.website !== undefined) valuesToUpdate.website = data.website; if (data.socialLinks !== undefined) valuesToUpdate.socialLinks = data.socialLinks ? JSON.stringify(data.socialLinks) : null;
  const result = await db.insert(authorProfiles).values(valuesToInsert).onDuplicateKeyUpdate({ set: valuesToUpdate });
  if (result[0].affectedRows === 0 && result[0].insertId === 0) throw new Error("فشل إنشاء أو تحديث ملف المؤلف"); return { success: true };
}
export async function updateLibraryProfile(userId: number, data: { libraryName?: string, website?: string, address?: string, phone?: string, email?: string, bio?: string }) {
  const db = await getDb(); if (!db) { console.warn("[Database] Cannot update library profile: database not available"); return { success: false }; }
  const valuesToInsert = { userId, libraryName: data.libraryName || "مكتبة جديدة", website: data.website ?? null, address: data.address ?? null, phone: data.phone ?? null, email: data.email ?? null, bio: data.bio ?? null };
  const valuesToUpdate: Record<string, any> = {}; if (data.libraryName !== undefined) valuesToUpdate.libraryName = data.libraryName; if (data.website !== undefined) valuesToUpdate.website = data.website; if (data.address !== undefined) valuesToUpdate.address = data.address; if (data.phone !== undefined) valuesToUpdate.phone = data.phone; if (data.email !== undefined) valuesToUpdate.email = data.email; if (data.bio !== undefined) valuesToUpdate.bio = data.bio;
  const result = await db.insert(libraryProfiles).values(valuesToInsert).onDuplicateKeyUpdate({ set: valuesToUpdate });
  if (result[0].affectedRows === 0 && result[0].insertId === 0) throw new Error("فشل إنشاء أو تحديث ملف المكتبة"); return { success: true };
}
export async function updatePublisherProfile(userId: number, data: { publisherName?: string, website?: string, address?: string, phone?: string, email?: string, bio?: string }) {
  const db = await getDb(); if (!db) { console.warn("[Database] Cannot update publisher profile: database not available"); return { success: false }; }
  const valuesToInsert = { userId, publisherName: data.publisherName || "ناشر جديد", website: data.website ?? null, address: data.address ?? null, phone: data.phone ?? null, email: data.email ?? null, bio: data.bio ?? null };
  const valuesToUpdate: Record<string, any> = {}; if (data.publisherName !== undefined) valuesToUpdate.publisherName = data.publisherName; if (data.website !== undefined) valuesToUpdate.website = data.website; if (data.address !== undefined) valuesToUpdate.address = data.address; if (data.phone !== undefined) valuesToUpdate.phone = data.phone; if (data.email !== undefined) valuesToUpdate.email = data.email; if (data.bio !== undefined) valuesToUpdate.bio = data.bio;
  const result = await db.insert(publisherProfiles).values(valuesToInsert).onDuplicateKeyUpdate({ set: valuesToUpdate });
  if (result[0].affectedRows === 0 && result[0].insertId === 0) throw new Error("فشل إنشاء أو تحديث ملف الناشر"); return { success: true };
}
