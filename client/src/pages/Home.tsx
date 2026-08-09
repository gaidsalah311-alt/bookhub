import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Users, Zap, TrendingUp, ChevronRight } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useState } from "react";

/**
 * الصفحة الرئيسية لمنصة BookMarket
 */
export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // سيتم إعادة التوجيه إلى صفحة البحث
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* شريط التنقل */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold text-gradient">BookMarket</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-foreground hover:text-accent transition">
              تصفح الكتب
            </Link>
            <Link href="/categories" className="text-foreground hover:text-accent transition">
              التصنيفات
            </Link>
            <Link href="/publishers" className="text-foreground hover:text-accent transition">
              الناشرون
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-foreground">
                    لوحة التحكم
                  </Button>
                </Link>
                <Link href="/profile">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
                    {user?.name?.[0] || "U"}
                  </div>
                </Link>
              </>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="ghost">دخول</Button>
                </a>
                <a href={getLoginUrl()}>
                  <Button className="btn-primary">إنشاء حساب</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* القسم الرئيسي (Hero) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent/10 via-background to-orange-500/5 py-20 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  اكتشف عالم <span className="text-gradient">الكتب</span> بلا حدود
                </h1>
                <p className="text-xl text-muted-foreground">
                  منصة عالمية متخصصة تربط القراء والمؤلفين والمكتبات ودور النشر في مكان واحد آمن وموثوق
                </p>
              </div>

              {/* شريط البحث */}
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
                <Button type="submit" className="btn-primary">
                  بحث
                </Button>
              </form>

              {/* الإحصائيات */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">50K+</div>
                  <div className="text-sm text-muted-foreground">كتاب</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">100K+</div>
                  <div className="text-sm text-muted-foreground">مستخدم</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">150+</div>
                  <div className="text-sm text-muted-foreground">دولة</div>
                </div>
              </div>
            </div>

            {/* الصورة التوضيحية */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-orange-500/20 rounded-2xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-accent/10 to-orange-500/10 rounded-2xl border border-accent/20 p-8 flex items-center justify-center">
                  <BookOpen className="h-32 w-32 text-accent/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* الميزات الرئيسية */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">لماذا BookMarket؟</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              منصة شاملة توفر كل ما تحتاجه للتواصل مع عالم الكتب
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-8 w-8" />,
                title: "ملايين الكتب",
                description: "اكتشف ملايين الكتب من حول العالم بجميع الأنواع والتصنيفات",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "مجتمع عالمي",
                description: "تواصل مع المؤلفين والمكتبات ودور النشر مباشرة",
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "سهل وآمن",
                description: "نظام دفع آمن وتواصل مباشر بين البائع والمشتري",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="book-card p-8 text-center hover-lift"
              >
                <div className="flex justify-center mb-4 text-accent">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الكتب الأحدث */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="section-title">الكتب الأحدث</h2>
              <p className="text-muted-foreground">أحدث الإضافات إلى المنصة</p>
            </div>
            <Link href="/browse">
              <Button variant="outline" className="gap-2">
                عرض الكل
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="book-card card-hover group cursor-pointer">
                <div className="book-cover bg-gradient-to-br from-accent/20 to-orange-500/20 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-accent/30" />
                </div>
                <div className="book-info">
                  <div className="book-title">كتاب مثال {idx}</div>
                  <div className="book-author">المؤلف {idx}</div>
                  <div className="flex items-center justify-between">
                    <span className="book-price">$19.99</span>
                    <span className="text-xs text-muted-foreground">⭐ 4.5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* التصنيفات الشهيرة */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="section-title">التصنيفات الشهيرة</h2>
              <p className="text-muted-foreground">استكشف أشهر التصنيفات</p>
            </div>
            <Link href="/categories">
              <Button variant="outline" className="gap-2">
                جميع التصنيفات
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["الأدب", "التاريخ", "العلوم", "التكنولوجيا", "الأعمال", "التنمية الذاتية", "الأطفال", "الروايات"].map(
              (category) => (
                <Link key={category} href={`/browse?category=${category}`}>
                  <div className="filter-badge w-full justify-center hover:border-accent hover:bg-accent/10 cursor-pointer">
                    {category}
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* الناشرون والمكتبات */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">للناشرين والمكتبات</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              أدوات قوية لإدارة مجموعتك وتوسيع وصولك
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="book-card p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">للناشرين</h3>
              </div>
              <p className="text-muted-foreground">
                أدوات متقدمة لإدارة إصداراتك وتحليل الأداء والوصول إلى ملايين القراء حول العالم
              </p>
              <ul className="space-y-3">
                {["إدارة متقدمة للإصدارات", "تحليلات مفصلة", "حملات إعلانية", "دعم متخصص"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/publisher-signup">
                <Button className="btn-primary w-full">ابدأ الآن</Button>
              </Link>
            </div>

            <div className="book-card p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">للمكتبات</h3>
              </div>
              <p className="text-muted-foreground">
                منصة شاملة لعرض مجموعتك وإدارة المبيعات والتواصل مع العملاء بسهولة
              </p>
              <ul className="space-y-3">
                {["عرض غير محدود", "إدارة المخزون", "تقارير مبيعات", "أدوات تسويق"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/library-signup">
                <Button className="btn-primary w-full">ابدأ الآن</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* الدعوة للعمل */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-accent/20 to-orange-500/20">
        <div className="container text-center space-y-8">
          <h2 className="section-title">هل أنت مستعد للبدء؟</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            انضم إلى ملايين المستخدمين الذين يستمتعون بتجربة تداول الكتب الأفضل
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button className="btn-primary">اذهب إلى لوحة التحكم</Button>
                </Link>
                <Link href="/browse">
                  <Button className="btn-secondary">تصفح الكتب</Button>
                </Link>
              </>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button className="btn-primary">إنشاء حساب مجاني</Button>
                </a>
                <a href={getLoginUrl()}>
                  <Button className="btn-secondary">تسجيل الدخول</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* التذييل */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-accent" />
                <span className="font-bold text-lg">BookMarket</span>
              </div>
              <p className="text-sm text-muted-foreground">
                منصة عالمية لتداول وعرض الكتب
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">الروابط</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-accent">عن المنصة</Link></li>
                <li><Link href="/contact" className="hover:text-accent">اتصل بنا</Link></li>
                <li><Link href="/blog" className="hover:text-accent">المدونة</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">السياسات</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-accent">الخصوصية</Link></li>
                <li><Link href="/terms" className="hover:text-accent">الشروط</Link></li>
                <li><Link href="/copyright" className="hover:text-accent">حقوق النشر</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">تابعنا</h4>
              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 rounded-lg bg-muted hover:bg-accent/20 flex items-center justify-center transition">
                  f
                </a>
                <a href="#" className="h-10 w-10 rounded-lg bg-muted hover:bg-accent/20 flex items-center justify-center transition">
                  𝕏
                </a>
                <a href="#" className="h-10 w-10 rounded-lg bg-muted hover:bg-accent/20 flex items-center justify-center transition">
                  📷
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2026 BookMarket. جميع الحقوق محفوظة.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
                <option>العربية</option>
                <option>English</option>
                <option>Français</option>
              </select>
              <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
                <option>USD</option>
                <option>AED</option>
                <option>SAR</option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
