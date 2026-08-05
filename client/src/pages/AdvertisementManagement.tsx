import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdvertisementManagement() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "banner",
    duration: "30",
    budget: "",
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
    setFormData({ title: "", description: "", type: "banner", duration: "30", budget: "" });
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
              <h1 className="text-4xl font-bold text-primary mb-2">إدارة الإعلانات</h1>
              <p className="text-muted-foreground">أنشئ وأدر إعلاناتك الترويجية</p>
            </div>
            <Button
              className="btn-luxury flex items-center gap-2"
              onClick={() => setIsCreating(!isCreating)}
            >
              <Plus className="h-5 w-5" />
              إعلان جديد
            </Button>
          </div>

          {/* Create/Edit Form */}
          {isCreating && (
            <div className="frame-gold mb-12">
              <h2 className="text-2xl font-bold mb-6 text-primary">إنشاء إعلان جديد</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2">عنوان الإعلان</label>
                  <Input
                    type="text"
                    placeholder="أدخل عنوان الإعلان"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-input text-foreground border-primary"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2">الوصف</label>
                  <Textarea
                    placeholder="أدخل وصف الإعلان"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-24 bg-input text-foreground border-primary rounded p-4"
                  />
                </div>

                {/* Type */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">نوع الإعلان</label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className="w-full bg-input text-foreground border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground border-primary">
                        <SelectItem value="banner">بانر</SelectItem>
                        <SelectItem value="featured">مميز</SelectItem>
                        <SelectItem value="sidebar">شريط جانبي</SelectItem>
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

                {/* Budget */}
                <div>
                  <label className="block text-sm font-semibold mb-2">الميزانية (ريال)</label>
                  <Input
                    type="number"
                    placeholder="أدخل الميزانية"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-input text-foreground border-primary"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button type="submit" className="btn-luxury flex-1">
                    إنشاء الإعلان
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

            {/* Active Ads */}
            <TabsContent value="active">
              <div className="space-y-6">
                {[1, 2, 3].map((ad) => (
                  <div key={ad} className="frame-gold">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">إعلان {ad}</h3>
                        <p className="text-muted-foreground mb-3">وصف الإعلان يظهر هنا</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">النوع: بانر</span>
                          <span className="text-muted-foreground">الانطباعات: 1,234</span>
                          <span className="text-muted-foreground">النقرات: 45</span>
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

            {/* Scheduled Ads */}
            <TabsContent value="scheduled">
              <div className="frame-gold text-center py-12">
                <p className="text-muted-foreground">لا توجد إعلانات مجدولة</p>
              </div>
            </TabsContent>

            {/* Completed Ads */}
            <TabsContent value="completed">
              <div className="frame-gold text-center py-12">
                <p className="text-muted-foreground">لا توجد إعلانات منتهية</p>
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
