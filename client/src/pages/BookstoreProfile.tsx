import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Globe, MapPin, Phone } from "lucide-react";

export default function BookstoreProfile() {
  const { bookstoreId } = useParams<{ bookstoreId: string }>();
  const numericUserId = Number.parseInt(bookstoreId || "0", 10);
  const { data: bookstore, isLoading } = trpc.profiles.library.useQuery(
    { userId: numericUserId },
    { enabled: numericUserId > 0 }
  );

  if (isLoading) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p className="text-muted-foreground">جاري التحميل...</p></div>;
  if (!bookstore) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p className="text-muted-foreground">لم يتم العثور على المكتبة</p></div>;

  return (
    <div className="min-h-screen bg-background text-foreground pattern-deco">
      <header className="border-b-2 border-primary bg-background shadow-lg"><div className="container mx-auto flex items-center justify-between py-6"><a href="/" className="text-2xl font-bold text-primary">BookHub</a><Button variant="outline" className="border-primary text-primary" onClick={() => window.history.back()}>العودة</Button></div></header>
      <section className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1"><div className="frame-gold sticky top-8">
            {bookstore.profileImage && <img src={bookstore.profileImage} alt={bookstore.libraryName} className="w-full h-48 object-cover mb-6 rounded" />}
            <h1 className="text-3xl font-bold mb-4 text-primary">{bookstore.libraryName || "المكتبة"}</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">{bookstore.bio || "لا توجد معلومات متاحة"}</p>
            {bookstore.website && <div className="flex items-center gap-3 mb-4"><Globe className="h-5 w-5 text-primary" /><a href={bookstore.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">الموقع الرسمي</a></div>}
            {bookstore.address && <div className="flex items-start gap-3 mb-4"><MapPin className="h-5 w-5 text-primary mt-1" /><span>{bookstore.address}</span></div>}
            {bookstore.phone && <div className="flex items-center gap-3 mb-4"><Phone className="h-5 w-5 text-primary" /><a href={`tel:${bookstore.phone}`} className="text-primary hover:underline">{bookstore.phone}</a></div>}
            <div className="pt-6 border-t-2 border-primary"><Button className="btn-luxury w-full">التواصل</Button></div>
          </div></div>
          <div className="md:col-span-2">
            <div className="frame-gold"><h2 className="text-3xl font-bold mb-8 text-primary">عن المكتبة</h2><div className="space-y-6">
              <div><h3 className="text-xl font-bold mb-3 text-primary">معلومات عامة</h3><p className="text-foreground leading-relaxed">{bookstore.bio || "لا توجد معلومات إضافية متاحة"}</p></div>
              {bookstore.address && <div><h3 className="text-xl font-bold mb-3 text-primary">العنوان</h3><p className="text-foreground">{bookstore.address}</p></div>}
              <div><h3 className="text-xl font-bold mb-3 text-primary">التواصل</h3><div className="space-y-2">{bookstore.email && <p className="text-foreground"><span className="font-semibold">البريد الإلكتروني:</span> {bookstore.email}</p>}{bookstore.phone && <p className="text-foreground"><span className="font-semibold">الهاتف:</span> {bookstore.phone}</p>}</div></div>
            </div></div>
            <div className="frame-gold mt-8"><h3 className="text-2xl font-bold mb-6 text-primary">الخدمات</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="p-4 border-2 border-primary rounded"><p className="font-semibold text-primary">بيع الكتب</p><p className="text-sm text-muted-foreground mt-2">كتب ورقية ورقمية حسب العروض المتاحة.</p></div><div className="p-4 border-2 border-primary rounded"><p className="font-semibold text-primary">التواصل المباشر</p><p className="text-sm text-muted-foreground mt-2">تواصل مع المكتبة عبر بيانات الاتصال المنشورة.</p></div></div></div>
          </div>
        </div>
      </section>
      <footer className="border-t-2 border-primary bg-secondary py-12 mt-12"><div className="container mx-auto text-center text-muted-foreground"><p>&copy; 2026 BookHub. جميع الحقوق محفوظة.</p></div></footer>
    </div>
  );
}
