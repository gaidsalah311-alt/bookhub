import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Users, BookOpen, Settings, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState as useLocalState } from "react";
import { ProfileSkeleton } from "@/components/SkeletonLoader";
import { useToastNotification } from "@/hooks/useToastNotification";

export default function Profile() {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToastNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const profileQuery = trpc.auth.profile.useQuery(undefined, { enabled: !!user });
  const favoritesQuery = trpc.favorites.list.useQuery({ limit: 20, offset: 0 }, { enabled: !!user });
  const followersQuery = trpc.follows.followers.useQuery({ userId: user?.id || 0, limit: 20, offset: 0 }, { enabled: !!user });
  const followingQuery = trpc.follows.following.useQuery({ limit: 20, offset: 0 }, { enabled: !!user });
  const listingsQuery = trpc.books.getUserListings.useQuery({ userId: user?.id || 0, limit: 20, offset: 0 }, { enabled: !!user });

  const authorMutation = trpc.profiles.updateAuthor.useMutation();
  const libraryMutation = trpc.profiles.updateLibrary.useMutation();
  const publisherMutation = trpc.profiles.updatePublisher.useMutation();

  const profile = profileQuery.data?.profile as any;
  const role = user?.role;
  const specializedRole = useMemo(() => role === "author" || role === "library" || role === "publisher", [role]);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setBio(profile?.bio ?? user.bio ?? "");
    setWebsite(profile?.website ?? "");
  }, [user, profile]);

  const saveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      if (role === "author") await authorMutation.mutateAsync({ bio, website: website || undefined });
      else if (role === "library") await libraryMutation.mutateAsync({ libraryName: name || undefined, email: email || undefined, bio, website: website || undefined });
      else if (role === "publisher") await publisherMutation.mutateAsync({ publisherName: name || undefined, email: email || undefined, bio, website: website || undefined });
      else throw new Error("تعديل بيانات المستخدم العادي يحتاج إعداد ملف الحساب العام في الخادم");
      showSuccess("تم حفظ التغييرات فعليًا");
      setIsEditing(false);
      await profileQuery.refetch();
    } catch (error: any) {
      showError("فشل حفظ التغييرات", { description: error?.message || "حاول مرة أخرى" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول أولاً</h1><Button>تسجيل الدخول</Button></div></div>;
  if (profileQuery.isLoading) return <ProfileSkeleton />;

  return (
    <main className="min-h-screen bg-background">
      <div className="profile-header"><div className="container relative h-full"><div className="profile-avatar"><div className="h-full w-full rounded-full bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">{user.name?.[0] || "U"}</div></div></div></div>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-8">
          <div><h1 className="text-3xl font-bold">{user.name || "مستخدم"}</h1><p className="text-muted-foreground">{user.email}</p><span className="inline-flex mt-2 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">{role}</span></div>
          <div className="flex gap-2"><Button variant="outline" onClick={() => setIsEditing((value) => !value)}><Settings className="h-4 w-4 ml-2" />{isEditing ? "إلغاء" : "تعديل"}</Button><Button variant="outline" onClick={() => logout()}><LogOut className="h-4 w-4 ml-2" />خروج</Button></div>
        </div>

        {isEditing && <div className="rounded-xl border p-6 mb-8 space-y-4">
          <h2 className="text-xl font-bold">تعديل الملف الشخصي</h2>
          <div><label className="text-sm font-semibold">الاسم</label><Input value={name} onChange={(e) => setName(e.target.value)} disabled={role === "author"} /></div>
          <div><label className="text-sm font-semibold">البريد الإلكتروني</label><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" disabled={role === "author"} /></div>
          <div><label className="text-sm font-semibold">الموقع الإلكتروني</label><Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" /></div>
          <div><label className="text-sm font-semibold">نبذة</label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={10000} /></div>
          <Button disabled={isSaving || !specializedRole} onClick={saveProfile}>{isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}</Button>
          {!specializedRole && <p className="text-sm text-muted-foreground">الملف العام للمستخدم العادي يحتاج endpoint مستقل لتعديل الاسم والبريد بأمان.</p>}
        </div>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat icon={<BookOpen />} label="إعلانات" value={listingsQuery.data?.length ?? 0} />
          <Stat icon={<Heart />} label="مفضلة" value={favoritesQuery.data?.length ?? 0} />
          <Stat icon={<Users />} label="متابعة" value={followingQuery.data?.length ?? 0} />
          <Stat icon={<Users />} label="متابعون" value={followersQuery.data?.length ?? 0} />
        </div>

        <Tabs defaultValue="listings"><TabsList className="grid w-full grid-cols-4"><TabsTrigger value="listings"><BookOpen className="h-4 w-4 ml-2" />إعلاناتي</TabsTrigger><TabsTrigger value="favorites"><Heart className="h-4 w-4 ml-2" />المفضلة</TabsTrigger><TabsTrigger value="following"><Users className="h-4 w-4 ml-2" />المتابعة</TabsTrigger><TabsTrigger value="messages"><MessageCircle className="h-4 w-4 ml-2" />الرسائل</TabsTrigger></TabsList>
          <TabsContent value="listings" className="py-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{listingsQuery.data?.map((listing: any) => <div key={listing.listings?.id ?? listing.id} className="rounded-xl border p-4"><div className="font-semibold line-clamp-2">{listing.books?.title ?? listing.title ?? "إعلان"}</div><div className="text-sm text-muted-foreground mt-2">{listing.listings?.price ?? listing.price} {listing.listings?.currency ?? listing.currency}</div></div>)}</div>{!listingsQuery.data?.length && <p className="text-muted-foreground">لا توجد إعلانات.</p>}</TabsContent>
          <TabsContent value="favorites" className="py-6"><p className="text-muted-foreground">عدد العناصر المحفوظة: {favoritesQuery.data?.length ?? 0}</p></TabsContent>
          <TabsContent value="following" className="py-6"><p className="text-muted-foreground">عدد الحسابات التي تتابعها: {followingQuery.data?.length ?? 0}</p></TabsContent>
          <TabsContent value="messages" className="py-6"><p className="text-muted-foreground">استخدم قسم الرسائل لإدارة محادثاتك.</p></TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="rounded-xl border p-4 text-center"><div className="flex justify-center text-accent mb-2">{icon}</div><div className="text-2xl font-bold">{value}</div><div className="text-sm text-muted-foreground">{label}</div></div>;
}
