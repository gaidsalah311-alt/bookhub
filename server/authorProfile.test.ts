import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { users, authorProfiles } from "../drizzle/schema";
import { getDb } from "./db";
import { eq } from "drizzle-orm";

let db: Awaited<ReturnType<typeof getDb>>;

beforeEach(async () => {
  db = await getDb();
  if (!db) {
    throw new Error("Database not available for tests");
  }
  // Clear tables before each test
  await db.delete(authorProfiles);
  await db.delete(users);
});

function createAuthContext(userRole: 'user' | 'admin' = 'user', openId: string = 'test-user-id'): { ctx: TrpcContext } {
  const user = {
    id: 1,
    openId: openId,
    email: `${openId}@example.com`,
    name: `Test User ${openId}`,
    loginMethod: "manus",
    role: userRole,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

describe("author profile procedures", () => {
  it("should create an author profile if one does not exist", async () => {
    const { ctx } = createAuthContext('user', 'new-author-id');
    const caller = appRouter.createCaller(ctx);

    await db.insert(users).values(ctx.user);

    const newProfileData = {
      bio: "A new author bio",
      website: "https://newauthor.com",
      socialLinks: { twitter: "@newauthor" },
    };

    const result = await caller.profiles.updateAuthor(newProfileData);
    expect(result.success).toBe(true);

    const profile = await db.select().from(authorProfiles).where(eq(authorProfiles.userId, ctx.user.id)).limit(1);
    expect(profile).toHaveLength(1);
    expect(profile[0]?.bio).toBe(newProfileData.bio);
  });

  it("should update an existing author profile", async () => {
    const { ctx } = createAuthContext('user', 'existing-author-id');
    const caller = appRouter.createCaller(ctx);

    await db.insert(users).values(ctx.user);
    await db.insert(authorProfiles).values({
      userId: ctx.user.id,
      bio: "Initial bio",
      website: "https://initial.com",
      socialLinks: { facebook: "@initial" },
    });

    const updatedProfileData = {
      bio: "Updated author bio",
      website: "https://updated.com",
      socialLinks: { twitter: "@updated" },
    };

    const result = await caller.profiles.updateAuthor(updatedProfileData);
    expect(result.success).toBe(true);

    const profile = await db.select().from(authorProfiles).where(eq(authorProfiles.userId, ctx.user.id)).limit(1);
    expect(profile).toHaveLength(1);
    expect(profile[0]?.bio).toBe(updatedProfileData.bio);
    expect(profile[0]?.website).toBe(updatedProfileData.website);
    const rawSocialLinks = profile[0]?.socialLinks;
    const socialLinks = typeof rawSocialLinks === "string" ? JSON.parse(rawSocialLinks) : rawSocialLinks;
    expect(socialLinks).toEqual(updatedProfileData.socialLinks);
  });

  it("should fetch an author profile", async () => {
    const { ctx } = createAuthContext('user', 'fetch-author-id');
    const caller = appRouter.createCaller(ctx);

    await db.insert(users).values(ctx.user);
    const initialProfile = {
      userId: ctx.user.id,
      bio: "Fetch bio",
      website: "https://fetch.com",
      socialLinks: { linkedin: "@fetch" },
    };
    await db.insert(authorProfiles).values(initialProfile);

    const fetchedProfile = await caller.profiles.author({ userId: ctx.user.id });
    expect(fetchedProfile).toEqual(expect.objectContaining(initialProfile));
  });

  it("should return null if author profile does not exist", async () => {
    const { ctx } = createAuthContext('user', 'non-existent-author-id');
    const caller = appRouter.createCaller(ctx);

    await db.insert(users).values(ctx.user);

    const fetchedProfile = await caller.profiles.author({ userId: ctx.user.id });
    expect(fetchedProfile).toBeNull();
  });
});
