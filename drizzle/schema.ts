import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, longtext, index } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with BookHub-specific roles and profile information.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["reader", "author", "publisher", "bookstore", "admin"]).default("reader").notNull(),
  profileImage: varchar("profileImage", { length: 512 }),
  bio: longtext("bio"),
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  roleIdx: index("role_idx").on(table.role),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categories for book classification
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull().unique(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Authors profile information
 */
export const authors = mysqlTable("authors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  bio: longtext("bio"),
  profileImage: varchar("profileImage", { length: 512 }),
  website: varchar("website", { length: 256 }),
  socialLinks: text("socialLinks"), // JSON
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Author = typeof authors.$inferSelect;
export type InsertAuthor = typeof authors.$inferInsert;

/**
 * Publishers profile information
 */
export const publishers = mysqlTable("publishers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  companyName: varchar("companyName", { length: 256 }).notNull(),
  bio: longtext("bio"),
  logo: varchar("logo", { length: 512 }),
  website: varchar("website", { length: 256 }),
  socialLinks: text("socialLinks"), // JSON
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Publisher = typeof publishers.$inferSelect;
export type InsertPublisher = typeof publishers.$inferInsert;

/**
 * Bookstores profile information
 */
export const bookstores = mysqlTable("bookstores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  storeName: varchar("storeName", { length: 256 }).notNull(),
  bio: longtext("bio"),
  logo: varchar("logo", { length: 512 }),
  website: varchar("website", { length: 256 }),
  address: text("address"),
  socialLinks: text("socialLinks"), // JSON
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Bookstore = typeof bookstores.$inferSelect;
export type InsertBookstore = typeof bookstores.$inferInsert;

/**
 * Books catalog
 */
export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: longtext("description"),
  cover: varchar("cover", { length: 512 }),
  authorId: int("authorId").notNull(),
  publisherId: int("publisherId"),
  categoryId: int("categoryId").notNull(),
  language: varchar("language", { length: 64 }).default("ar"),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 3 }).default("USD"),
  isbn: varchar("isbn", { length: 20 }).unique(),
  publicationDate: timestamp("publicationDate"),
  pages: int("pages"),
  format: varchar("format", { length: 64 }), // digital, physical, both
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: int("reviewCount").default(0),
  isPublished: boolean("isPublished").default(false),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  authorIdx: index("author_idx").on(table.authorId),
  publisherIdx: index("publisher_idx").on(table.publisherId),
  categoryIdx: index("category_idx").on(table.categoryId),
  titleIdx: index("title_idx").on(table.title),
}));

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

/**
 * Advertisements and featured listings
 */
export const advertisements = mysqlTable("advertisements", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("bookId").notNull(),
  userId: int("userId").notNull(), // Author or Publisher
  title: varchar("title", { length: 256 }),
  description: text("description"),
  image: varchar("image", { length: 512 }),
  type: mysqlEnum("type", ["featured", "promoted", "banner"]).notNull(),
  status: mysqlEnum("status", ["active", "inactive", "expired"]).default("active"),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isPaid: boolean("isPaid").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  bookIdx: index("book_idx").on(table.bookId),
  userIdx: index("user_idx").on(table.userId),
}));

export type Advertisement = typeof advertisements.$inferSelect;
export type InsertAdvertisement = typeof advertisements.$inferInsert;

/**
 * Subscription plans for authors and publishers
 */
export const subscriptionPlans = mysqlTable("subscriptionPlans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  billingCycle: mysqlEnum("billingCycle", ["monthly", "quarterly", "yearly"]).notNull(),
  features: text("features"), // JSON array
  maxBooks: int("maxBooks"),
  maxAds: int("maxAds"),
  adDuration: int("adDuration"), // days
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

/**
 * User subscriptions
 */
export const userSubscriptions = mysqlTable("userSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  planId: int("planId").notNull(),
  status: mysqlEnum("status", ["active", "inactive", "expired", "cancelled"]).default("active"),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 256 }),
  autoRenew: boolean("autoRenew").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_sub_idx").on(table.userId),
}));

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;

/**
 * Orders and payments
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderType: mysqlEnum("orderType", ["subscription", "advertisement", "featured_listing"]).notNull(),
  referenceId: int("referenceId").notNull(), // planId, adId, etc
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending"),
  stripePaymentId: varchar("stripePaymentId", { length: 256 }),
  invoiceNumber: varchar("invoiceNumber", { length: 64 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("order_user_idx").on(table.userId),
}));

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Book reviews and ratings
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("bookId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5
  title: varchar("title", { length: 256 }),
  content: longtext("content"),
  isVerifiedPurchase: boolean("isVerifiedPurchase").default(false),
  helpful: int("helpful").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  bookIdx: index("review_book_idx").on(table.bookId),
  userIdx: index("review_user_idx").on(table.userId),
}));

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Relations
 */
export const usersRelations = relations(users, ({ one, many }) => ({
  author: one(authors, {
    fields: [users.id],
    references: [authors.userId],
  }),
  publisher: one(publishers, {
    fields: [users.id],
    references: [publishers.userId],
  }),
  bookstore: one(bookstores, {
    fields: [users.id],
    references: [bookstores.userId],
  }),
  subscriptions: many(userSubscriptions),
  orders: many(orders),
  reviews: many(reviews),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  author: one(authors, {
    fields: [books.authorId],
    references: [authors.id],
  }),
  publisher: one(publishers, {
    fields: [books.publisherId],
    references: [publishers.id],
  }),
  category: one(categories, {
    fields: [books.categoryId],
    references: [categories.id],
  }),
  advertisements: many(advertisements),
  reviews: many(reviews),
}));

export const authorsRelations = relations(authors, ({ one, many }) => ({
  user: one(users, {
    fields: [authors.userId],
    references: [users.id],
  }),
  books: many(books),
}));

export const publishersRelations = relations(publishers, ({ one, many }) => ({
  user: one(users, {
    fields: [publishers.userId],
    references: [users.id],
  }),
  books: many(books),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  books: many(books),
}));

export const advertisementsRelations = relations(advertisements, ({ one }) => ({
  book: one(books, {
    fields: [advertisements.bookId],
    references: [books.id],
  }),
  user: one(users, {
    fields: [advertisements.userId],
    references: [users.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  book: one(books, {
    fields: [reviews.bookId],
    references: [books.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  subscriptions: many(userSubscriptions),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [userSubscriptions.userId],
    references: [users.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [userSubscriptions.planId],
    references: [subscriptionPlans.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));