import { ChangeEvent, useRef } from "react";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";

type CoverMetadata = {
  key?: string;
  mimeType?: string;
  size?: number;
};

type CoverUploadFieldProps = {
  value: string;
  onUrlChange: (url: string) => void;
  onMetadataChange: (metadata: CoverMetadata) => void;
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("تعذر قراءة ملف الغلاف"));
    reader.readAsDataURL(file);
  });
}

export default function CoverUploadField({
  value,
  onUrlChange,
  onMetadataChange,
}: CoverUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = trpc.cover.upload.useMutation({
    onSuccess: (result) => {
      onUrlChange(result.url);
      onMetadataChange({
        key: result.key,
        mimeType: result.mimeType,
        size: result.size,
      });
      toast.success("تم رفع الغلاف بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "تعذر رفع الغلاف");
    },
  });

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("اختر ملف JPG أو PNG أو WebP فقط");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("حجم الغلاف يجب ألا يتجاوز 5 ميغابايت");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      uploadMutation.mutate({
        fileName: file.name,
        mimeType: file.type,
        dataBase64: dataUrl,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر قراءة الغلاف");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="cover-upload" className="text-base font-semibold">
          صورة الغلاف
        </Label>
        <span className="text-xs text-gray-500">JPG أو PNG أو WebP · 5MB كحد أقصى</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-[120px_1fr] sm:items-start">
        <div className="h-36 overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">
          {value ? (
            <img src={value} alt="معاينة غلاف الكتاب" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
              <ImagePlus size={28} />
              <span className="text-xs">لا يوجد غلاف</span>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="w-full justify-center gap-2 sm:w-auto"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Upload size={18} />
            )}
            {uploadMutation.isPending ? "جاري رفع الغلاف..." : "اختيار ورفع غلاف"}
          </Button>
          <Input
            ref={inputRef}
            id="cover-upload"
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleFileChange}
            className="hidden"
          />
          <Input
            value={value}
            onChange={(event) => {
              onUrlChange(event.target.value);
              onMetadataChange({});
            }}
            placeholder="أو ألصق رابط صورة الغلاف"
            type="url"
            aria-label="رابط صورة الغلاف"
          />
          <p className="text-xs leading-5 text-gray-500">
            يمكنك رفع صورة من جهازك أو استخدام رابط خارجي. لا يتم حفظ أي ملف قبل إتمام الرفع.
          </p>
        </div>
      </div>
    </div>
  );
}

export type { CoverMetadata };
