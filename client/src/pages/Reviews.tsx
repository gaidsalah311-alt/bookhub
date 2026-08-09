import { Link } from "wouter";
import { Card } from "@/components/ui/card";

export default function Reviews() {
  return <main className="container mx-auto max-w-3xl py-16"><Card className="p-8 text-center space-y-4"><h1 className="text-3xl font-bold">التقييمات</h1><p className="text-muted-foreground leading-8">نظام التقييم الحالي في BookHub مخصص لتقييم المستخدمين والمعلنين بعد التعامل معهم. تقييم الكتاب التفصيلي يحتاج ربطًا مستقلًا بجدول مراجعات الكتب.</p><Link href="/search" className="inline-block text-primary font-semibold">العودة إلى البحث</Link></Card></main>;
}
