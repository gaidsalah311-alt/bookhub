import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Building2, Globe, Users } from "lucide-react";

export default function PublisherProfile() {
  const { publisherId } = useParams<{ publisherId: string }>();
  const numericUserId = Number.parseInt(publisherId || "0", 10);
  const { data: publisher, isLoading } = trpc.profiles.publisher.useQuery(
    { userId: numericUserId },
    { enabled: numericUserId > 0 }
  );
  const { data: books } = trpc.books.getUserListings.useQuery(
    { userId: numericUserId, limit: 20 },
    { enabled: numericUserId > 0 }
  );

  if (isLoading) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p className="text-muted-foreground">جاري التحميل...</p></div>;
  if (!publisher) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p className="text-muted-foreground">لم يتم العثور على الناشر</p></div>;

  return (
    <div className="min-h-screen bg-background text-foreground pattern-deco">
      <header className="border-b-2 border-primary bg-background shadow-lg"><div className="container mx-auto flex items-center justify-between py-6"><a href="/" className="text-2xl font-bold text-primary">BookHub</a><Button variant="outline" className="border-primary text-primary" onClick={() => window.history.back()}>العودة</Button></div></header>
      <section className="container mx-auto py-12"><div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1"><div className="frame-gold sticky top-8">
          {(publisher.logo || publisher.profileImage) && <img src={publisher.logo || publisher.profileImage || ""} alt={publisher.publisherName} className="w-full h-48 object-cover mb-6 rounded" />}
          <h1 className="text-3xl font-bold mb-4 text-primary">{publisher.publisherName || "الناشر"}</h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">{publisher.bio || "لا توجد معلومات متاحة"}</p>
          {publisher.website && <div className="flex items-center gap-3 mb-4"><Globe className="h-5 w-5 text-primary" /><a href={publisher.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">الموقع الرسمي</a></div>}
          <div className="flex items-center gap-3 mb-6"><Building2 className="h-5 w-5 text-primary" /><span>ناشر</span></div>
          <div className="pt-6 border-t-2 border-primary"><div className="flex items-center gap-2 mb-4"><Users className="h-5 w-5 text-primary" /><span className="font-semibold">0 متابع</span></div><Button className="btn-luxury w-full">متابعة</Button></div>
        </div></div>
        <div className="md:col-span-2">
          <div className="frame-gold"><h2 className="text-3xl font-bold mb-8 text-primary">إصدارات الناشر</h2>
            {books && books.length > 0 ? <div className="space-y-6">{books.map((book) => <a key={book.id} href={`/books/${book.slug}`} className="flex gap-4 p-4 border-2 border-primary rounded hover:bg-secondary transition-colors group">{book.cover && <img src={book.cover} alt={book.title} className="w-24 h-32 object-cover rounded" />}<div className="flex-1"><h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{book.title}</h3><p className="text-muted-foreground mb-3 line-clamp-2">{book.description}</p>{book.price && <span className="text-primary font-bold">{book.price} {book.currency}</span>}</div></a>)}</div> : <div className="text-center py-12"><p className="text-muted-foreground">لم ينشر الناشر أي كتب حتى الآن</p></div>}
          </div>
          <div className="frame-gold mt-8"><h3 className="text-2xl font-bold mb-4 text-primary">عن الناشر</h3><p className="text-foreground leading-relaxed">{publisher.bio || "لا توجد معلومات إضافية متاحة"}</p></div>
        </div>
      </div></section>
      <footer className="border-t-2 border-primary bg-secondary py-12 mt-12"><div className="container mx-auto text-center text-muted-foreground"><p>&copy; 2026 BookHub. جميع الحقوق محفوظة.</p></div></footer>
    </div>
  );
}
