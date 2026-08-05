import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, BarChart3, Settings, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="frame-gold text-center">
          <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-lg font-semibold">لا توجد صلاحيات كافية</p>
          <p className="text-muted-foreground mt-2">يجب أن تكون مشرفاً للوصول إلى هذه الصفحة</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">لوحة تحكم المشرفين</h1>
          <p className="text-muted-foreground">مرحباً بك في لوحة التحكم الإدارية</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Users className="h-8 w-8" />}
            title="المستخدمون"
            value="1,234"
            change="+12% هذا الشهر"
          />
          <StatCard
            icon={<BookOpen className="h-8 w-8" />}
            title="الكتب"
            value="5,678"
            change="+23% هذا الشهر"
          />
          <StatCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="المبيعات"
            value="$45,230"
            change="+18% هذا الشهر"
          />
          <StatCard
            icon={<Settings className="h-8 w-8" />}
            title="الإعدادات"
            value="نشطة"
            change="جميع الأنظمة تعمل"
          />
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="users">المستخدمون</TabsTrigger>
            <TabsTrigger value="books">الكتب</TabsTrigger>
            <TabsTrigger value="ads">الإعلانات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="frame-gold">
              <h2 className="text-2xl font-bold mb-6 text-primary">إدارة المستخدمين</h2>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-primary">
                        <th className="text-left py-3 px-4 font-semibold">الاسم</th>
                        <th className="text-left py-3 px-4 font-semibold">البريد الإلكتروني</th>
                        <th className="text-left py-3 px-4 font-semibold">الدور</th>
                        <th className="text-left py-3 px-4 font-semibold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border hover:bg-secondary transition-colors">
                        <td className="py-3 px-4">مستخدم 1</td>
                        <td className="py-3 px-4">user1@example.com</td>
                        <td className="py-3 px-4">
                          <span className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm">
                            قارئ
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm" className="border-primary text-primary">
                            تعديل
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b border-border hover:bg-secondary transition-colors">
                        <td className="py-3 px-4">مؤلف 1</td>
                        <td className="py-3 px-4">author1@example.com</td>
                        <td className="py-3 px-4">
                          <span className="bg-accent text-accent-foreground px-3 py-1 rounded text-sm">
                            مؤلف
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm" className="border-primary text-primary">
                            تعديل
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Books Tab */}
          <TabsContent value="books">
            <Card className="frame-gold">
              <h2 className="text-2xl font-bold mb-6 text-primary">إدارة الكتب</h2>
              <div className="space-y-4">
                <Button className="btn-luxury">إضافة كتاب جديد</Button>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-primary">
                        <th className="text-left py-3 px-4 font-semibold">العنوان</th>
                        <th className="text-left py-3 px-4 font-semibold">المؤلف</th>
                        <th className="text-left py-3 px-4 font-semibold">الحالة</th>
                        <th className="text-left py-3 px-4 font-semibold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border hover:bg-secondary transition-colors">
                        <td className="py-3 px-4">كتاب مثال 1</td>
                        <td className="py-3 px-4">مؤلف 1</td>
                        <td className="py-3 px-4">
                          <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                            منشور
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm" className="border-primary text-primary">
                            تعديل
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Ads Tab */}
          <TabsContent value="ads">
            <Card className="frame-gold">
              <h2 className="text-2xl font-bold mb-6 text-primary">إدارة الإعلانات</h2>
              <div className="space-y-4">
                <Button className="btn-luxury">إضافة إعلان جديد</Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="frame-gold">
                    <h3 className="font-bold mb-2">إعلان 1</h3>
                    <p className="text-sm text-muted-foreground mb-4">وصف الإعلان</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-primary text-primary">
                        تعديل
                      </Button>
                      <Button variant="outline" size="sm" className="border-destructive text-destructive">
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="frame-gold">
              <h2 className="text-2xl font-bold mb-6 text-primary">الإعدادات</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">اسم الموقع</label>
                  <input
                    type="text"
                    defaultValue="BookHub"
                    className="w-full px-4 py-2 bg-input text-foreground border-2 border-primary rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">البريد الإلكتروني للدعم</label>
                  <input
                    type="email"
                    defaultValue="support@bookhub.com"
                    className="w-full px-4 py-2 bg-input text-foreground border-2 border-primary rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">الحد الأقصى لحجم الملف (MB)</label>
                  <input
                    type="number"
                    defaultValue="50"
                    className="w-full px-4 py-2 bg-input text-foreground border-2 border-primary rounded"
                  />
                </div>
                <Button className="btn-luxury">حفظ الإعدادات</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  icon,
  title,
  value,
  change,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}) {
  return (
    <Card className="frame-gold">
      <div className="flex items-start justify-between mb-4">
        <div className="text-primary">{icon}</div>
      </div>
      <p className="text-muted-foreground text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-primary mb-2">{value}</p>
      <p className="text-xs text-muted-foreground">{change}</p>
    </Card>
  );
}
