import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Loader2, BookOpen, BookMarked, BookX } from "lucide-react";

export default function StatsPage() {
  const { isAuthenticated } = useAuth();
  const { data: stats, isLoading } = trpc.stats.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">يرجى تسجيل الدخول</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">إحصائياتي</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Books */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الكتب</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalBooks || 0}
                </p>
              </div>
              <BookOpen size={40} className="text-blue-600 opacity-20" />
            </div>
          </Card>

          {/* Read Books */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">كتب مقروءة</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.readBooks || 0}
                </p>
              </div>
              <BookMarked size={40} className="text-green-600 opacity-20" />
            </div>
          </Card>

          {/* Reading Books */}
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">قيد القراءة</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.readingBooks || 0}
                </p>
              </div>
              <BookOpen size={40} className="text-yellow-600 opacity-20" />
            </div>
          </Card>

          {/* Unread Books */}
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">لم تُقرأ</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.unreadBooks || 0}
                </p>
              </div>
              <BookX size={40} className="text-red-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Average Rating */}
        <Card className="mt-8 p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-600 mb-2">متوسط التقييم</p>
              <p className="text-5xl font-bold text-gray-900">
                {stats?.averageRating || 0}/5
              </p>
            </div>
            <div className="text-6xl">⭐</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
