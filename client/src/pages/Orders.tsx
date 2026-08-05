import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Orders() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  // Fetch user orders
  const { data: orders, isLoading: isOrdersLoading } = trpc.orders.getUserOrders.useQuery(
    { limit: 50 },
    { enabled: !!user }
  );

  if (loading || isOrdersLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "pending":
        return "قيد الانتظار";
      case "cancelled":
        return "ملغى";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pattern-deco">
      {/* Header */}
      <header className="border-b-2 border-primary bg-background shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-6">
          <a href="/" className="text-2xl font-bold text-primary">
            BookHub
          </a>
          <Button variant="outline" className="border-primary text-primary">
            العودة
          </Button>
        </div>
      </header>

      {/* Orders Section */}
      <section className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">سجل الطلبات</h1>
            <p className="text-muted-foreground">عرض جميع طلباتك وحالتها</p>
          </div>

          {/* Orders List */}
          {orders && orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="frame-gold hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        الطلب #{order.id}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(order.status || "pending")} text-white`}>
                      {getStatusLabel(order.status || "pending")}
                    </Badge>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6 pb-6 border-b-2 border-primary">
                    <p className="text-sm font-semibold text-primary mb-3">محتويات الطلب</p>
                    <div className="space-y-2">
                      {/* Sample items - would be populated from order.items */}
                      <div className="flex items-center justify-between text-sm">
                        <span>كتاب 1</span>
                        <span className="text-primary font-semibold">29.99 ريال</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>كتاب 2</span>
                        <span className="text-primary font-semibold">39.99 ريال</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">المجموع الفرعي:</span>
                      <span className="font-semibold">{order.amount} {order.currency || "ريال"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">الضريبة:</span>
                      <span className="font-semibold">0 {order.currency || "ريال"}</span>
                    </div>
                    <div className="flex items-center justify-between border-t-2 border-primary pt-2">
                      <span className="font-bold">الإجمالي:</span>
                      <span className="text-primary font-bold text-lg">{order.amount} {order.currency || "ريال"}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="btn-luxury flex-1">عرض التفاصيل</Button>
                    {order.status === "completed" && (
                      <Button variant="outline" className="border-primary text-primary flex-1">
                        تحميل الفاتورة
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="frame-gold text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">لا توجد طلبات</p>
              <p className="text-muted-foreground mb-6">لم تقم بأي طلبات حتى الآن</p>
              <Button className="btn-luxury">ابدأ التسوق</Button>
            </div>
          )}
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
