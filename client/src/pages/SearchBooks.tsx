import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";

export default function SearchBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [language, setLanguage] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories } = trpc.books.categories.useQuery();
  const { data: searchResults = [], isLoading } = trpc.books.search.useQuery(
    { query: searchQuery.trim(), categoryId: selectedCategory ? Number(selectedCategory) : undefined, minPrice: priceRange[0], maxPrice: priceRange[1], language: language || undefined, limit: 50, offset: 0 },
    { enabled: searchQuery.trim().length > 0 }
  );

  const resetFilters = () => {
    setSearchQuery(""); setSelectedCategory(""); setPriceRange([0, 500]); setLanguage("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground pattern-deco">
      <header className="border-b-2 border-primary bg-background shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-6">
          <a href="/" className="text-2xl font-bold text-primary">BookHub</a>
          <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="md:hidden border-primary text-primary"><Filter className="h-5 w-5" /></Button>
        </div>
      </header>
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="frame-gold sticky top-24 space-y-6">
              <h3 className="text-2xl font-bold text-primary">الفلاتر</h3>
              <div><label className="block text-sm font-semibold mb-2">البحث</label><Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن كتاب..." /></div>
              <div>
                <label className="block text-sm font-semibold mb-2">الفئة</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger><SelectValue placeholder="جميع الفئات" /></SelectTrigger>
                  <SelectContent>{categories?.map((cat) => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-4">نطاق السعر: {priceRange[0]} - {priceRange[1]}</label>
                <Slider min={0} max={500} step={10} value={priceRange} onValueChange={setPriceRange} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">اللغة</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue placeholder="جميع اللغات" /></SelectTrigger>
                  <SelectContent><SelectItem value="ar">العربية</SelectItem><SelectItem value="en">الإنجليزية</SelectItem><SelectItem value="fr">الفرنسية</SelectItem></SelectContent>
                </Select>
              </div>
              <Button onClick={resetFilters} variant="outline" className="w-full">إعادة تعيين</Button>
            </div>
          </aside>
          <section className="md:col-span-3">
            <h2 className="text-3xl font-bold text-primary">نتائج البحث</h2>
            <p className="text-muted-foreground mt-2 mb-6">{isLoading ? "جاري البحث..." : `${searchResults.length} إعلان`}</p>
            {isLoading ? <div className="text-center py-12">جاري البحث...</div> : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((book) => <a key={book.id} href={`/books/${book.id}`} className="group"><div className="frame-gold h-full hover:shadow-xl transition-all duration-300 p-4">
                  {book.cover && <img src={book.cover} alt={book.title} className="w-full h-48 object-cover mb-4 rounded" />}
                  {!book.cover && <div className="w-full h-48 rounded bg-muted flex items-center justify-center mb-4">لا توجد صورة</div>}
                  <h4 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary">{book.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                  <div className="flex items-center justify-between"><span className="text-primary font-bold">{book.price} {book.currency}</span><span className="text-xs text-muted-foreground">{book.country}</span></div>
                </div></a>)}
              </div>
            ) : searchQuery.trim() ? <div className="text-center py-12 frame-gold">لم يتم العثور على نتائج.</div> : <div className="text-center py-12 frame-gold">ابدأ البحث عن كتاب.</div>}
          </section>
        </div>
      </div>
    </div>
  );
}
