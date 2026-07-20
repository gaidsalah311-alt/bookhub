import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getUserBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getUserCategories,
  createCategory,
  getBookStatistics,
} from "./db";

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

  books: router({
    list: protectedProcedure.query(({ ctx }) => getUserBooks(ctx.user.id)),
    
    get: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "number") return val;
        throw new Error("Invalid input");
      })
      .query(({ ctx, input }) => getBookById(input, ctx.user.id)),
    
    create: protectedProcedure
      .input((val: unknown) => {
        if (
          typeof val === "object" &&
          val !== null &&
          "title" in val &&
          "author" in val
        ) {
          return val as {
            title: string;
            author: string;
            description?: string;
            categoryId?: number;
            publishYear?: number;
            rating?: number;
            readingStatus?: "مقروء" | "قيد القراءة" | "لم يُقرأ";
            coverImageUrl?: string;
          };
        }
        throw new Error("Invalid input");
      })
      .mutation(({ ctx, input }) =>
        createBook({
          userId: ctx.user.id,
          ...input,
        } as any)
      ),
    
    update: protectedProcedure
      .input((val: unknown) => {
        if (
          typeof val === "object" &&
          val !== null &&
          "id" in val &&
          typeof (val as any).id === "number"
        ) {
          const { id, ...updates } = val as any;
          return { id, updates };
        }
        throw new Error("Invalid input");
      })
      .mutation(({ ctx, input }) =>
        updateBook(input.id, ctx.user.id, input.updates as any)
      ),
    
    delete: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "number") return val;
        throw new Error("Invalid input");
      })
      .mutation(({ ctx, input }) => deleteBook(input, ctx.user.id)),
  }),
  
  categories: router({
    list: protectedProcedure.query(({ ctx }) =>
      getUserCategories(ctx.user.id)
    ),
    
    create: protectedProcedure
      .input((val: unknown) => {
        if (
          typeof val === "object" &&
          val !== null &&
          "name" in val &&
          typeof (val as any).name === "string"
        ) {
          return val as { name: string; description?: string; color?: string };
        }
        throw new Error("Invalid input");
      })
      .mutation(({ ctx, input }) =>
        createCategory({
          userId: ctx.user.id,
          ...input,
        } as any)
      ),
  }),
  
  stats: router({
    get: protectedProcedure.query(({ ctx }) =>
      getBookStatistics(ctx.user.id)
    ),
  }),
});

export type AppRouter = typeof appRouter;
