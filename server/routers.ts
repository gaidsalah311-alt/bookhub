import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getUserById, getCategories, searchListings, getListingById, getUserListings,
  getUserConversations, getConversationMessages, getUserFavorites, getUserFollowing,
  getUserFollowers, getSubscriptionPlans, getUserActiveSubscription, getUserNotifications,
  getUnreadNotificationsCount, getUserRatings, getUserAverageRating, getAuthorProfile,
  getLibraryProfile, getPublisherProfile, updateAuthorProfile, updateLibraryProfile,
  updatePublisherProfile,
} from "./db";
import {
  createListing, updateListing, deleteListing, sendMessage, markMessageRead,
  addFavorite, removeFavorite, followUser, unfollowUser, markNotificationRead,
  createRating, subscribeToPlan, cancelSubscription, createReport, listReports, resolveReport,
} from "./marketplace";
import { TRPCError } from "@trpc/server";

const pagination = {
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
};

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(async ({ ctx }) => ctx.user ?? null),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    profile: protectedProcedure.query(async ({ ctx }) => {
      const user = await getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      let profile = null;
      if (user.role === "author") profile = await getAuthorProfile(user.id);
      else if (user.role === "library") profile = await getLibraryProfile(user.id);
      else if (user.role === "publisher") profile = await getPublisherProfile(user.id);
      return { user, profile };
    }),
  }),

  books: router({
    categories: publicProcedure.query(() => getCategories()),
    search: publicProcedure.input(z.object({
      query: z.string().trim().min(1).max(200), categoryId: z.number().int().positive().optional(), country: z.string().max(100).optional(),
      language: z.string().max(10).optional(), type: z.enum(["paper", "digital", "external_link"]).optional(),
      minPrice: z.number().nonnegative().optional(), maxPrice: z.number().nonnegative().optional(), ...pagination,
    })).query(({ input }) => searchListings(input.query, input)),
    getById: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => {
      const listing = await getListingById(input.id);
      if (!listing) throw new TRPCError({ code: "NOT_FOUND" });
      return listing;
    }),
    getUserListings: publicProcedure.input(z.object({ userId: z.number().int().positive(), ...pagination }))
      .query(({ input }) => getUserListings(input.userId, input.limit, input.offset)),
    create: protectedProcedure.input(z.object({
      bookId: z.number().int().positive(), type: z.enum(["paper", "digital", "external_link"]),
      condition: z.enum(["new", "like_new", "good", "fair"]).optional(), price: z.number().positive(),
      currency: z.string().trim().min(1).max(10), country: z.string().trim().min(1).max(100),
      externalLink: z.string().url().optional(), externalPlatform: z.string().trim().max(100).optional(), description: z.string().max(10000).optional(),
    })).mutation(({ ctx, input }) => createListing(ctx.user.id, input)),
    update: protectedProcedure.input(z.object({
      listingId: z.number().int().positive(), price: z.number().positive().optional(),
      description: z.string().max(10000).optional(), status: z.enum(["active", "sold", "archived"]).optional(),
    })).mutation(({ ctx, input }) => updateListing(ctx.user.id, input.listingId, input)),
    delete: protectedProcedure.input(z.object({ listingId: z.number().int().positive() }))
      .mutation(({ ctx, input }) => deleteListing(ctx.user.id, input.listingId)),
  }),

  messages: router({
    conversations: protectedProcedure.input(z.object(pagination)).query(({ ctx, input }) => getUserConversations(ctx.user.id, input.limit, input.offset)),
    getConversationMessages: protectedProcedure.input(z.object({ conversationId: z.number().int().positive(), ...pagination }))
      .query(async ({ ctx, input }) => {
        const rows = await getUserConversations(ctx.user.id, 100, 0);
        if (!rows.some((row: any) => row.id === input.conversationId)) throw new TRPCError({ code: "FORBIDDEN" });
        return getConversationMessages(input.conversationId, input.limit, input.offset);
      }),
    sendMessage: protectedProcedure.input(z.object({ conversationId: z.number().int().positive(), content: z.string().trim().min(1).max(5000), image: z.string().url().optional() }))
      .mutation(({ ctx, input }) => sendMessage(ctx.user.id, input.conversationId, input.content, input.image)),
    markAsRead: protectedProcedure.input(z.object({ messageId: z.number().int().positive() })).mutation(({ ctx, input }) => markMessageRead(ctx.user.id, input.messageId)),
  }),

  favorites: router({
    list: protectedProcedure.input(z.object(pagination)).query(({ ctx, input }) => getUserFavorites(ctx.user.id, input.limit, input.offset)),
    add: protectedProcedure.input(z.object({ listingId: z.number().int().positive() })).mutation(({ ctx, input }) => addFavorite(ctx.user.id, input.listingId)),
    remove: protectedProcedure.input(z.object({ listingId: z.number().int().positive() })).mutation(({ ctx, input }) => removeFavorite(ctx.user.id, input.listingId)),
  }),

  follows: router({
    following: protectedProcedure.input(z.object(pagination)).query(({ ctx, input }) => getUserFollowing(ctx.user.id, input.limit, input.offset)),
    followers: publicProcedure.input(z.object({ userId: z.number().int().positive(), ...pagination })).query(({ input }) => getUserFollowers(input.userId, input.limit, input.offset)),
    follow: protectedProcedure.input(z.object({ userId: z.number().int().positive() })).mutation(({ ctx, input }) => followUser(ctx.user.id, input.userId)),
    unfollow: protectedProcedure.input(z.object({ userId: z.number().int().positive() })).mutation(({ ctx, input }) => unfollowUser(ctx.user.id, input.userId)),
  }),

  subscriptions: router({
    plans: publicProcedure.query(() => getSubscriptionPlans()),
    active: protectedProcedure.query(({ ctx }) => getUserActiveSubscription(ctx.user.id)),
    subscribe: protectedProcedure.input(z.object({ planId: z.number().int().positive() })).mutation(({ ctx, input }) => subscribeToPlan(ctx.user.id, input.planId)),
    cancel: protectedProcedure.input(z.object({ subscriptionId: z.number().int().positive() })).mutation(({ ctx, input }) => cancelSubscription(ctx.user.id, input.subscriptionId)),
  }),

  notifications: router({
    list: protectedProcedure.input(z.object(pagination)).query(({ ctx, input }) => getUserNotifications(ctx.user.id, input.limit, input.offset)),
    unreadCount: protectedProcedure.query(({ ctx }) => getUnreadNotificationsCount(ctx.user.id)),
    markAsRead: protectedProcedure.input(z.object({ notificationId: z.number().int().positive() })).mutation(({ ctx, input }) => markNotificationRead(ctx.user.id, input.notificationId)),
  }),

  ratings: router({
    userRatings: publicProcedure.input(z.object({ userId: z.number().int().positive(), ...pagination })).query(({ input }) => getUserRatings(input.userId, input.limit, input.offset)),
    userAverageRating: publicProcedure.input(z.object({ userId: z.number().int().positive() })).query(({ input }) => getUserAverageRating(input.userId)),
    create: protectedProcedure.input(z.object({ targetUserId: z.number().int().positive(), listingId: z.number().int().positive().optional(), rating: z.number().int().min(1).max(5), comment: z.string().max(5000).optional() })).mutation(({ ctx, input }) => createRating(ctx.user.id, input)),
  }),

  reports: router({
    create: protectedProcedure.input(z.object({ reportedUserId: z.number().int().positive().optional(), listingId: z.number().int().positive().optional(), reason: z.string().trim().min(3).max(255), description: z.string().max(5000).optional() })).mutation(({ ctx, input }) => createReport(ctx.user.id, input)),
    list: adminProcedure.input(z.object(pagination)).query(({ input }) => listReports(input.limit, input.offset)),
    resolve: adminProcedure.input(z.object({ reportId: z.number().int().positive(), status: z.enum(["reviewed", "resolved", "dismissed"]), adminNotes: z.string().max(5000).optional() })).mutation(({ input }) => resolveReport(input.reportId, input.status, input.adminNotes)),
  }),

  profiles: router({
    author: publicProcedure.input(z.object({ userId: z.number().int().positive() })).query(({ input }) => getAuthorProfile(input.userId)),
    library: publicProcedure.input(z.object({ userId: z.number().int().positive() })).query(({ input }) => getLibraryProfile(input.userId)),
    publisher: publicProcedure.input(z.object({ userId: z.number().int().positive() })).query(({ input }) => getPublisherProfile(input.userId)),
    updateAuthor: protectedProcedure.input(z.object({ website: z.string().url().optional(), bio: z.string().max(10000).optional(), socialLinks: z.record(z.string(), z.string()).optional() })).mutation(({ ctx, input }) => updateAuthorProfile(ctx.user.id, input)),
    updateLibrary: protectedProcedure.input(z.object({ libraryName: z.string().min(1).max(255).optional(), website: z.string().url().optional(), address: z.string().max(1000).optional(), phone: z.string().max(30).optional(), email: z.string().email().optional(), bio: z.string().max(10000).optional() })).mutation(({ ctx, input }) => updateLibraryProfile(ctx.user.id, input)),
    updatePublisher: protectedProcedure.input(z.object({ publisherName: z.string().min(1).max(255).optional(), website: z.string().url().optional(), address: z.string().max(1000).optional(), phone: z.string().max(30).optional(), email: z.string().email().optional(), bio: z.string().max(10000).optional() })).mutation(({ ctx, input }) => updatePublisherProfile(ctx.user.id, input)),
  }),
});

export type AppRouter = typeof appRouter;
