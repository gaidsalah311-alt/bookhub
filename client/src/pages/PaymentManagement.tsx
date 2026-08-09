import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";

export default function PaymentManagement() {
  const { user } = useAuth();
  if (!user) return <main className="container py-16 text-center">يجب تسجيل الدخول.</main>;
  return <main className="container mx-auto max-w-4xl py-16"><Card className="p-8 space-y-5"><h1 className="text-3xl font-bold">إدارة الدفع</h1><p className="text-muted-foreground leading-8">لا يتم عرض معاملات مالية وهمية. نظام الدفع والفواتير سيصبح فعالًا بعد ربط مزود دفع حقيقي وتفعيل Webhooks والتحقق من التوقيعات.</p><div className="rounded-lg border p-5"><h2 className="font-bold mb-2">الحالة الحالية</h2><p className="text-sm text-muted-foreground">جاهزية البنية البرمجية موجودة، لكن المعاملات المدفوعة والفواتير الحقيقية متوقفة حتى توفر بيانات الربط.</p></div></Card></main>;
}
