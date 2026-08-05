import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, User } from "lucide-react";

export default function Reviews() {
  const { bookId } = useParams<{ bookId: string }>();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Fetch reviews
  const { data: reviews } = trpc.reviews.getByBook.useQuery(
    { bookId: parseInt(bookId || "0"), limit: 50 },
    { enabled: !!bookId }
  );

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

      {/* Reviews Section */}
      <section className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          {/* Add Review Form */}
          <div className="frame-gold mb-12">
            <h2 className="text-3xl font-bold mb-8 text-primary">أضف تقييمك</h2>

            <div className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold mb-4">التقييم</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-semibold mb-2">رأيك في الكتاب</label>
                <Textarea
                  placeholder="شارك رأيك حول الكتاب..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full min-h-32 bg-input text-foreground border-2 border-primary rounded p-4"
                />
              </div>

              <Button className="btn-luxury">نشر التقييم</Button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="frame-gold">
            <h2 className="text-3xl font-bold mb-8 text-primary">التقييمات ({reviews?.length || 0})</h2>

            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-6 border-2 border-primary rounded hover:bg-secondary transition-colors"
                  >
                    {/* Reviewer Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold">مستخدم</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("ar-SA")}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(Number(review.rating) || 0)
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-foreground leading-relaxed mb-4">
                      {review.content}
                    </p>

                    {/* Helpful */}
                    <div className="flex gap-4">
                      <Button variant="outline" size="sm" className="border-primary text-primary">
                        مفيد ({review.helpful || 0})
                      </Button>
                      <Button variant="outline" size="sm" className="border-destructive text-destructive">
                        غير مفيد
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لا توجد تقييمات حتى الآن</p>
              </div>
            )}
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
