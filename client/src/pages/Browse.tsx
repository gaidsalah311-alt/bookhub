import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, X, BookOpen, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { LoadingButton } from "@/components/LoadingButton";
import { BookGridSkeleton } from "@/components/SkeletonLoader";
import { useToastNotification } from "@/hooks/useToastNotification";

/**
 * صفحة تصفح الكتب مع فلاتر متقدمة وتأثيرات محسّنة
 */
export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedType, setSelectedType] = useState<"paper" | "digital" | "external_link" | null>(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const { showSuccess, showError, showInfo } = useToastNotification();

  // جلب التصنيفات
  const { data: categories, isLoading: categoriesLoading } = trpc.books.categories.useQuery();

  // البحث والفلترة
  const { data: searchResults, isLoading } = trpc.books.search.useQuery(
    {
      query: searchQuery || "*",
      categoryId: selectedCategory || undefined,
      country: selectedCountry || undefined,
      language: selectedLanguage || undefined,
      type: selectedType || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      limit: 20,
      offset,
    },
    { enabled: true }
  );

  // mutations للمفضلة
  const addToFavoritesMutation = trpc.favorites.add.useMutation({
    onSuccess: () => {
      showSuccess("تمت الإضافة إلى المفضلة", {
        description: "يمكنك الوصول إليها من ملفك الشخصي",
      });
    },
    onError: (error) => {
      showError("فشل إضافة المفضلة", {
        description: error.message || "حاول مجدداً",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setOffset(0);
    
    setTimeout(() => {
      setIsSearching(false);
      if (searchResults && searchResults.length > 0) {
        showInfo(`تم العثور على ${searchResults.length} كتاب`);
      }
    }, 500);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedCountry("");
    setSelectedLanguage("");
    setSelectedType(null);
    setPriceRange([0, 1000]);
    setOffset(0);
    showInfo("تم مسح جميع الفلاتر");
  };

  const activeFiltersCount = [
    selectedCategory !== null,
    selectedCountry !== "",
    selectedLanguage !== "",
    selectedType !== null,
  ].filter(Boolean).length;

  const handleAddToFavorites = (listingId: number) => {
    addToFavoritesMutation.mutate({ listingId });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* شريط البحث العلوي */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <div className="container">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="ابحث عن كتاب أو مؤلف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input pl-12"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <LoadingButton 
              type="submit" 
              className="btn-primary"
              isLoading={isSearching}
              loadingText="بحث..."
            >
              بحث
            </LoadingButton>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              فلاتر
              {activeFiltersCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-accent text-xs text-accent-foreground">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* شريط الفلاتر الجانبي */}
          {showFilters && (
            <div className="md:col-span-1 md:block animate-fade-in">
              <div className="space-y-6 sticky top-32">
                {/* رأس الفلاتر */}
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">الفلاتر</h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-accent hover:underline flex items-center gap-1 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      مسح
                    </button>
                  )}
                </div>

                {/* التصنيفات */}
                <div className="space-y-3">
                  <h4 className="font-semibold">التصنيفات</h4>
                  <div className="space-y-2">
                    {categoriesLoading ? (
                      <div className="text-sm text-muted-foreground">جاري التحميل...</div>
                    ) : (
                      categories?.map((category) => (
                        <label key={category.id} className="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
                          <Checkbox
                            checked={selectedCategory === category.id}
                            onCheckedChange={(checked) =>
                              setSelectedCategory(checked ? category.id : null)
                            }
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* نوع الكتاب */}
                <div className="space-y-3">
                  <h4 className="font-semibold">نوع الكتاب</h4>
                  <div className="space-y-2">
                    {[
                      { value: "paper", label: "ورقي" },
                      { value: "digital", label: "رقمي" },
                      { value: "external_link", label: "رابط خارجي" },
                    ].map((type) => (
                      <label key={type.value} className="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
                        <Checkbox
                          checked={selectedType === (type.value as any)}
                          onCheckedChange={(checked) =>
                            setSelectedType(checked ? (type.value as any) : null)
                          }
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* اللغة */}
                <div className="space-y-3">
                  <h4 className="font-semibold">اللغة</h4>
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <option value="">جميع اللغات</option>
                    <option value="ar">العربية</option>
                    <option value="en">الإنجليزية</option>
                    <option value="fr">الفرنسية</option>
                  </Select>
                </div>

                {/* الدولة */}
                <div className="space-y-3">
                  <h4 className="font-semibold">الدولة</h4>
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                  >
                    <option value="">جميع الدول</option>
                    <option value="SA">السعودية</option>
                    <option value="AE">الإمارات</option>
                    <option value="EG">مصر</option>
                    <option value="US">الولايات المتحدة</option>
                    <option value="GB">بريطانيا</option>
                  </Select>
                </div>

                {/* نطاق السعر */}
                <div className="space-y-3">
                  <h4 className="font-semibold">نطاق السعر</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>-</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* نتائج البحث */}
          <div className={showFilters ? "md:col-span-3" : "md:col-span-4"}>
            {isLoading ? (
              <BookGridSkeleton count={8} />
            ) : searchResults && searchResults.length > 0 ? (
              <>
                <div className="mb-6 animate-fade-in">
                  <p className="text-muted-foreground">
                    تم العثور على <span className="font-bold text-foreground">{searchResults.length}</span> كتاب
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                  {searchResults.map((result: any, index: number) => (
                    <div
                      key={result.listings?.id}
                      className="book-card card-hover group cursor-pointer transition-all duration-300 hover:shadow-2xl"
                      style={{
                        animation: `fadeIn 0.5s ease-out ${index * 50}ms forwards`,
                        opacity: 0,
                      }}
                    >
                      <div className="book-cover bg-gradient-to-br from-accent/20 to-orange-500/20 flex items-center justify-center relative overflow-hidden">
                        <BookOpen className="h-12 w-12 text-accent/30 group-hover:scale-110 transition-transform duration-300" />
                        
                        {/* زر المفضلة */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToFavorites(result.listings?.id);
                          }}
                          disabled={addToFavoritesMutation.isPending}
                          className="absolute top-2 left-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200 hover:scale-110 disabled:opacity-50"
                        >
                          <Heart className="h-5 w-5 text-accent" />
                        </button>

                        {result.listings?.type === "paper" && (
                          <span className="absolute top-2 right-2 filter-badge text-xs animate-slide-in-right">
                            ورقي
                          </span>
                        )}
                        {result.listings?.type === "digital" && (
                          <span className="absolute top-2 right-2 filter-badge text-xs bg-blue-500/20 text-blue-700 animate-slide-in-right">
                            رقمي
                          </span>
                        )}
                      </div>
                      <div className="book-info">
                        <div className="book-title group-hover:text-accent transition-colors">{result.books?.title}</div>
                        <div className="book-author">{result.books?.author}</div>
                        <div className="flex items-center justify-between">
                          <span className="book-price">${result.listings?.price}</span>
                          <span className="text-xs text-muted-foreground group-hover:text-accent transition-colors">⭐ 4.5</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* الترقيم */}
                <div className="flex items-center justify-center gap-2 mt-12 animate-fade-in">
                  <LoadingButton
                    variant="outline"
                    onClick={() => setOffset(Math.max(0, offset - 20))}
                    disabled={offset === 0}
                  >
                    السابق
                  </LoadingButton>
                  <span className="text-sm text-muted-foreground">
                    الصفحة {Math.floor(offset / 20) + 1}
                  </span>
                  <LoadingButton
                    variant="outline"
                    onClick={() => setOffset(offset + 20)}
                    disabled={searchResults.length < 20}
                  >
                    التالي
                  </LoadingButton>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold mb-2">لم يتم العثور على كتب</h3>
                <p className="text-muted-foreground">
                  حاول تغيير معايير البحث أو الفلاتر
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
