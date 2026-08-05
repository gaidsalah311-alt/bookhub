import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Globe, Users } from "lucide-react";

export default function AuthorProfile() {
  const { userId } = useParams<{ userId: string }>();

  // Fetch author info
  const { data: author, isLoading: isAuthorLoading } = trpc.authors.getByUserId.useQuery(
    { userId: parseInt(userId || "0") },
    { enabled: !!userId }
  );

  // Fetch author's books
  const { data: books } = trpc.authors.getBooks.useQuery(
    { authorId: author?.id || 0, limit: 20 },
    { enabled: !!author?.id }
  );

  if (isAuthorLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">لم يتم العثور على المؤلف</p>
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

      {/* Author Profile */}
      <section className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Author Info Card */}
          <div className="md:col-span-1">
            <div className="frame-gold sticky top-8">
              {author.profileImage && (
                <img
                  src={author.profileImage}
                  alt="المؤلف"
                  className="w-full h-64 object-cover mb-6 rounded"
                />
              )}
              <h1 className="text-3xl font-bold mb-4 text-primary">
                المؤلف
              </h1>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {author.bio || "لا يوجد معلومات متاحة"}
              </p>

              {/* Email from user profile */}

              {author.website && (
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    الموقع الشخصي
                  </a>
                </div>
              )}

              {/* Location from user profile */}

              <div className="pt-6 border-t-2 border-primary">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-semibold">
                    0 متابع
                  </span>
                </div>
                <Button className="btn-luxury w-full">متابعة</Button>
              </div>
            </div>
          </div>

          {/* Author's Books */}
          <div className="md:col-span-2">
            <div className="frame-gold">
              <h2 className="text-3xl font-bold mb-8 text-primary">كتب المؤلف</h2>

              {books && books.length > 0 ? (
                <div className="space-y-6">
                  {books.map((book) => (
                    <a
                      key={book.id}
                      href={`/books/${book.slug}`}
                      className="flex gap-4 p-4 border-2 border-primary rounded hover:bg-secondary transition-colors group"
                    >
                      {book.cover && (
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-24 h-32 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {book.description}
                        </p>
                        <div className="flex items-center justify-between">
                          {book.price && (
                            <span className="text-primary font-bold">
                              {book.price} {book.currency}
                            </span>
                          )}
                          {book.rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm">{Number(book.rating)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">لم ينشر المؤلف أي كتب حتى الآن</p>
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="frame-gold mt-8">
              <h3 className="text-2xl font-bold mb-4 text-primary">عن المؤلف</h3>
              <p className="text-foreground leading-relaxed">
                {author.bio || "لا توجد معلومات إضافية متاحة"}
              </p>
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
