import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Globe, Phone } from "lucide-react";

export default function BookstoreProfile() {
  const { bookstoreId } = useParams<{ bookstoreId: string }>();

  // Fetch bookstore info
  const { data: bookstore, isLoading: isBookstoreLoading } = trpc.bookstores.getByUserId.useQuery(
    { userId: parseInt(bookstoreId || "0") },
    { enabled: !!bookstoreId }
  );

  if (isBookstoreLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  if (!bookstore) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">لم يتم العثور على المكتبة</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pattern-deco">
      {/* Header */}
      <header className="border-b-2 border-primary bg-background shadow-lg">
        <div className="container mx-auto flex items-center justify-between py-6">
          <a href="/" className="text-2xl font-bold text-primary">
            BookHub
          </a>
          <Button variant="outline" className="border-primary text-primary">
            العودة
          </Button>
        </div>
      </header>

      {/* Bookstore Profile */}
      <section className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bookstore Info Card */}
          <div className="md:col-span-1">
            <div className="frame-gold sticky top-8">
              <h1 className="text-3xl font-bold mb-4 text-primary">
                {bookstore.storeName || "المكتبة"}
              </h1>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {bookstore.bio || "لا يوجد معلومات متاحة"}
              </p>

              {bookstore.website && (
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                  <a
                    href={bookstore.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    الموقع الرسمي
                  </a>
                </div>
              )}

              {bookstore.address && (
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <span>{bookstore.address}</span>
                </div>
              )}

              {/* Phone number from user profile */}

              <div className="pt-6 border-t-2 border-primary">
                <Button className="btn-luxury w-full">التواصل</Button>
              </div>
            </div>
          </div>

          {/* Bookstore Info */}
          <div className="md:col-span-2">
            <div className="frame-gold">
              <h2 className="text-3xl font-bold mb-8 text-primary">عن المكتبة</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-primary">معلومات عامة</h3>
                  <p className="text-foreground leading-relaxed">
                    {bookstore.bio || "لا توجد معلومات إضافية متاحة"}
                  </p>
                </div>

                {bookstore.address && (
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-primary">العنوان</h3>
                    <p className="text-foreground">{bookstore.address}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold mb-3 text-primary">ساعات العمل</h3>
                  <p className="text-foreground">
                    من الأحد إلى الخميس: 9:00 - 21:00
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-primary">التواصل</h3>
                  <div className="space-y-2">
                    <p className="text-foreground">
                      <span className="font-semibold">الهاتف:</span> بريد إلكتروني
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="frame-gold mt-8">
              <h3 className="text-2xl font-bold mb-6 text-primary">الخدمات</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-2 border-primary rounded">
                  <p className="font-semibold text-primary mb-2">التوصيل المجاني</p>
                  <p className="text-sm text-muted-foreground">للطلبات فوق 100 ريال</p>
                </div>
                <div className="p-4 border-2 border-primary rounded">
                  <p className="font-semibold text-primary mb-2">الاستبدال المجاني</p>
                  <p className="text-sm text-muted-foreground">خلال 30 يوم</p>
                </div>
                <div className="p-4 border-2 border-primary rounded">
                  <p className="font-semibold text-primary mb-2">الدفع الآمن</p>
                  <p className="text-sm text-muted-foreground">بطاقات ائتمان وتحويل بنكي</p>
                </div>
                <div className="p-4 border-2 border-primary rounded">
                  <p className="font-semibold text-primary mb-2">دعم العملاء</p>
                  <p className="text-sm text-muted-foreground">24/7 متاح للمساعدة</p>
                </div>
              </div>
            </div>
          </div>
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
