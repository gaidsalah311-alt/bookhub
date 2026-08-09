import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Users, BookOpen, Settings, LogOut, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { LoadingButton } from "@/components/LoadingButton";
import { ProfileSkeleton } from "@/components/SkeletonLoader";
import { useToastNotification } from "@/hooks/useToastNotification";

/**
 * صفحة الملف الشخصي للمستخدم مع تأثيرات محسّنة
 */
export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { showSuccess, showError, showInfo } = useToastNotification();

  // جلب بيانات الملف الشخصي
  const { data: profileData, isLoading: profileLoading } = trpc.auth.profile.useQuery();

  // جلب المفضلة
  const { data: favorites, isLoading: favoritesLoading } = trpc.favorites.list.useQuery(
    { limit: 20, offset: 0 },
    { enabled: !!user?.id }
  );

  // جلب المتابعين
  const { data: followers, isLoading: followersLoading } = trpc.follows.followers.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  // جلب المتابعة
  const { data: following, isLoading: followingLoading } = trpc.follows.following.useQuery(
    { limit: 20, offset: 0 },
    { enabled: !!user?.id }
  );

  // جلب الإعلانات الشخصية
  const { data: listings, isLoading: listingsLoading } = trpc.books.getUserListings.useQuery(
    { userId: user?.id || 0, limit: 20, offset: 0 },
    { enabled: !!user?.id }
  );

  // mutation لتحديث الملف الشخصي
  const updateProfileMutation = trpc.profiles.updateAuthor.useMutation({
    onSuccess: () => {
      showSuccess("تم تحديث الملف الشخصي بنجاح");
      setIsEditing(false);
      setIsSaving(false);
    },
    onError: (error) => {
      showError("فشل تحديث الملف الشخصي", {
        description: error.message || "حاول مجدداً",
      });
      setIsSaving(false);
    },
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // TODO: جمع بيانات النموذج وإرسالها
    setTimeout(() => {
      showSuccess("تم حفظ التغييرات بنجاح");
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);
  };

  const handleLogout = () => {
    showInfo("جاري تسجيل الخروج...");
    setTimeout(() => {
      logout();
      showSuccess("تم تسجيل الخروج بنجاح");
    }, 500);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول أولاً</h1>
          <Button className="btn-primary">تسجيل الدخول</Button>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* رأس الملف الشخصي */}
      <div className="profile-header animate-fade-in">
        <div className="container relative h-full">
          <div className="profile-avatar animate-slide-in-left">
            <div className="h-full w-full rounded-full bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {user.name?.[0] || "U"}
            </div>
          </div>
        </div>
      </div>

      {/* معلومات الملف الشخصي */}
      <div className="container">
        <div className="profile-info animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.name || "مستخدم"}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              {user.role && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent animate-slide-in-right">
                  {user.role === "author" && "مؤلف"}
                  {user.role === "library" && "مكتبة"}
                  {user.role === "publisher" && "ناشر"}
                  {user.role === "user" && "مستخدم عادي"}
                  {user.role === "admin" && "مسؤول"}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <LoadingButton
                variant="outline"
                className="gap-2"
                isLoading={isSaving}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Settings className="h-4 w-4" />
                {isEditing ? "إلغاء" : "تعديل"}
              </LoadingButton>
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                خروج
              </Button>
            </div>
          </div>

          {/* الإحصائيات */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all duration-300 animate-fade-in" style={{ animationDelay: "0ms" }}>
              <div className="text-2xl font-bold text-accent">{listings?.length || 0}</div>
              <div className="text-sm text-muted-foreground">إعلانات</div>
            </div>
            <div className="text-center p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all duration-300 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="text-2xl font-bold text-accent">{favorites?.length || 0}</div>
              <div className="text-sm text-muted-foreground">مفضلة</div>
            </div>
            <div className="text-center p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all duration-300 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="text-2xl font-bold text-accent">{following?.length || 0}</div>
              <div className="text-sm text-muted-foreground">متابعة</div>
            </div>
            <div className="text-center p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all duration-300 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="text-2xl font-bold text-accent">{followers?.length || 0}</div>
              <div className="text-sm text-muted-foreground">متابعون</div>
            </div>
          </div>

          {/* الأتابات */}
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="listings" className="gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">إعلاناتي</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">المفضلة</span>
              </TabsTrigger>
              <TabsTrigger value="following" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">المتابعة</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">الرسائل</span>
              </TabsTrigger>
            </TabsList>

            {/* إعلاناتي */}
            <TabsContent value="listings" className="space-y-4 mt-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">إعلاناتي</h2>
                <LoadingButton className="btn-primary" isLoading={false}>
                  إضافة إعلان جديد
                </LoadingButton>
              </div>
              {listingsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="book-card space-y-3 animate-pulse">
                      <div className="book-cover bg-muted h-64 rounded-lg" />
                      <div className="book-info space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : listings && listings.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {listings.map((listing: any, index: number) => (
                    <div 
                      key={listing.listings?.id} 
                      className="book-card card-hover group"
                      style={{
                        animation: `fadeIn 0.5s ease-out ${index * 50}ms forwards`,
                        opacity: 0,
                      }}
                    >
                      <div className="book-cover bg-gradient-to-br from-accent/20 to-orange-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <BookOpen className="h-12 w-12 text-accent/30" />
                      </div>
                      <div className="book-info">
                        <div className="book-title group-hover:text-accent transition-colors">{listing.books?.title}</div>
                        <div className="book-price">${listing.listings?.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>لا توجد إعلانات حتى الآن</p>
                </div>
              )}
            </TabsContent>

            {/* المفضلة */}
            <TabsContent value="favorites" className="space-y-4 mt-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-4">المفضلة</h2>
              {favoritesLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="book-card space-y-3 animate-pulse">
                      <div className="book-cover bg-muted h-64 rounded-lg" />
                      <div className="book-info space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : favorites && favorites.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {favorites.map((fav: any, index: number) => (
                    <div 
                      key={fav.favorites?.id} 
                      className="book-card card-hover group"
                      style={{
                        animation: `fadeIn 0.5s ease-out ${index * 50}ms forwards`,
                        opacity: 0,
                      }}
                    >
                      <div className="book-cover bg-gradient-to-br from-accent/20 to-orange-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <BookOpen className="h-12 w-12 text-accent/30" />
                      </div>
                      <div className="book-info">
                        <div className="book-title group-hover:text-accent transition-colors">{fav.listings?.books?.title}</div>
                        <div className="book-price">${fav.listings?.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>لا توجد مفضلة حتى الآن</p>
                </div>
              )}
            </TabsContent>

            {/* المتابعة */}
            <TabsContent value="following" className="space-y-4 mt-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-4">المتابعة</h2>
              {followingLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border animate-pulse">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-muted" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-24" />
                          <div className="h-3 bg-muted rounded w-16" />
                        </div>
                      </div>
                      <div className="h-10 w-24 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : following && following.length > 0 ? (
                <div className="space-y-3">
                  {following.map((follow: any, index: number) => (
                    <div
                      key={follow.follows?.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                          {follow.users?.name?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold">{follow.users?.name}</div>
                          <div className="text-sm text-muted-foreground">{follow.users?.role}</div>
                        </div>
                      </div>
                      <LoadingButton variant="outline" size="sm">
                        إلغاء المتابعة
                      </LoadingButton>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>لم تتابع أحداً حتى الآن</p>
                </div>
              )}
            </TabsContent>

            {/* الرسائل */}
            <TabsContent value="messages" className="space-y-4 mt-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-4">الرسائل</h2>
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>لا توجد رسائل حتى الآن</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* قسم التعديل */}
          {isEditing && (
            <div className="mt-8 p-6 rounded-lg border border-border bg-muted/30 animate-slide-in-left">
              <h3 className="text-lg font-bold mb-4">تعديل الملف الشخصي</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم</label>
                  <Input
                    type="text"
                    defaultValue={user.name || ""}
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    defaultValue={user.email || ""}
                    placeholder="أدخل بريدك الإلكتروني"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">السيرة الذاتية</label>
                  <Textarea
                    placeholder="أخبرنا عن نفسك..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <LoadingButton 
                    className="btn-primary"
                    isLoading={isSaving}
                    loadingText="جاري الحفظ..."
                    onClick={handleSaveProfile}
                  >
                    حفظ التغييرات
                  </LoadingButton>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          )}
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
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
