import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter } from "lucide-react";

export default function SearchBooks() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [language, setLanguage] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories
  const { data: categories } = trpc.categories.list.useQuery();

  // Search books
  const { data: searchResults = [], isLoading: isSearching } = trpc.books.search.useQuery(
    {
      query: searchQuery,
      categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      language: language || undefined,
      limit: 50,
    },
    {
      enabled: searchQuery.trim().length > 0,
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is triggered by useQuery when searchQuery changes
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([0, 500]);
    setLanguage("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground pattern-deco">
      {/* Header */}
      <header className="border-b-2 border-primary bg-background shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-6">
          <a href="/" className="text-2xl font-bold text-primary">
            BookHub
          </a>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="md:hidden border-primary text-primary"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`md:col-span-1 ${
              showFilters ? "block" : "hidden"
            } md:block`}
          >
            <div className="frame-gold sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-primary">الفلاتر</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">البحث</label>
                <Input
                  type="text"
                  placeholder="ابحث عن كتاب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-input text-foreground border-primary"
                />
              </div>

              {/* Category Filter */}
              {categories && categories.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">الفئة</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full bg-input text-foreground border-primary">
                      <SelectValue placeholder="اختر فئة" />
                    </SelectTrigger>
                    <SelectContent className="bg-card text-foreground border-primary">
                      <SelectItem value="">جميع الفئات</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-4">
                  نطاق السعر: {priceRange[0]} - {priceRange[1]}
                </label>
                <Slider
                  min={0}
                  max={500}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="w-full"
                />
              </div>

              {/* Language Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">اللغة</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full bg-input text-foreground border-primary">
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-foreground border-primary">
                    <SelectItem value="">جميع اللغات</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">الإنجليزية</SelectItem>
                    <SelectItem value="fr">الفرنسية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Button */}
              <Button
                onClick={resetFilters}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                إعادة تعيين
              </Button>
            </div>
          </div>

          {/* Search Results */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-primary">
                نتائج البحث
              </h2>
              <p className="text-muted-foreground mt-2">
                {isSearching ? "جاري البحث..." : `${searchResults.length} كتاب`}
              </p>
            </div>

            {isSearching ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">جاري البحث...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((book) => (
                  <a
                    key={book.id}
                    href={`/books/${book.slug}`}
                    className="group"
                  >
                    <div className="frame-gold h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      {book.cover && (
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-48 object-cover mb-4 rounded"
                        />
                      )}
                      <h4 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        المؤلف
                      </p>
                      <div className="flex items-center justify-between">
                        {book.price && (
                          <p className="text-primary font-bold">
                            {book.price} {book.currency}
                          </p>
                        )}
                        {book.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm">{Number(book.rating)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : searchQuery.trim().length > 0 ? (
              <div className="text-center py-12 frame-gold">
                <p className="text-muted-foreground text-lg">
                  لم يتم العثور على كتب تطابق معايير البحث
                </p>
              </div>
            ) : (
              <div className="text-center py-12 frame-gold">
                <p className="text-muted-foreground text-lg">
                  ابدأ البحث عن كتاب لعرض النتائج
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-primary bg-secondary py-12 mt-12">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2026 BookHub. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
