import { and, eq, or } from "drizzle-orm";
import { books, conversations, favorites, follows, listings, messages, notifications, ratings, reports, subscriptionPlans, subscriptions, users } from "../drizzle/schema";
import { getDb } from "./db";

function requireDb(db: Awaited<ReturnType<typeof getDb>>) {
  if (!db) throw new Error("Database is not configured");
  return db;
}

export async function createListing(userId: number, data: { bookId: number; type: "paper" | "digital" | "external_link"; condition?: "new" | "like_new" | "good" | "fair"; price: number; currency: string; country: string; externalLink?: string; externalPlatform?: string; description?: string; }) {
  const db = requireDb(await getDb());
  const book = await db.select({ id: books.id }).from(books).where(eq(books.id, data.bookId)).limit(1);
  if (!book.length) throw new Error("الكتاب غير موجود");
  if (data.type === "external_link" && !data.externalLink) throw new Error("الرابط الخارجي مطلوب لهذا النوع من الإعلانات");
  if (data.type !== "external_link" && data.externalLink) throw new Error("الرابط الخارجي مسموح فقط للإعلانات الخارجية");
  const result = await db.insert(listings).values({ userId, bookId: data.bookId, type: data.type, condition: data.condition ?? "new", price: data.price.toFixed(2), currency: data.currency, country: data.country, externalLink: data.externalLink ?? null, externalPlatform: data.externalPlatform ?? null, description: data.description ?? null, status: "pending_review" });
  return { success: true as const, listingId: Number((result as any)[0]?.insertId) };
}

export async function updateListing(userId: number, listingId: number, data: { price?: number; description?: string; status?: "active" | "sold" | "archived" }) {
  const db = requireDb(await getDb());
  const result = await db.update(listings).set({ ...(data.price !== undefined ? { price: data.price.toFixed(2) } : {}), ...(data.description !== undefined ? { description: data.description } : {}), ...(data.status !== undefined ? { status: data.status } : {}) }).where(and(eq(listings.id, listingId), eq(listings.userId, userId)));
  if (!Number((result as any)[0]?.affectedRows)) throw new Error("الإعلان غير موجود أو لا تملك صلاحية تعديله");
  return { success: true as const };
}

export async function deleteListing(userId: number, listingId: number) {
  const db = requireDb(await getDb());
  const result = await db.delete(listings).where(and(eq(listings.id, listingId), eq(listings.userId, userId)));
  if (!Number((result as any)[0]?.affectedRows)) throw new Error("الإعلان غير موجود أو لا تملك صلاحية حذفه");
  return { success: true as const };
}

export async function sendMessage(userId: number, conversationId: number, content: string, image?: string) {
  const db = requireDb(await getDb());
  const conversation = await db.select().from(conversations).where(and(eq(conversations.id, conversationId), or(eq(conversations.userId1, userId), eq(conversations.userId2, userId)))).limit(1);
  if (!conversation.length) throw new Error("المحادثة غير موجودة أو غير مصرح بها");
  const result = await db.insert(messages).values({ conversationId, senderId: userId, content, image: image ?? null });
  await db.update(conversations).set({ lastMessage: content, lastMessageAt: new Date() }).where(eq(conversations.id, conversationId));
  return { success: true as const, messageId: Number((result as any)[0]?.insertId) };
}

export async function markMessageRead(userId: number, messageId: number) {
  const db = requireDb(await getDb());
  const row = await db.select({ conversationId: messages.conversationId }).from(messages).where(eq(messages.id, messageId)).limit(1);
  if (!row.length) throw new Error("الرسالة غير موجودة");
  const conversation = await db.select({ id: conversations.id }).from(conversations).where(and(eq(conversations.id, row[0].conversationId), or(eq(conversations.userId1, userId), eq(conversations.userId2, userId)))).limit(1);
  if (!conversation.length) throw new Error("غير مصرح");
  await db.update(messages).set({ isRead: true, readAt: new Date() }).where(eq(messages.id, messageId));
  return { success: true as const };
}

export async function addFavorite(userId: number, listingId: number) {
  const db = requireDb(await getDb());
  const listing = await db.select({ id: listings.id }).from(listings).where(eq(listings.id, listingId)).limit(1);
  if (!listing.length) throw new Error("الإعلان غير موجود");
  const existing = await db.select({ id: favorites.id }).from(favorites).where(and(eq(favorites.userId, userId), eq(favorites.listingId, listingId))).limit(1);
  if (!existing.length) await db.insert(favorites).values({ userId, listingId });
  return { success: true as const };
}

export async function removeFavorite(userId: number, listingId: number) {
  const db = requireDb(await getDb());
  await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.listingId, listingId)));
  return { success: true as const };
}

export async function followUser(followerId: number, followingId: number) {
  const db = requireDb(await getDb());
  if (followerId === followingId) throw new Error("لا يمكنك متابعة نفسك");
  const target = await db.select({ id: users.id }).from(users).where(eq(users.id, followingId)).limit(1);
  if (!target.length) throw new Error("المستخدم غير موجود");
  const existing = await db.select({ id: follows.id }).from(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))).limit(1);
  if (!existing.length) await db.insert(follows).values({ followerId, followingId });
  return { success: true as const };
}

export async function unfollowUser(followerId: number, followingId: number) {
  const db = requireDb(await getDb());
  await db.delete(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
  return { success: true as const };
}

export async function markNotificationRead(userId: number, notificationId: number) {
  const db = requireDb(await getDb());
  const result = await db.update(notifications).set({ isRead: true, readAt: new Date() }).where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
  if (!Number((result as any)[0]?.affectedRows)) throw new Error("الإشعار غير موجود");
  return { success: true as const };
}

export async function createRating(userId: number, data: { targetUserId: number; listingId?: number; rating: number; comment?: string }) {
  const db = requireDb(await getDb());
  if (userId === data.targetUserId) throw new Error("لا يمكنك تقييم نفسك");
  if (data.rating < 1 || data.rating > 5 || !Number.isInteger(data.rating)) throw new Error("التقييم يجب أن يكون من 1 إلى 5");
  const target = await db.select({ id: users.id }).from(users).where(eq(users.id, data.targetUserId)).limit(1);
  if (!target.length) throw new Error("المستخدم غير موجود");
  if (data.listingId !== undefined) {
    const listing = await db.select({ id: listings.id, userId: listings.userId }).from(listings).where(eq(listings.id, data.listingId)).limit(1);
    if (!listing.length) throw new Error("الإعلان غير موجود");
    if (listing[0].userId !== data.targetUserId) throw new Error("الإعلان لا ينتمي إلى المستخدم الذي تريد تقييمه");
  }
  const duplicate = await db.select({ id: ratings.id }).from(ratings).where(and(eq(ratings.userId, userId), eq(ratings.targetUserId, data.targetUserId), data.listingId !== undefined ? eq(ratings.listingId, data.listingId) : eq(ratings.targetUserId, data.targetUserId))).limit(1);
  if (duplicate.length) throw new Error("لقد أضفت تقييمًا بالفعل لهذا الهدف");
  const result = await db.insert(ratings).values({ userId, targetUserId: data.targetUserId, listingId: data.listingId ?? null, rating: data.rating, comment: data.comment?.trim() || null });
  return { success: true as const, ratingId: Number((result as any)[0]?.insertId) };
}

export async function subscribeToPlan(userId: number, planId: number) {
  const db = requireDb(await getDb());
  const plan = await db.select().from(subscriptionPlans).where(and(eq(subscriptionPlans.id, planId), eq(subscriptionPlans.isActive, true))).limit(1);
  if (!plan.length) throw new Error("الخطة غير موجودة أو غير مفعلة");
  if (Number(plan[0].price) > 0) throw new Error("لا يمكن تفعيل اشتراك مدفوع قبل تأكيد الدفع عبر مزود الدفع المرتبط");
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + plan[0].duration * 24 * 60 * 60 * 1000);
  const result = await db.insert(subscriptions).values({ userId, planId, status: "active", startDate, endDate, autoRenew: false, paymentMethod: "free" });
  return { success: true as const, subscriptionId: Number((result as any)[0]?.insertId) };
}

export async function cancelSubscription(userId: number, subscriptionId: number) {
  const db = requireDb(await getDb());
  const result = await db.update(subscriptions).set({ status: "cancelled", autoRenew: false }).where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.userId, userId)));
  if (!Number((result as any)[0]?.affectedRows)) throw new Error("الاشتراك غير موجود أو غير تابع لحسابك");
  return { success: true as const };
}

export async function createReport(userId: number, data: { reportedUserId?: number; listingId?: number; reason: string; description?: string }) {
  const db = requireDb(await getDb());
  if (!data.reportedUserId && !data.listingId) throw new Error("يجب تحديد المستخدم أو الإعلان المبلغ عنه");
  if (data.reportedUserId === userId) throw new Error("لا يمكنك الإبلاغ عن نفسك");
  if (data.reportedUserId !== undefined) {
    const target = await db.select({ id: users.id }).from(users).where(eq(users.id, data.reportedUserId)).limit(1);
    if (!target.length) throw new Error("المستخدم غير موجود");
  }
  if (data.listingId !== undefined) {
    const listing = await db.select({ id: listings.id }).from(listings).where(eq(listings.id, data.listingId)).limit(1);
    if (!listing.length) throw new Error("الإعلان غير موجود");
  }
  const reason = data.reason.trim();
  if (!reason) throw new Error("سبب البلاغ مطلوب");
  const result = await db.insert(reports).values({ reporterId: userId, reportedUserId: data.reportedUserId ?? null, listingId: data.listingId ?? null, reason, description: data.description?.trim() || null, status: "pending" });
  return { success: true as const, reportId: Number((result as any)[0]?.insertId) };
}

export async function listReports(limit = 50, offset = 0) {
  const db = requireDb(await getDb());
  return db.select().from(reports).orderBy(reports.createdAt).limit(Math.min(Math.max(limit, 1), 100)).offset(Math.max(offset, 0));
}

export async function resolveReport(reportId: number, status: "reviewed" | "resolved" | "dismissed", adminNotes?: string) {
  const db = requireDb(await getDb());
  const result = await db.update(reports).set({ status, adminNotes: adminNotes?.trim() || null, resolvedAt: status === "resolved" || status === "dismissed" ? new Date() : null }).where(eq(reports.id, reportId));
  if (!Number((result as any)[0]?.affectedRows)) throw new Error("البلاغ غير موجود");
  return { success: true as const };
}
