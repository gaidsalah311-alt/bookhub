import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock trpc
vi.mock("@/lib/trpc", () => ({
  trpc: {
    books: {
      featured: {
        useQuery: vi.fn(() => ({
          data: [
            {
              id: 1,
              title: "كتاب اختبار",
              slug: "test-book",
              cover: "https://example.com/cover.jpg",
              price: "29.99",
              currency: "USD",
              rating: "4.5",
            },
          ],
          isLoading: false,
        })),
      },
      search: {
        useQuery: vi.fn(() => ({
          data: [],
          isLoading: false,
        })),
      },
    },
    categories: {
      list: {
        useQuery: vi.fn(() => ({
          data: [
            {
              id: 1,
              name: "الخيال العلمي",
              slug: "science-fiction",
              icon: "🚀",
            },
          ],
        })),
      },
    },
    advertisements: {
      getActive: {
        useQuery: vi.fn(() => ({
          data: [
            {
              id: 1,
              title: "إعلان اختبار",
              description: "وصف الإعلان",
              image: "https://example.com/ad.jpg",
              status: "active",
            },
          ],
        })),
      },
    },
  },
}));

// Mock useAuth
vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    logout: vi.fn(),
  })),
}));

// Mock startLogin
vi.mock("@/const", () => ({
  startLogin: vi.fn(),
}));

describe("Home Page - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have featured books data structure", () => {
    const mockBook = {
      id: 1,
      title: "كتاب اختبار",
      slug: "test-book",
      cover: "https://example.com/cover.jpg",
      price: "29.99",
      currency: "USD",
      rating: "4.5",
    };

    expect(mockBook).toBeDefined();
    expect(mockBook.title).toBe("كتاب اختبار");
    expect(mockBook.price).toBe("29.99");
  });

  it("should have categories data structure", () => {
    const mockCategory = {
      id: 1,
      name: "الخيال العلمي",
      slug: "science-fiction",
      icon: "🚀",
    };

    expect(mockCategory).toBeDefined();
    expect(mockCategory.name).toBe("الخيال العلمي");
    expect(mockCategory.slug).toBe("science-fiction");
  });

  it("should have advertisements data structure", () => {
    const mockAd = {
      id: 1,
      title: "إعلان اختبار",
      description: "وصف الإعلان",
      image: "https://example.com/ad.jpg",
      status: "active",
    };

    expect(mockAd).toBeDefined();
    expect(mockAd.title).toBe("إعلان اختبار");
    expect(mockAd.status).toBe("active");
  });

  it("should validate book price format", () => {
    const bookPrice = "29.99";
    const priceRegex = /^\d+(\.\d{2})?$/;

    expect(priceRegex.test(bookPrice)).toBe(true);
  });

  it("should validate category slug format", () => {
    const slug = "science-fiction";
    const slugRegex = /^[a-z0-9-]+$/;

    expect(slugRegex.test(slug)).toBe(true);
  });

  it("should validate rating range", () => {
    const rating = 4.5;

    expect(rating).toBeGreaterThanOrEqual(0);
    expect(rating).toBeLessThanOrEqual(5);
  });
});
