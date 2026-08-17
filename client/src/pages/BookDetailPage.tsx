import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CoverUploadField from "@/components/CoverUploadField";
import { ArrowRight, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function BookDetailPage() {
  const [, params] = useRoute("/book/:id");
  const [, setLocation] = useLocation();
  const bookId = params?.id ? parseInt(params.id) : null;

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

  const [isEditing, setIsEditing] = useState(false);
  const [personalNote, setPersonalNote] = useState("");
  const [personalRating, setPersonalRating] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: book, isLoading } = trpc.books.get.useQuery(bookId || 0, {
    enabled: bookId !== null,
  });

  const { data: bookNote, isLoading: isBookNoteLoading } =
    trpc.bookNotes.get.useQuery(bookId || 0, {
      enabled: bookId !== null,
    });

  const updateBookMutation = trpc.books.update.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث الكتاب بنجاح!");
      setIsEditing(false);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث الكتاب");
    },
  });

  const saveBookNoteMutation = trpc.bookNotes.upsert.useMutation({
    onSuccess: async () => {
      await utils.bookNotes.get.invalidate(bookId || 0);
      toast.success("تم حفظ ملاحظتك الشخصية");
    },
    onError: (error) => {
      toast.error(error.message || "تعذر حفظ الملاحظة");
    },
  });

  const deleteBookNoteMutation = trpc.bookNotes.delete.useMutation({
    onSuccess: async () => {
      setPersonalNote("");
      setPersonalRating(null);
      await utils.bookNotes.get.invalidate(bookId || 0);
      toast.success("تم حذف الملاحظة الشخصية");
    },
    onError: (error) => {
      toast.error(error.message || "تعذر حذف الملاحظة");
    },
  });

  const deleteBookMutation = trpc.books.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف الكتاب بنجاح!");
      setLocation("/");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف الكتاب");
    },
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description || "",
        publishYear: book.publishYear || new Date().getFullYear(),
        rating: book.rating || 0,
        readingStatus: book.readingStatus as "مقروء" | "قيد القراءة" | "لم يُقرأ",
        coverImageUrl: book.coverImageUrl || "",
        coverImageKey: book.coverImageKey || "",
        coverImageMimeType: book.coverImageMimeType || "",
        coverImageSize: book.coverImageSize || 0,
      });
    }
  }, [book]);

  useEffect(() => {
    setPersonalNote(bookNote?.note || "");
    setPersonalRating(bookNote?.personalRating ?? null);
  }, [bookNote]);

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
    if (!bookId) return;

    updateBookMutation.mutate({
      id: bookId,
      ...formData,
      coverImageKey: formData.coverImageKey || undefined,
      coverImageMimeType: formData.coverImageMimeType || undefined,
      coverImageSize: formData.coverImageSize || undefined,
    } as any);
  };

  const handleSavePersonalNote = (event: React.FormEvent) => {
    event.preventDefault();
    if (!bookId || isBookNoteLoading) return;

    const note = personalNote.trim();
    if (!note && personalRating === null) {
      toast.error("أضف ملاحظة أو تقييماً شخصياً قبل الحفظ");
      return;
    }

    saveBookNoteMutation.mutate({
      bookId,
      note: note || null,
      personalRating,
    });
  };

  const handleDeletePersonalNote = () => {
    if (bookId) deleteBookNoteMutation.mutate(bookId);
  };

  const handleDelete = () => {
    if (confirm("هل أنت متأكد من حذف هذا الكتاب؟")) {
      if (bookId) {
        deleteBookMutation.mutate(bookId);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            الكتاب غير موجود
          </h1>
          <Button onClick={() => setLocation("/")} variant="outline">
            العودة إلى المكتبة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div>
            <Card className="overflow-hidden h-96">
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <div className="text-6xl">📚</div>
                </div>
              )}
            </Card>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2">
            <Card className="p-8">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-semibold">
                      عنوان الكتاب
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="text-lg"
                    />
                  </div>

                  {/* Author */}
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-base font-semibold">
                      اسم المؤلف
                    </Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
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
                      className="min-h-24"
                    />
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-2 gap-4">
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

                  {/* Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={updateBookMutation.isPending}
                      className="flex-1"
                    >
                      {updateBookMutation.isPending ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={20} />
                          جاري التحديث...
                        </>
                      ) : (
                        "حفظ التغييرات"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {book.title}
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">{book.author}</p>
                  </div>

                  {book.description && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">الوصف</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {book.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">سنة النشر</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {book.publishYear}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">التقييم</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {book.rating}/5 ⭐
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">حالة القراءة</p>
                    <p className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {book.readingStatus}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="flex-1"
                    >
                      تعديل
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleteBookMutation.isPending}
                      className="flex-1"
                    >
                      <Trash2 size={20} className="mr-2" />
                      حذف
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Personal notes */}
        <Card className="mt-8 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">ملاحظتي الشخصية</h2>
            <p className="mt-2 text-sm text-gray-600">
              هذه الملاحظات خاصة بك ولا يراها أي مستخدم آخر.
            </p>
          </div>

          <form onSubmit={handleSavePersonalNote} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="personalNote" className="text-base font-semibold">
                ملاحظات القراءة
              </Label>
              <Textarea
                id="personalNote"
                value={personalNote}
                onChange={(event) => setPersonalNote(event.target.value)}
                placeholder="اكتب انطباعاتك أو اقتباساتك أو ما تريد تذكره عن الكتاب..."
                maxLength={10000}
                className="min-h-32 resize-y"
                disabled={isBookNoteLoading || saveBookNoteMutation.isPending}
              />
              <p className="text-xs text-gray-500 text-left" dir="ltr">
                {personalNote.length}/10000
              </p>
            </div>

            <div className="max-w-xs space-y-2">
              <Label htmlFor="personalRating" className="text-base font-semibold">
                تقييمي الشخصي
              </Label>
              <Input
                id="personalRating"
                type="number"
                min="1"
                max="5"
                step="1"
                value={personalRating ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  if (!value) {
                    setPersonalRating(null);
                    return;
                  }
                  const parsed = Number(value);
                  setPersonalRating(
                    Number.isInteger(parsed) && parsed >= 1 && parsed <= 5
                      ? parsed
                      : null
                  );
                }}
                placeholder="من 1 إلى 5"
                disabled={isBookNoteLoading || saveBookNoteMutation.isPending}
              />
              <p className="text-xs text-gray-500">تقييمك الخاص، وليس التقييم العام للكتاب.</p>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
              <Button
                type="submit"
                disabled={
                  isBookNoteLoading ||
                  saveBookNoteMutation.isPending ||
                  deleteBookNoteMutation.isPending
                }
              >
                {saveBookNoteMutation.isPending ? "جاري الحفظ..." : "حفظ الملاحظة"}
              </Button>
              {bookNote && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDeletePersonalNote}
                  disabled={
                    isBookNoteLoading ||
                    saveBookNoteMutation.isPending ||
                    deleteBookNoteMutation.isPending
                  }
                >
                  {deleteBookNoteMutation.isPending ? "جاري الحذف..." : "حذف الملاحظة"}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
