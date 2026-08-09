import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Share2, ExternalLink, ArrowRight } from "lucide-react";
import { useToastNotification } from "@/hooks/useToastNotification";
import { useAuth } from "@/_core/hooks/useAuth";

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const listingId = Number(slug);
  const { user } = useAuth();
  const { showSuccess, showError } = useToastNotification();
  const { data: book, isLoading } = trpc.books.getById.useQuery({ id: listingId }, { enabled: Number.isInteger(listingId) && listingId > 0 });
  const { data: favorites } = trpc.favorites.list.useQuery({ limit: 100, offset: 0 }, { enabled: !!user });
  const addFavorite = trpc.favorites.add.useMutation({ onSuccess: () => { showSuccess("تمت إضافة الإعلان إلى المفضلة"); favoritesQuery.refetch(); }, onError: (e) => showError("تعذر إضافة المفضلة", { description: e.message }) });
  const removeFavorite = trpc.favorites.remove.useMutation({ onSuccess: () => { showSuccess("تمت إزالة الإعلان من المفضلة"); favoritesQuery.refetch(); }, onError: (e) => showError("تعذر إزالة المفضلة", { description: e.message }) });
  const favoritesQuery = trpc.favorites.list.useQuery({ limit: 100, offset: 0 }, { enabled: !!user });
  const isFavorite = !!book && !!favoritesQuery.data?.some((fav: any) => fav.listings?.id === book.id || fav.listing?.id === book.id);

  const toggleFavorite = () => {
    if (!user) { showError("يجب تسجيل الدخول", { description: "سجل الدخول أولًا لإضافة الإعلان إلى المفضلة" }); return; }
    if (!book) return;
    if (isFavorite) removeFavorite.mutate({ listingId: book.id }); else addFavorite.mutate({ listingId: book.id });
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccess("تم نسخ رابط الإعلان");
    } catch {
      showError("تعذر نسخ الرابط");
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">جاري تحميل الإعلان...</div>;
  if (!book) return <div className="min-h-screen flex items-center justify-center">لم يتم العثور على الإعلان.</div>;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between py-5">
          <a href="/" className="text-2xl font-bold text-primary">BookHub</a>
          <a href="/search" className="inline-flex items-center gap-2"><ArrowRight className="h-4 w-4" /> العودة للبحث</a>
        </div>
      </header>
      <section className="container mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-5 lg:sticky lg:top-24 h-fit">
            {book.cover ? <img src={book.cover} alt={book.title} className="w-full rounded-lg object-cover max-h-[620px]" /> : <div className="aspect-[3/4] rounded-lg bg-muted flex items-center justify-center">لا توجد صورة للغلاف</div>}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <Button onClick={toggleFavorite} variant={isFavorite ? "default" : "outline"} disabled={addFavorite.isPending || removeFavorite.isPending} className="gap-2"><Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />{isFavorite ? "مفضل" : "مفضلة"}</Button>
              <Button onClick={share} variant="outline" className="gap-2"><Share2 className="h-4 w-4" />مشاركة</Button>
            </div>
            {book.externalLink && <Button asChild className="w-full mt-3 gap-2"><a href={book.externalLink} target="_blank" rel="noopener noreferrer">فتح الرابط الخارجي <ExternalLink className="h-4 w-4" /></a></Button>}
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-7">
              <div className="flex flex-wrap items-center gap-2 mb-4"><span className="rounded-full bg-primary/10 px-3 py-1 text-sm">{book.type ?? book.format}</span><span className="rounded-full border px-3 py-1 text-sm">{book.status}</span>{book.isPremium && <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-sm">إعلان مميز</span>}</div>
              <h1 className="text-4xl font-bold mb-3">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{book.author}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y py-5 mb-6">
                <div><div className="text-xs text-muted-foreground">السعر</div><div className="font-bold text-primary text-lg">{book.price} {book.currency}</div></div>
                <div><div className="text-xs text-muted-foreground">الدولة</div><div className="font-semibold">{book.country}</div></div>
                <div><div className="text-xs text-muted-foreground">اللغة</div><div className="font-semibold">{book.language || "-"}</div></div>
                <div><div className="text-xs text-muted-foreground">ISBN</div><div className="font-semibold text-sm">{book.isbn || "-"}</div></div>
              </div>
              <h2 className="text-2xl font-bold mb-3">عن الكتاب</h2>
              <p className="leading-8 whitespace-pre-wrap">{book.description || "لا يوجد وصف متاح لهذا الإعلان."}</p>
            </Card>

            <Card className="p-7">
              <h2 className="text-2xl font-bold mb-5">بيانات المعلن</h2>
              <div className="flex items-center gap-4"><div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold">{book.seller?.name?.[0] || "U"}</div><div><div className="font-semibold">{book.seller?.name || "مستخدم"}</div><div className="text-sm text-muted-foreground">{book.seller?.role || "معلن"}</div></div></div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
