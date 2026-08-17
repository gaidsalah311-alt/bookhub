import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CoverUploadField from "@/components/CoverUploadField";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddBookPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    publishYear: new Date().getFullYear(),
    rating: 0,
    readingStatus: "لم يُقرأ" as "مقروء" | "قيد القراءة" | "لم يُقرأ",
    coverImageUrl: "",
    coverImageKey: "",
    coverImageMimeType: "",
    coverImageSize: 0,
  });

  const createBookMutation = trpc.books.create.useMutation({
    onSuccess: () => {
      toast.success("تم إضافة الكتاب بنجاح!");
      setLocation("/");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء إضافة الكتاب");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "publishYear" || name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) {
      toast.error("يرجى ملء العنوان والمؤلف");
      return;
    }
    createBookMutation.mutate({
      ...formData,
      coverImageKey: formData.coverImageKey || undefined,
      coverImageMimeType: formData.coverImageMimeType || undefined,
      coverImageSize: formData.coverImageSize || undefined,
    } as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="gap-2 mb-6"
          >
            <ArrowRight size={20} />
            العودة
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">إضافة كتاب جديد</h1>
          <p className="text-gray-600 mt-2">
            أضف كتاباً جديداً إلى مكتبتك الشخصية
          </p>
        </div>

        {/* Form */}
        <Card className="p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                عنوان الكتاب *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="أدخل عنوان الكتاب"
                className="text-lg"
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author" className="text-base font-semibold">
                اسم المؤلف *
              </Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="أدخل اسم المؤلف"
                className="text-lg"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                الوصف
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="أضف وصفاً للكتاب (اختياري)"
                className="min-h-32"
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Publish Year */}
              <div className="space-y-2">
                <Label htmlFor="publishYear" className="text-base font-semibold">
                  سنة النشر
                </Label>
                <Input
                  id="publishYear"
                  name="publishYear"
                  type="number"
                  value={formData.publishYear}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label htmlFor="rating" className="text-base font-semibold">
                  التقييم (0-5)
                </Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                />
              </div>
            </div>

            {/* Reading Status */}
            <div className="space-y-2">
              <Label htmlFor="readingStatus" className="text-base font-semibold">
                حالة القراءة
              </Label>
              <Select
                value={formData.readingStatus}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    readingStatus: value as "مقروء" | "قيد القراءة" | "لم يُقرأ",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="لم يُقرأ">لم يُقرأ</SelectItem>
                  <SelectItem value="قيد القراءة">قيد القراءة</SelectItem>
                  <SelectItem value="مقروء">مقروء</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <CoverUploadField
              value={formData.coverImageUrl}
              onUrlChange={(coverImageUrl) =>
                setFormData((prev) => ({ ...prev, coverImageUrl }))
              }
              onMetadataChange={({ key, mimeType, size }) =>
                setFormData((prev) => ({
                  ...prev,
                  coverImageKey: key || "",
                  coverImageMimeType: mimeType || "",
                  coverImageSize: size || 0,
                }))
              }
            />

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={createBookMutation.isPending}
                className="flex-1"
              >
                {createBookMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    جاري الإضافة...
                  </>
                ) : (
                  "إضافة الكتاب"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setLocation("/")}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
