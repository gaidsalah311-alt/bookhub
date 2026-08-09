import { useState } from "react";
import { Button } from "@/components/ui/button";

const content: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  about: { title: "عن BookHub", sections: [{ heading: "منصة عالمية للكتب", body: "BookHub منصة لاكتشاف الكتب والإعلان عنها والتواصل بين القراء والمؤلفين والمكتبات ودور النشر." }, { heading: "هدفنا", body: "توفير سوق معلوماتي وإعلاني منظم للكتب مع أدوات بحث واكتشاف وتواصل آمنة." }] },
  privacy: { title: "سياسة الخصوصية", sections: [{ heading: "البيانات", body: "نجمع فقط البيانات اللازمة لتشغيل الحساب والخدمات. لا ينبغي تخزين كلمات المرور أو أسرار الدفع داخل بيانات التطبيق." }, { heading: "التحكم", body: "يمكن للمستخدم طلب تصحيح بياناته أو حذف حسابه وفق سياسة الاحتفاظ المعتمدة عند إطلاق الخدمة." }, { heading: "الخدمات الخارجية", body: "عند ربط OAuth أو الدفع أو التخزين، ستطبق أيضًا سياسات مزودي تلك الخدمات." }] },
  terms: { title: "شروط الاستخدام", sections: [{ heading: "الاستخدام المقبول", body: "يمنع نشر محتوى احتيالي أو مضلل أو مقرصن أو منتهك لحقوق الغير." }, { heading: "الإعلانات", body: "يتحمل المعلن مسؤولية دقة بيانات الكتاب والسعر والروابط الخارجية، وتخضع الإعلانات للمراجعة عند تفعيل المراجعة." }, { heading: "الحسابات", body: "يجب عدم مشاركة بيانات الدخول أو استخدام المنصة لانتحال هوية الآخرين." }] },
  copyright: { title: "حقوق النشر", sections: [{ heading: "الإبلاغ", body: "يمكن الإبلاغ عن إعلان أو مستخدم يشتبه في انتهاكه لحقوق النشر عبر نظام البلاغات." }, { heading: "المراجعة", body: "تراجع الإدارة البلاغات وتستطيع تعليق المحتوى أو حذفه وفق الأدلة والسياسة المعتمدة." }] },
  contact: { title: "اتصل بنا", sections: [{ heading: "الدعم", body: "يمكن تخصيص بريد الدعم ونموذج التواصل عند ربط خدمة البريد في بيئة الإنتاج." }, { heading: "البلاغات", body: "للإبلاغ عن محتوى مخالف استخدم نظام البلاغات داخل حسابك عندما تكون الخاصية متاحة." }] },
};

export function InfoPage({ type }: { type: keyof typeof content }) {
  const page = content[type];
  return <main className="container mx-auto max-w-4xl py-12"><h1 className="text-4xl font-bold mb-8">{page.title}</h1><div className="space-y-6">{page.sections.map((section) => <section key={section.heading} className="rounded-xl border p-6"><h2 className="text-xl font-bold mb-3">{section.heading}</h2><p className="leading-8 text-muted-foreground">{section.body}</p></section>)}</div></main>;
}

export function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    ["كيف أنشر إعلانًا؟", "بعد تسجيل الدخول، استخدم مسار إضافة الإعلان عند تفعيله في المنصة. يبدأ الإعلان بالحالة المناسبة للمراجعة قبل نشره عند تطبيق سياسة المراجعة."],
    ["هل الدفع الإلكتروني يعمل؟", "الدفع المدفوع ينتظر ربط مزود دفع حقيقي. لا يتم تفعيل اشتراك مدفوع برمجيًا قبل تأكيد الدفع."],
    ["كيف أبلغ عن محتوى مخالف؟", "يمكن استخدام نموذج البلاغات للإبلاغ عن مستخدم أو إعلان، وتتم مراجعة البلاغ من الإدارة."],
  ];
  return <main className="container mx-auto max-w-4xl py-12"><h1 className="text-4xl font-bold mb-8">الأسئلة الشائعة</h1><div className="space-y-3">{items.map(([question, answer], index) => <div key={question} className="rounded-xl border"><Button variant="ghost" className="w-full justify-between text-right h-auto py-4" onClick={() => setOpen(open === index ? null : index)}>{question}<span>{open === index ? "−" : "+"}</span></Button>{open === index && <p className="px-5 pb-5 text-muted-foreground leading-7">{answer}</p>}</div>)}</div></main>;
}
