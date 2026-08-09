import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function Orders() {
  return <main className="container mx-auto max-w-3xl py-16"><Card className="p-8 text-center space-y-4"><h1 className="text-3xl font-bold">الطلبات</h1><p className="text-muted-foreground leading-8">لم يتم تفعيل نظام الطلبات والشراء داخل BookHub بعد. هذه الصفحة لا تعرض بيانات وهمية؛ ستصبح مرتبطة بالطلبات والفواتير بعد ربط عملية الدفع/الشراء الفعلية.</p><Link href="/search" className="inline-block text-primary font-semibold">استكشف الكتب</Link></Card></main>;
}
