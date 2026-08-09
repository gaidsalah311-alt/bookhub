import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  index,
  foreignKey,
  unique,
} from "drizzle-orm/mysql-core";

/**
 * ===== جداول النظام الأساسية =====
 */

export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }).unique(),
    profileImage: text("profileImage"), // URL للصورة الشخصية
    bio: text("bio"), // نبذة قصيرة
    role: mysqlEnum("role", ["user", "author", "library", "publisher", "admin"]).default("user").notNull(),
    country: varchar("country", { length: 100 }), // الدولة
    language: varchar("language", { length: 10 }).default("ar"), // اللغة المفضلة
    currency: varchar("currency", { length: 10 }).default("USD"), // العملة المفضلة
    loginMethod: varchar("loginMethod", { length: 64 }),
    isVerified: boolean("isVerified").default(false), // التحقق من البريد الإلكتروني
    isBanned: boolean("isBanned").default(false), // حظر المستخدم
    subscriptionTier: mysqlEnum("subscriptionTier", ["free", "pro", "publisher", "library"]).default("free"),
    subscriptionExpires: timestamp("subscriptionExpires"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  (table) => [
    index("idx_email").on(table.email),
    index("idx_country").on(table.country),
    index("idx_role").on(table.role),
  ]
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * ===== جداول الملفات الشخصية المتخصصة =====
 */

export const authorProfiles = mysqlTable(
  "author_profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    website: varchar("website", { length: 255 }),
    socialLinks: json("socialLinks"), // { twitter, facebook, instagram, etc }
    bio: text("bio"),
    isVerified: boolean("isVerified").default(false),
    verificationDate: timestamp("verificationDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }).onDelete("cascade"),
    unique("unique_author_user").on(table.userId),
  ]
);

export type AuthorProfile = typeof authorProfiles.$inferSelect;
export type InsertAuthorProfile = typeof authorProfiles.$inferInsert;

export const libraryProfiles = mysqlTable(
  "library_profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    libraryName: varchar("libraryName", { length: 255 }).notNull(),
    logo: text("logo"),
    coverImage: text("coverImage"),
    website: varchar("website", { length: 255 }),
    address: text("address"),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 320 }),
    bio: text("bio"),
    isVerified: boolean("isVerified").default(false),
    verificationDate: timestamp("verificationDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }).onDelete("cascade"),
    unique("unique_library_user").on(table.userId),
  ]
);

export type LibraryProfile = typeof libraryProfiles.$inferSelect;
export type InsertLibraryProfile = typeof libraryProfiles.$inferInsert;

export const publisherProfiles = mysqlTable(
  "publisher_profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    publisherName: varchar("publisherName", { length: 255 }).notNull(),
    logo: text("logo"),
    coverImage: text("coverImage"),
    website: varchar("website", { length: 255 }),
    address: text("address"),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 320 }),
    bio: text("bio"),
    isVerified: boolean("isVerified").default(false),
    verificationDate: timestamp("verificationDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }).onDelete("cascade"),
    unique("unique_publisher_user").on(table.userId),
  ]
);

export type PublisherProfile = typeof publisherProfiles.$inferSelect;
export type InsertPublisherProfile = typeof publisherProfiles.$inferInsert;

/**
 * ===== جداول التصنيفات =====
 */

export const categories = mysqlTable(
  "categories",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    nameAr: varchar("nameAr", { length: 255 }).notNull().unique(),
    nameEn: varchar("nameEn", { length: 255 }).notNull().unique(),
    nameFr: varchar("nameFr", { length: 255 }).notNull().unique(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    icon: text("icon"), // URL أو SVG
    description: text("description"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("idx_slug").on(table.slug)]
);

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export const subcategories = mysqlTable(
  "subcategories",
  {
    id: int("id").autoincrement().primaryKey(),
    categoryId: int("categoryId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    nameAr: varchar("nameAr", { length: 255 }).notNull(),
    nameEn: varchar("nameEn", { length: 255 }).notNull(),
    nameFr: varchar("nameFr", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.categoryId], foreignColumns: [categories.id] }).onDelete("cascade"),
    unique("unique_subcat_slug").on(table.categoryId, table.slug),
  ]
);

export type Subcategory = typeof subcategories.$inferSelect;
export type InsertSubcategory = typeof subcategories.$inferInsert;

/**
 * ===== جداول الكتب والإعلانات =====
 */

export const books = mysqlTable(
  "books",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    description: text("description"),
    categoryId: int("categoryId").notNull(),
    subcategoryId: int("subcategoryId"),
    language: varchar("language", { length: 10 }).notNull(),
    isbn: varchar("isbn", { length: 20 }).unique(),
    publishDate: timestamp("publishDate"),
    publisher: varchar("publisher", { length: 255 }),
    pages: int("pages"),
    coverImage: text("coverImage"), // URL للصورة
    images: json("images"), // قائمة صور إضافية
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.categoryId], foreignColumns: [categories.id] }).onDelete("restrict"),
    foreignKey({ columns: [table.subcategoryId], foreignColumns: [subcategories.id] }).onDelete("set null"),
    index("idx_title").on(table.title),
    index("idx_author").on(table.author),
  ]
);

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

export const listings = mysqlTable(
  "listings",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(), // المعلن
    bookId: int("bookId").notNull(),
    type: mysqlEnum("type", ["paper", "digital", "external_link"]).notNull(),
    condition: mysqlEnum("condition", ["new", "like_new", "good", "fair"]).default("new"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).default("USD"),
    country: varchar("country", { length: 100 }).notNull(),
    externalLink: varchar("externalLink", { length: 500 }), // رابط Amazon أو منصات أخرى
    externalPlatform: varchar("externalPlatform", { length: 100 }), // اسم المنصة
    description: text("description"),
    status: mysqlEnum("status", ["active", "sold", "archived", "pending_review"]).default("pending_review"),
    views: int("views").default(0),
    shares: int("shares").default(0),
    favorites: int("favorites").default(0),
    isPremium: boolean("isPremium").default(false),
    premiumTier: mysqlEnum("premiumTier", ["standard", "gold"]),
    premiumExpires: timestamp("premiumExpires"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    expiresAt: timestamp("expiresAt"), // انتهاء الإعلان
  },
  (table) => [
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.bookId], foreignColumns: [books.id] }).onDelete("cascade"),
    index("idx_user_listings").on(table.userId),
    index("idx_status").on(table.status),
    index("idx_country").on(table.country),
    index("idx_created").on(table.createdAt),
  ]
);

export type Listing = typeof listings.$inferSelect;
export type InsertListing = typeof listings.$inferInsert;

/**
 * ===== جداول الرسائل والتواصل =====
 */

export const conversations = mysqlTable(
  "conversations",
  {
    id: int("id").autoincrement().primaryKey(),
    userId1: int("userId1").notNull(), // المستخدم الأول
    userId2: int("userId2").notNull(), // المستخدم الثاني
    listingId: int("listingId"), // الإعلان المتعلق به
    lastMessage: text("lastMessage"),
    lastMessageAt: timestamp("lastMessageAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.userId1], foreignColumns: [users.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.userId2], foreignColumns: [users.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.listingId], foreignColumns: [listings.id] }).onDelete("set null"),
    unique("unique_conversation").on(table.userId1, table.userId2),
  ]
);

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

export const messages = mysqlTable(
  "messages",
  {
    id: int("id").autoincrement().primaryKey(),
    conversationId: int("conversationId").notNull(),
    senderId: int("senderId").notNull(),
    content: text("content").notNull(),
    image: text("image"), // صورة اختيارية
    isRead: boolean("isRead").default(false),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.conversationId], foreignColumns: [conversations.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.senderId], foreignColumns: [users.id] }).onDelete("cascade"),
    index("idx_conversation").on(table.conversationId),
    index("idx_created").on(table.createdAt),
  ]
);

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * ===== جداول المفضلة والمتابعة =====
 */

export const favorites = mysqlTable(
  "favorites",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    listingId: int("listingId").notNull(),
    list: varchar("list", { length: 100 }).default("default"), // قائمة المفضلة
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.listingId], foreignColumns: [listings.id] }).onDelete("cascade"),
    unique("unique_favorite").on(table.userId, table.listingId),
  ]
);

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

export const follows = mysqlTable(
  "follows",
  {
    id: int("id").autoincrement().primaryKey(),
    followerId: int("followerId").notNull(), // من يتابع
    followingId: int("followingId").notNull(), // من يتم متابعته
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.followerId], foreignColumns: [users.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.followingId], foreignColumns: [users.id] }).onDelete("cascade"),
    unique("unique_follow").on(table.followerId, table.followingId),
  ]
);

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = typeof follows.$inferInsert;

/**
 * ===== جداول الاشتراكات والدفع =====
 */

export const subscriptionPlans = mysqlTable(
  "subscription_plans",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    tier: mysqlEnum("tier", ["free", "pro", "publisher", "library"]).notNull().unique(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).default("USD"),
    duration: int("duration").notNull(), // بالأيام
    maxListings: int("maxListings"), // عدد الإعلانات المسموح
    features: json("features"), // قائمة الميزات
    description: text("description"),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    planId: int("planId").notNull(),
    status: mysqlEnum("status", ["active", "cancelled", "expired"]).default("active"),
    startDate: timestamp("startDate").defaultNow().notNull(),
    endDate: timestamp("endDate").notNull(),
    autoRenew: boolean("autoRenew").default(true),
    paymentMethod: varchar("paymentMethod", { length: 100 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.planId], foreignColumns: [subscriptionPlans.id] }).onDelete("restrict"),
  ]
);

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * ===== جداول التقييمات والبلاغات =====
 */

export const ratings = mysqlTable(
  "ratings",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(), // المقيّم
    targetUserId: int("targetUserId").notNull(), // المستخدم المقيّم
    listingId: int("listingId"),
    rating: int("rating").notNull(), // من 1 إلى 5
    comment: text("comment"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.targetUserId], foreignColumns: [users.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.listingId], foreignColumns: [listings.id] }).onDelete("set null"),
  ]
);

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = typeof ratings.$inferInsert;

export const reports = mysqlTable(
  "reports",
  {
    id: int("id").autoincrement().primaryKey(),
    reporterId: int("reporterId").notNull(),
    reportedUserId: int("reportedUserId"),
    listingId: int("listingId"),
    reason: varchar("reason", { length: 255 }).notNull(),
    description: text("description"),
    status: mysqlEnum("status", ["pending", "reviewed", "resolved", "dismissed"]).default("pending"),
    adminNotes: text("adminNotes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    resolvedAt: timestamp("resolvedAt"),
  },
  (table) => [
    foreignKey({ columns: [table.reporterId], foreignColumns: [users.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.reportedUserId], foreignColumns: [users.id] }).onDelete("set null"),
    foreignKey({ columns: [table.listingId], foreignColumns: [listings.id] }).onDelete("set null"),
  ]
);

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * ===== جداول الإشعارات =====
 */

export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    type: varchar("type", { length: 100 }).notNull(), // message, follow, new_book, etc
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message"),
    relatedId: int("relatedId"), // ID الكائن المتعلق (user, listing, etc)
    isRead: boolean("isRead").default(false),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }).onDelete("cascade"),
    index("idx_user_notifications").on(table.userId),
    index("idx_created").on(table.createdAt),
  ]
);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * ===== جداول الإعلانات المميزة والحملات =====
 */

export const premiumAds = mysqlTable(
  "premium_ads",
  {
    id: int("id").autoincrement().primaryKey(),
    listingId: int("listingId").notNull(),
    tier: mysqlEnum("tier", ["gold", "platinum"]).notNull(),
    startDate: timestamp("startDate").defaultNow().notNull(),
    endDate: timestamp("endDate").notNull(),
    position: int("position"), // موضع الظهور
    clicks: int("clicks").default(0),
    impressions: int("impressions").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.listingId], foreignColumns: [listings.id] }).onDelete("cascade"),
  ]
);

export type PremiumAd = typeof premiumAds.$inferSelect;
export type InsertPremiumAd = typeof premiumAds.$inferInsert;

export const campaigns = mysqlTable(
  "campaigns",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(), // دار النشر أو المكتبة
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    startDate: timestamp("startDate").notNull(),
    endDate: timestamp("endDate").notNull(),
    budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
    spent: decimal("spent", { precision: 10, scale: 2 }).default("0"),
    status: mysqlEnum("status", ["active", "paused", "ended"]).default("active"),
    targetCountries: json("targetCountries"), // قائمة الدول المستهدفة
    targetCategories: json("targetCategories"), // قائمة التصنيفات
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.userId], foreignColumns: [users.id] }).onDelete("cascade"),
  ]
);

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

/**
 * ===== جداول الإعدادات والنظام =====
 */

export const settings = mysqlTable(
  "settings",
  {
    id: int("id").autoincrement().primaryKey(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    value: text("value"),
    type: varchar("type", { length: 50 }), // string, number, boolean, json
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;

export const countries = mysqlTable(
  "countries",
  {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 2 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    nameAr: varchar("nameAr", { length: 255 }),
    currency: varchar("currency", { length: 10 }).notNull(),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  }
);

export type Country = typeof countries.$inferSelect;
export type InsertCountry = typeof countries.$inferInsert;
