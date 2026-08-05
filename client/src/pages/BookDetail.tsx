import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Share2, Heart } from "lucide-react";
import { useState } from "react";

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch book details
  const { data: book, isLoading: isBookLoading } = trpc.books.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Fetch reviews
  const { data: reviews } = trpc.reviews.getByBook.useQuery(
    { bookId: book?.id || 0, limit: 20 },
    { enabled: !!book?.id }
  );

  if (isBookLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">لم يتم العثور على الكتاب</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pattern-deco">
      {/* Header */}
      <header className="border-b-2 border-primary bg-background shadow-lg">
        <div className="container mx-auto flex items-center justify-between py-6">
          <a href="/" className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-primary">BookHub</h1>
          </a>
          <Button variant="outline" className="border-primary text-primary">
            العودة
          </Button>
        </div>
      </header>

      {/* Book Details */}
      <section className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="frame-gold sticky top-8">
              {book.cover && (
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-auto mb-6 rounded"
                />
              )}
              <div className="space-y-3">
                <Button className="btn-luxury w-full">
                  <ShoppingCart className="h-5 w-5 ml-2" />
                  إضافة إلى السلة
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={`h-5 w-5 ml-2 ${isFavorite ? "fill-current" : ""}`}
                  />
                  {isFavorite ? "مفضل" : "إضافة للمفضلة"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary"
                >
                  <Share2 className="h-5 w-5 ml-2" />
                  مشاركة
                </Button>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="md:col-span-2">
            <div className="frame-gold">
              <h1 className="text-4xl font-bold mb-4 text-primary">{book.title}</h1>

              {/* Author and Publisher */}
              <div className="mb-6 pb-6 border-b-2 border-primary">
                <p className="text-lg text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">المؤلف:</span> المؤلف
                </p>
                {book.publisherId && (
                  <p className="text-lg text-muted-foreground">
                    <span className="font-semibold text-foreground">الناشر:</span> الناشر
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(Number(book.rating) || 0)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{book.rating || 0} / 5</span>
                <span className="text-muted-foreground">({book.reviewCount || 0} تقييم)</span>
              </div>

              {/* Book Details */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b-2 border-primary">
                <div>
                  <p className="text-sm text-muted-foreground">اللغة</p>
                  <p className="font-semibold">{book.language === "ar" ? "العربية" : book.language}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الصيغة</p>
                  <p className="font-semibold">{book.format || "رقمية"}</p>
                </div>
                {book.pages && (
                  <div>
                    <p className="text-sm text-muted-foreground">عدد الصفحات</p>
                    <p className="font-semibold">{book.pages}</p>
                  </div>
                )}
                {book.isbn && (
                  <div>
                    <p className="text-sm text-muted-foreground">ISBN</p>
                    <p className="font-semibold text-xs">{book.isbn}</p>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">السعر</p>
                <p className="text-3xl font-bold text-primary">
                  {book.price} {book.currency}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-primary">الوصف</h3>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {book.description || "لا يوجد وصف متاح"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="container mx-auto py-12 border-t-2 border-primary">
        <h2 className="text-3xl font-bold mb-8 text-primary">التقييمات والآراء</h2>

        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="reviews" className="text-lg">
              التقييمات ({reviews?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="write" className="text-lg">
              كتابة تقييم
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="frame-gold">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-lg">{review.title}</p>
                        <p className="text-sm text-muted-foreground">بواسطة مستخدم</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground mb-3">{review.content}</p>
                    {review.isVerifiedPurchase && (
                      <p className="text-xs text-primary font-semibold">✓ شراء موثق</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لا توجد تقييمات حتى الآن</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="write">
            <Card className="frame-gold">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">التقييم</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button key={i} className="text-2xl hover:text-primary transition-colors">
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">العنوان</label>
                  <input
                    type="text"
                    placeholder="عنوان التقييم"
                    className="w-full px-4 py-2 bg-input text-foreground border-2 border-primary rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">التعليق</label>
                  <textarea
                    placeholder="شارك رأيك عن الكتاب"
                    rows={5}
                    className="w-full px-4 py-2 bg-input text-foreground border-2 border-primary rounded"
                  />
                </div>
                <Button className="btn-luxury w-full">إرسال التقييم</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
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
