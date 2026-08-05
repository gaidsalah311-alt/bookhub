import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Search, BookOpen, Users, Sparkles } from "lucide-react";
import { startLogin } from "@/const";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Fetch featured books
  const { data: featuredBooks, isLoading: isFeaturedLoading } = trpc.books.featured.useQuery({
    limit: 8,
  });

  // Fetch categories
  const { data: categories } = trpc.categories.list.useQuery();

  // Fetch active advertisements
  const { data: advertisements } = trpc.advertisements.getActive.useQuery({
    limit: 5,
  });

  // Search books
  const { data: searchResults = [], isLoading: isSearching } = trpc.books.search.useQuery(
    {
      query: searchQuery,
      limit: 20,
    },
    {
      enabled: showSearch && searchQuery.trim().length > 0,
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pattern-deco">
      {/* Header */}
      <header className="border-b-2 border-primary bg-background shadow-lg">
        <div className="container mx-auto flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary">BookHub</h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="hover:text-primary transition-colors">
              الكتب
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              الفئات
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              المؤلفون
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              الناشرون
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">مرحبا، {user?.name}</span>
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <Button
                onClick={() => startLogin()}
                className="btn-luxury"
              >
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <div className="mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
            اكتشف عالم الكتب
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            منصة رقمية فاخرة تجمع بين أفضل الكتب والمؤلفين والناشرين في مكان واحد
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2 frame-gold">
            <Input
              type="text"
              placeholder="ابحث عن كتاب أو مؤلف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-input text-foreground border-0 placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              className="btn-luxury"
              disabled={isSearching || !searchQuery.trim()}
            >
              <Search className="h-5 w-5 ml-2" />
              بحث
            </Button>
          </div>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-primary">نتائج البحث</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchResults.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="container mx-auto py-12 border-t-2 border-primary">
          <h3 className="text-3xl font-bold mb-8 text-primary">الفئات</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/categories/${category.slug}`}
                className="frame-gold text-center hover:shadow-lg transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <p className="font-semibold">{category.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Featured Books Section */}
      <section className="container mx-auto py-12 border-t-2 border-primary">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="h-8 w-8 text-primary" />
          <h3 className="text-3xl font-bold text-primary">الكتب المميزة</h3>
        </div>

        {isFeaturedLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        ) : featuredBooks && featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لا توجد كتب مميزة حالياً</p>
          </div>
        )}
      </section>

      {/* Advertisements Section */}
      {advertisements && advertisements.length > 0 && (
        <section className="container mx-auto py-12 border-t-2 border-primary">
          <h3 className="text-3xl font-bold mb-8 text-primary">الإعلانات المميزة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advertisements.map((ad) => (
              <div
                key={ad.id}
                className="frame-gold bg-secondary hover:shadow-lg transition-all duration-200"
              >
                {ad.image && ad.image !== null && (
                  <img
                    src={ad.image as string}
                    alt={ad.title || ''}
                    className="w-full h-40 object-cover mb-4"
                  />
                )}
                <h4 className="text-xl font-bold mb-2 text-primary">{ad.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{ad.description}</p>
                <Button className="btn-luxury w-full">عرض المزيد</Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto py-12 border-t-2 border-primary">
        <h3 className="text-3xl font-bold mb-12 text-center text-primary">لماذا BookHub؟</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="frame-gold text-center">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">مكتبة شاملة</h4>
            <p className="text-muted-foreground">
              آلاف الكتب من أفضل المؤلفين والناشرين حول العالم
            </p>
          </div>

          <div className="frame-gold text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">مجتمع نشط</h4>
            <p className="text-muted-foreground">
              تواصل مع القراء والمؤلفين والناشرين في مجتمع حيوي
            </p>
          </div>

          <div className="frame-gold text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">تجربة فاخرة</h4>
            <p className="text-muted-foreground">
              واجهة أنيقة وسهلة الاستخدام مع تصميم عصري
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-primary bg-secondary py-12 mt-12">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2026 BookHub. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}

// Book Card Component
function BookCard({ book }: { book: any }) {
  return (
    <a href={`/books/${book.slug}`} className="group">
      <div className="frame-gold h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        {book.cover && (
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-48 object-cover mb-4"
          />
        )}
        <h4 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h4>
        <p className="text-sm text-muted-foreground mb-3">{book.author?.name}</p>
        {book.price && (
          <p className="text-primary font-bold text-lg">{book.price} {book.currency}</p>
        )}
        {book.rating && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm">{book.rating}</span>
          </div>
        )}
      </div>
    </a>
  );
}
