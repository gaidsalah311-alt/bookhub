import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToastNotification } from "@/hooks/useToastNotification";

export default function AddBook() {
  const [, setLocation] = useLocation();
  const { showSuccess, showError } = useToastNotification();
  const categories = trpc.books.categories.useQuery();
  const createBook = trpc.books.createBook.useMutation({ onSuccess: (result) => { showSuccess("تم إنشاء الكتاب"); setLocation(`/search`); }, onError: (e) => showError("تعذر إنشاء الكتاب", { description: e.message }) });
  const [form, setForm] = useState({ title: "", author: "", description: "", categoryId: "", language: "ar", isbn: "", publisher: "", pages: "", coverImage: "" });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return <main className="container mx-auto max-w-3xl py-12"><div className="rounded-2xl border p-7 space-y-5"><div><h1 className="text-3xl font-bold">إضافة كتاب</h1><p className="text-muted-foreground mt-2">يتم حفظ بيانات الكتاب في قاعدة البيانات بعد التحقق من المدخلات.</p></div><Input placeholder="عنوان الكتاب" value={form.title} onChange={(e) => update("title", e.target.value)} /><Input placeholder="اسم المؤلف" value={form.author} onChange={(e) => update("author", e.target.value)} /><select className="w-full rounded-md border bg-background px-3 py-2" value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)}><option value="">اختر التصنيف</option>{categories.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><Input placeholder="اللغة مثل ar أو en" value={form.language} onChange={(e) => update("language", e.target.value)} /><Input placeholder="ISBN (اختياري)" value={form.isbn} onChange={(e) => update("isbn", e.target.value)} /><Input placeholder="الناشر (اختياري)" value={form.publisher} onChange={(e) => update("publisher", e.target.value)} /><Input type="number" placeholder="عدد الصفحات" value={form.pages} onChange={(e) => update("pages", e.target.value)} /><Input type="url" placeholder="رابط صورة الغلاف" value={form.coverImage} onChange={(e) => update("coverImage", e.target.value)} /><Textarea placeholder="وصف الكتاب" value={form.description} onChange={(e) => update("description", e.target.value)} maxLength={20000} /><Button disabled={createBook.isPending || !form.title || !form.author || !form.categoryId} onClick={() => createBook.mutate({ title: form.title, author: form.author, description: form.description || undefined, categoryId: Number(form.categoryId), language: form.language, isbn: form.isbn || undefined, publisher: form.publisher || undefined, pages: form.pages ? Number(form.pages) : undefined, coverImage: form.coverImage || undefined })}>{createBook.isPending ? "جاري الحفظ..." : "حفظ الكتاب"}</Button></div></main>;
}
