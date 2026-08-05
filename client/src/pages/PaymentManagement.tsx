import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Download, Eye } from "lucide-react";

export default function PaymentManagement() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

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

      {/* Payment Management Section */}
      <section className="container mx-auto py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">إدارة الدفع</h1>
            <p className="text-muted-foreground">عرض ومراقبة جميع معاملاتك المالية</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="transactions">المعاملات</TabsTrigger>
              <TabsTrigger value="invoices">الفواتير</TabsTrigger>
              <TabsTrigger value="methods">طرق الدفع</TabsTrigger>
            </TabsList>

            {/* Transactions Tab */}
            <TabsContent value="transactions">
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="frame-gold">
                    <p className="text-muted-foreground text-sm mb-2">إجمالي المدفوعات</p>
                    <p className="text-3xl font-bold text-primary">5,234 ريال</p>
                  </div>
                  <div className="frame-gold">
                    <p className="text-muted-foreground text-sm mb-2">المعاملات هذا الشهر</p>
                    <p className="text-3xl font-bold text-primary">1,200 ريال</p>
                  </div>
                  <div className="frame-gold">
                    <p className="text-muted-foreground text-sm mb-2">المعاملات المعلقة</p>
                    <p className="text-3xl font-bold text-primary">0 ريال</p>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="frame-gold">
                  <h2 className="text-2xl font-bold mb-6 text-primary">سجل المعاملات</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-primary">
                          <th className="text-left py-3 px-4 font-semibold">التاريخ</th>
                          <th className="text-left py-3 px-4 font-semibold">النوع</th>
                          <th className="text-left py-3 px-4 font-semibold">المبلغ</th>
                          <th className="text-left py-3 px-4 font-semibold">الحالة</th>
                          <th className="text-left py-3 px-4 font-semibold">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: "2026-07-24", type: "اشتراك", amount: "299", status: "مكتمل" },
                          { date: "2026-07-20", type: "إعلان", amount: "150", status: "مكتمل" },
                          { date: "2026-07-15", type: "قائمة مميزة", amount: "199", status: "مكتمل" },
                          { date: "2026-07-10", type: "اشتراك", amount: "299", status: "مكتمل" },
                        ].map((transaction, index) => (
                          <tr key={index} className="border-b border-border hover:bg-secondary transition-colors">
                            <td className="py-3 px-4">{transaction.date}</td>
                            <td className="py-3 px-4">{transaction.type}</td>
                            <td className="py-3 px-4 font-semibold">{transaction.amount} ريال</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-green-600 text-white">{transaction.status}</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="outline" size="sm" className="border-primary text-primary">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices">
              <div className="space-y-6">
                <div className="frame-gold">
                  <h2 className="text-2xl font-bold mb-6 text-primary">الفواتير</h2>
                  <div className="space-y-4">
                    {[
                      { number: "INV-001", date: "2026-07-24", amount: "299", status: "مدفوع" },
                      { number: "INV-002", date: "2026-07-20", amount: "150", status: "مدفوع" },
                      { number: "INV-003", date: "2026-07-15", amount: "199", status: "مدفوع" },
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border-b-2 border-primary last:border-b-0">
                        <div>
                          <p className="font-semibold">{invoice.number}</p>
                          <p className="text-sm text-muted-foreground">{invoice.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{invoice.amount} ريال</p>
                          <Badge className="bg-green-600 text-white mt-1">{invoice.status}</Badge>
                        </div>
                        <Button variant="outline" size="sm" className="border-primary text-primary flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          تحميل
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Payment Methods Tab */}
            <TabsContent value="methods">
              <div className="space-y-6">
                <div className="frame-gold">
                  <h2 className="text-2xl font-bold mb-6 text-primary">طرق الدفع المحفوظة</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border-2 border-primary rounded">
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-semibold">بطاقة ائتمان</p>
                          <p className="text-sm text-muted-foreground">**** **** **** 4242</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white">افتراضي</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border-2 border-border rounded">
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">بطاقة ائتمان</p>
                          <p className="text-sm text-muted-foreground">**** **** **** 5555</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-primary text-primary">
                        تعيين كافتراضي
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t-2 border-primary">
                    <Button className="btn-luxury">إضافة طريقة دفع جديدة</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
