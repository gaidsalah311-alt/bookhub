import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import BookCard from "@/components/BookCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function BooksPage() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: books, isLoading, refetch } = trpc.books.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: stats } = trpc.stats.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || book.readingStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [books, searchQuery, statusFilter]);

  const deleteBookMutation = trpc.books.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف الكتاب بنجاح");
      refetch();
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء حذف الكتاب");
    },
  });

  const updateBookMutation = trpc.books.update.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث الكتاب بنجاح");
      refetch();
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء تحديث الكتاب");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            مرحباً بك في BookHub
          </h1>
          <p className="text-gray-600 mb-8">
            قم بتسجيل الدخول لإدارة مكتبتك الشخصية
          </p>
        </div>
      </div>
    );
  }

  const handleDelete = (bookId: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الكتاب؟")) {
      deleteBookMutation.mutate(bookId);
    }
  };

  const handleStatusChange = (bookId: number, status: string) => {
    updateBookMutation.mutate({
      id: bookId,
      readingStatus: status as "مقروء" | "قيد القراءة" | "لم يُقرأ",
    } as any);
  };

  const handleEdit = (book: any) => {
    setLocation(`/book/${book.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">مكتبتي</h1>
              <p className="text-gray-600 mt-1">
                {books?.length || 0} كتاب في مكتبتك
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setLocation("/stats")}
                className="gap-2"
              >
                <BarChart3 size={20} />
                الإحصائيات
              </Button>
              <Button
                onClick={() => setLocation("/add-book")}
                className="gap-2"
              >
                <Plus size={20} />
                إضافة كتاب
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        {isAuthenticated && (
          <SearchAndFilter
            onSearch={setSearchQuery}
            onFilterByStatus={setStatusFilter}
            onFilterByAuthor={() => {}}
          />
        )}

        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : filteredBooks && filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : searchQuery || statusFilter ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              لا توجد نتائج
            </h2>
            <p className="text-gray-600 mb-8">
              لم نجد كتباً تطابق معايير البحث الخاصة بك
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              مكتبتك فارغة
            </h2>
            <p className="text-gray-600 mb-8">
              ابدأ بإضافة كتبك المفضلة إلى مكتبتك الشخصية
            </p>
            <Button onClick={() => setLocation("/add-book")} size="lg">
              <Plus size={20} className="mr-2" />
              إضافة كتاب الآن
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
