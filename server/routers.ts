import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import {
  getUserBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getUserCategories,
  createCategory,
  getBookStatistics,
  getBookNote,
  upsertBookNote,
  deleteBookNote,
  getUserLibraryExport,
} from "./db";

export function parseBookNoteInput(value: unknown) {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid note input");
  }

  const input = value as Record<string, unknown>;
  if (!Number.isInteger(input.bookId) || (input.bookId as number) <= 0) {
    throw new Error("Invalid book id");
  }

  let note: string | null | undefined;
  if (input.note !== undefined && input.note !== null) {
    if (typeof input.note !== "string" || input.note.length > 10000) {
      throw new Error("Note must be a text value up to 10000 characters");
    }
    note = input.note.trim() || null;
  } else if (input.note === null) {
    note = null;
  }

  let personalRating: number | null | undefined;
  if (input.personalRating !== undefined && input.personalRating !== null) {
    if (
      !Number.isInteger(input.personalRating) ||
      (input.personalRating as number) < 1 ||
      (input.personalRating as number) > 5
    ) {
      throw new Error("Personal rating must be an integer from 1 to 5");
    }
    personalRating = input.personalRating as number;
  } else if (input.personalRating === null) {
    personalRating = null;
  }

  if (
    (note === undefined || note === null) &&
    (personalRating === undefined || personalRating === null)
  ) {
    throw new Error("Add a note or a personal rating, or delete the note");
  }

  return {
    bookId: input.bookId as number,
    ...(note !== undefined ? { note } : {}),
    ...(personalRating !== undefined ? { personalRating } : {}),
  };
}

export function parseCoverUploadInput(value: unknown) {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid cover input");
  }
  const input = value as Record<string, unknown>;
  const fileName = typeof input.fileName === "string" ? input.fileName : "";
  const mimeType = typeof input.mimeType === "string" ? input.mimeType : "";
  const dataBase64 = typeof input.dataBase64 === "string" ? input.dataBase64 : "";
  if (!fileName || !mimeType || !dataBase64) {
    throw new Error("Cover file is required");
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
    throw new Error("Only JPG, PNG, and WebP covers are supported");
  }
  if (dataBase64.length > 8 * 1024 * 1024) {
    throw new Error("Cover file is too large");
  }
  const safeFileName = fileName
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/^[.-]+/, "")
    .slice(-120);
  return { fileName: safeFileName || "cover", mimeType, dataBase64 };
}

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
      .query(async ({ ctx, input }) => (await getBookById(input, ctx.user.id)) ?? null),
    
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
  
  bookNotes: router({
    get: protectedProcedure
      .input((value: unknown) => {
        if (Number.isInteger(value) && (value as number) > 0) {
          return value as number;
        }
        throw new Error("Invalid book id");
      })
      .query(async ({ ctx, input }) => (await getBookNote(input, ctx.user.id)) ?? null),

    upsert: protectedProcedure
      .input(parseBookNoteInput)
      .mutation(({ ctx, input }) =>
        upsertBookNote({
          userId: ctx.user.id,
          bookId: input.bookId,
          note: input.note,
          personalRating: input.personalRating,
        })
      ),

    delete: protectedProcedure
      .input((value: unknown) => {
        if (Number.isInteger(value) && (value as number) > 0) {
          return value as number;
        }
        throw new Error("Invalid book id");
      })
      .mutation(async ({ ctx, input }) => {
        await deleteBookNote(input, ctx.user.id);
        return { success: true } as const;
      }),
  }),

  stats: router({
    get: protectedProcedure.query(({ ctx }) =>
      getBookStatistics(ctx.user.id)
    ),
  }),

  cover: router({
    upload: protectedProcedure
      .input(parseCoverUploadInput)
      .mutation(async ({ ctx, input }) => {
        const base64 = input.dataBase64.replace(/^data:[^;]+;base64,/, "");
        const bytes = Buffer.from(base64, "base64");
        if (bytes.length === 0 || bytes.length > 5 * 1024 * 1024) {
          throw new Error("Cover file must be between 1 byte and 5 MB");
        }
        const uploaded = await storagePut(
          `users/${ctx.user.id}/covers/${input.fileName}`,
          bytes,
          input.mimeType,
        );
        return {
          ...uploaded,
          mimeType: input.mimeType,
          size: bytes.length,
        };
      }),
  }),

  exports: router({
    library: protectedProcedure.query(({ ctx }) =>
      getUserLibraryExport(ctx.user.id)
    ),
  }),
});

export type AppRouter = typeof appRouter;
