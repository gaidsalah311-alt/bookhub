import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Eye, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function FeaturedListingManagement() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    bookId: "",
    position: "homepage",
    duration: "30",
    price: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "publisher" && user.role !== "author") {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (!user) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsCreating(false);
    setFormData({ bookId: "", position: "homepage", duration: "30", price: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pattern-deco">
      {/* Header */}
      <header className="border-b-2 border-primary bg-background shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-6">
          <a href="/" className="text-2xl font-bold text-primary">
            BookHub
          </a>
          <Button variant="outline" className="border-primary text-primary">
            العودة
          </Button>
        </div>
      </header>

      {/* Management Section */}
      <section className="container mx-auto py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">إدارة القوائم المميزة</h1>
              <p className="text-muted-foreground">ارفع كتابك إلى الصفحة الأولى</p>
            </div>
            <Button
              className="btn-luxury flex items-center gap-2"
              onClick={() => setIsCreating(!isCreating)}
            >
              <Plus className="h-5 w-5" />
              قائمة جديدة
            </Button>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { name: "أساسي", price: "99", duration: "7", features: ["الصفحة الرئيسية", "قائمة الفئة"] },
              { name: "متقدم", price: "199", duration: "14", features: ["الصفحة الرئيسية", "قائمة الفئة", "البحث"] },
              { name: "مميز", price: "299", duration: "30", features: ["الصفحة الرئيسية", "قائمة الفئة", "البحث", "الإعلانات"] },
            ].map((plan) => (
              <div key={plan.name} className="frame-gold text-center">
                <h3 className="text-2xl font-bold mb-2 text-primary">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground"> ريال</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.duration} أيام</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="text-sm flex items-center justify-center gap-2">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="btn-luxury w-full">اختر الخطة</Button>
              </div>
            ))}
          </div>

          {/* Create/Edit Form */}
          {isCreating && (
            <div className="frame-gold mb-12">
              <h2 className="text-2xl font-bold mb-6 text-primary">إنشاء قائمة مميزة جديدة</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Book Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-2">اختر الكتاب</label>
                  <Select value={formData.bookId} onValueChange={(value) => setFormData({ ...formData, bookId: value })}>
                    <SelectTrigger className="w-full bg-input text-foreground border-primary">
                      <SelectValue placeholder="اختر كتابك" />
                    </SelectTrigger>
                    <SelectContent className="bg-card text-foreground border-primary">
                      <SelectItem value="book1">كتاب 1</SelectItem>
                      <SelectItem value="book2">كتاب 2</SelectItem>
                      <SelectItem value="book3">كتاب 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Position */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">الموضع</label>
                    <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                      <SelectTrigger className="w-full bg-input text-foreground border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground border-primary">
                        <SelectItem value="homepage">الصفحة الرئيسية</SelectItem>
                        <SelectItem value="category">قائمة الفئة</SelectItem>
                        <SelectItem value="search">نتائج البحث</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">المدة (أيام)</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full bg-input text-foreground border-primary"
                    />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold mb-2">السعر (ريال)</label>
                  <Input
                    type="number"
                    placeholder="أدخل السعر"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-input text-foreground border-primary"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button type="submit" className="btn-luxury flex-1">
                    إنشاء القائمة
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-primary text-primary flex-1"
                    onClick={() => setIsCreating(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="active">نشطة</TabsTrigger>
              <TabsTrigger value="scheduled">مجدولة</TabsTrigger>
              <TabsTrigger value="completed">منتهية</TabsTrigger>
            </TabsList>

            {/* Active Listings */}
            <TabsContent value="active">
              <div className="space-y-6">
                {[1, 2].map((listing) => (
                  <div key={listing} className="frame-gold">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">كتاب {listing}</h3>
                        <div className="flex gap-4 text-sm mb-3">
                          <span className="text-muted-foreground">الموضع: الصفحة الرئيسية</span>
                          <span className="text-muted-foreground">الانطباعات: 5,234</span>
                          <span className="text-muted-foreground">النقرات: 234</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">زيادة 23% في المبيعات</span>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white">نشط</Badge>
                    </div>

                    <div className="border-t-2 border-primary pt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="border-primary text-primary flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        عرض
                      </Button>
                      <Button variant="outline" size="sm" className="border-primary text-primary flex items-center gap-2">
                        <Edit2 className="h-4 w-4" />
                        تعديل
                      </Button>
                      <Button variant="outline" size="sm" className="border-destructive text-destructive flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Scheduled Listings */}
            <TabsContent value="scheduled">
              <div className="frame-gold text-center py-12">
                <p className="text-muted-foreground">لا توجد قوائم مجدولة</p>
              </div>
            </TabsContent>

            {/* Completed Listings */}
            <TabsContent value="completed">
              <div className="frame-gold text-center py-12">
                <p className="text-muted-foreground">لا توجد قوائم منتهية</p>
              </div>
            </TabsContent>
          </Tabs>
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
