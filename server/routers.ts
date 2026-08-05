import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================================
  // CATEGORIES
  // ============================================================================
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getCategories();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getCategoryBySlug(input.slug);
      }),
  }),

  // ============================================================================
  // BOOKS
  // ============================================================================
  books: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await db.getBooks(input.limit, input.offset);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const book = await db.getBookById(input.id);
        if (!book) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Book not found' });
        }
        return book;
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const book = await db.getBookBySlug(input.slug);
        if (!book) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Book not found' });
        }
        return book;
      }),

    featured: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return await db.getFeaturedBooks(input.limit);
      }),

    search: publicProcedure
      .input(
        z.object({
          query: z.string().min(1),
          categoryId: z.number().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          language: z.string().optional(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await db.searchBooks(
          input.query,
          input.categoryId,
          input.minPrice,
          input.maxPrice,
          input.language,
          input.limit,
          input.offset
        );
      }),
  }),

  // ============================================================================
  // AUTHORS
  // ============================================================================
  authors: router({
    getByUserId: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAuthorByUserId(input.userId);
      }),

    getBooks: publicProcedure
      .input(z.object({ authorId: z.number(), limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return await db.getAuthorBooks(input.authorId, input.limit);
      }),
  }),

  // ============================================================================
  // PUBLISHERS
  // ============================================================================
  publishers: router({
    getByUserId: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getPublisherByUserId(input.userId);
      }),

    getBooks: publicProcedure
      .input(z.object({ publisherId: z.number(), limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return await db.getPublisherBooks(input.publisherId, input.limit);
      }),
  }),

  // ============================================================================
  // BOOKSTORES
  // ============================================================================
  bookstores: router({
    getByUserId: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getBookstoreByUserId(input.userId);
      }),
  }),

  // ============================================================================
  // SUBSCRIPTIONS
  // ============================================================================
  subscriptions: router({
    plans: publicProcedure.query(async () => {
      return await db.getSubscriptionPlans();
    }),

    getUserSubscription: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserSubscription(ctx.user.id);
    }),
  }),

  // ============================================================================
  // ADVERTISEMENTS
  // ============================================================================
  advertisements: router({
    getActive: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return await db.getActiveAdvertisements(input.limit);
      }),
  }),

  // ============================================================================
  // REVIEWS
  // ============================================================================
  reviews: router({
    getByBook: publicProcedure
      .input(z.object({ bookId: z.number(), limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return await db.getBookReviews(input.bookId, input.limit);
      }),
  }),

  // ============================================================================
  // ORDERS
  // ============================================================================
  orders: router({
    getUserOrders: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ ctx, input }) => {
        return await db.getUserOrders(ctx.user.id, input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
