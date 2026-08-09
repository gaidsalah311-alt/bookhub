import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getUserByOpenId,
  getUserById,
  getCategories,
  searchListings,
  getListingById,
  getUserListings,
  getConversation,
  getUserConversations,
  getConversationMessages,
  getUserFavorites,
  getUserFollowing,
  getUserFollowers,
  getSubscriptionPlans,
  getUserActiveSubscription,
  getUserNotifications,
  getUnreadNotificationsCount,
  getUserRatings,
  getUserAverageRating,
  getAuthorProfile,
  getLibraryProfile,
  getPublisherProfile,
} from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,

  /**
   * ===== مسارات المصادقة =====
   */
  auth: router({
    me: publicProcedure.query(async (opts) => {
      if (!opts.ctx.user) return null;
      return opts.ctx.user;
    }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    profile: protectedProcedure.query(async ({ ctx }) => {
      const user = await getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      let profile = null;
      if (user.role === "author") {
        profile = await getAuthorProfile(user.id);
      } else if (user.role === "library") {
        profile = await getLibraryProfile(user.id);
      } else if (user.role === "publisher") {
        profile = await getPublisherProfile(user.id);
      }

      return { user, profile };
    }),
  }),

  /**
   * ===== مسارات الكتب والإعلانات =====
   */
  books: router({
    categories: publicProcedure.query(async () => {
      return await getCategories();
    }),

    search: publicProcedure
      .input(
        z.object({
          query: z.string().min(1),
          categoryId: z.number().optional(),
          country: z.string().optional(),
          language: z.string().optional(),
          type: z.enum(["paper", "digital", "external_link"]).optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await searchListings(input.query, {
          categoryId: input.categoryId,
          country: input.country,
          language: input.language,
          type: input.type,
          minPrice: input.minPrice,
          maxPrice: input.maxPrice,
          limit: input.limit,
          offset: input.offset,
        });
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const listing = await getListingById(input.id);
        if (!listing) throw new TRPCError({ code: "NOT_FOUND" });
        return listing;
      }),

    getUserListings: publicProcedure
      .input(
        z.object({
          userId: z.number(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getUserListings(input.userId, input.limit, input.offset);
      }),

    create: protectedProcedure
      .input(
        z.object({
          bookId: z.number(),
          type: z.enum(["paper", "digital", "external_link"]),
          condition: z.enum(["new", "like_new", "good", "fair"]).optional(),
          price: z.number().positive(),
          currency: z.string().default("USD"),
          country: z.string(),
          externalLink: z.string().optional(),
          externalPlatform: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ إنشاء إعلان جديد
        return { success: true, listingId: 1 };
      }),

    update: protectedProcedure
      .input(
        z.object({
          listingId: z.number(),
          price: z.number().optional(),
          description: z.string().optional(),
          status: z.enum(["active", "sold", "archived"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ تحديث الإعلان
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ listingId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ حذف الإعلان
        return { success: true };
      }),
  }),

  /**
   * ===== مسارات الرسائل =====
   */
  messages: router({
    conversations: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ ctx, input }) => {
        return await getUserConversations(ctx.user.id, input.limit, input.offset);
      }),

    getConversationMessages: protectedProcedure
      .input(
        z.object({
          conversationId: z.number(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getConversationMessages(input.conversationId, input.limit, input.offset);
      }),

    sendMessage: protectedProcedure
      .input(
        z.object({
          conversationId: z.number(),
          content: z.string().min(1).max(5000),
          image: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ إرسال الرسالة
        return { success: true, messageId: 1 };
      }),

    markAsRead: protectedProcedure
      .input(z.object({ messageId: z.number() }))
      .mutation(async ({ input }) => {
        // TODO: تنفيذ تحديث حالة القراءة
        return { success: true };
      }),
  }),

  /**
   * ===== مسارات المفضلة والمتابعة =====
   */
  favorites: router({
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ ctx, input }) => {
        return await getUserFavorites(ctx.user.id, input.limit, input.offset);
      }),

    add: protectedProcedure
      .input(z.object({ listingId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ إضافة إلى المفضلة
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ listingId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ إزالة من المفضلة
        return { success: true };
      }),
  }),

  follows: router({
    following: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ ctx, input }) => {
        return await getUserFollowing(ctx.user.id, input.limit, input.offset);
      }),

    followers: publicProcedure
      .input(
        z.object({
          userId: z.number(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getUserFollowers(input.userId, input.limit, input.offset);
      }),

    follow: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ متابعة مستخدم
        return { success: true };
      }),

    unfollow: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ إلغاء متابعة مستخدم
        return { success: true };
      }),
  }),

  /**
   * ===== مسارات الاشتراكات =====
   */
  subscriptions: router({
    plans: publicProcedure.query(async () => {
      return await getSubscriptionPlans();
    }),

    active: protectedProcedure.query(async ({ ctx }) => {
      return await getUserActiveSubscription(ctx.user.id);
    }),

    subscribe: protectedProcedure
      .input(z.object({ planId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ الاشتراك في خطة
        return { success: true, subscriptionId: 1 };
      }),

    cancel: protectedProcedure
      .input(z.object({ subscriptionId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ إلغاء الاشتراك
        return { success: true };
      }),
  }),

  /**
   * ===== مسارات الإشعارات =====
   */
  notifications: router({
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ ctx, input }) => {
        return await getUserNotifications(ctx.user.id, input.limit, input.offset);
      }),

    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      return await getUnreadNotificationsCount(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        // TODO: تنفيذ تحديث حالة الإشعار
        return { success: true };
      }),
  }),

  /**
   * ===== مسارات التقييمات =====
   */
  ratings: router({
    userRatings: publicProcedure
      .input(
        z.object({
          userId: z.number(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getUserRatings(input.userId, input.limit, input.offset);
      }),

    userAverageRating: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await getUserAverageRating(input.userId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          targetUserId: z.number(),
          listingId: z.number().optional(),
          rating: z.number().min(1).max(5),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ إنشاء تقييم
        return { success: true, ratingId: 1 };
      }),
  }),

  /**
   * ===== مسارات الملفات الشخصية =====
   */
  profiles: router({
    author: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await getAuthorProfile(input.userId);
      }),

    library: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await getLibraryProfile(input.userId);
      }),

    publisher: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await getPublisherProfile(input.userId);
      }),

    updateAuthor: protectedProcedure
      .input(
        z.object({
          website: z.string().optional(),
          bio: z.string().optional(),
          socialLinks: z.record(z.string(), z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ تحديث ملف المؤلف
        return { success: true };
      }),

    updateLibrary: protectedProcedure
      .input(
        z.object({
          libraryName: z.string().optional(),
          website: z.string().optional(),
          address: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          bio: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ تحديث ملف المكتبة
        return { success: true };
      }),

    updatePublisher: protectedProcedure
      .input(
        z.object({
          publisherName: z.string().optional(),
          website: z.string().optional(),
          address: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          bio: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // TODO: تنفيذ تحديث ملف الناشر
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
