import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  duration?: number;
  description?: string;
}

/**
 * Hook مخصص لإدارة رسائل Toast مع رسائل معيارية
 */
export function useToastNotification() {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 3000,
      description: options?.description,
    });
  };

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 4000,
      description: options?.description,
    });
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, {
      duration: options?.duration || 3000,
      description: options?.description,
    });
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      duration: options?.duration || 3500,
      description: options?.description,
    });
  };

  // رسائل معيارية للعمليات الشائعة
  const showListingCreated = () => {
    showSuccess("تم إضافة الإعلان بنجاح", {
      description: "سيظهر إعلانك قريباً في المنصة",
    });
  };

  const showListingUpdated = () => {
    showSuccess("تم تحديث الإعلان بنجاح");
  };

  const showListingDeleted = () => {
    showSuccess("تم حذف الإعلان بنجاح");
  };

  const showMessageSent = () => {
    showSuccess("تم إرسال الرسالة بنجاح");
  };

  const showAddedToFavorites = () => {
    showSuccess("تمت الإضافة إلى المفضلة");
  };

  const showRemovedFromFavorites = () => {
    showSuccess("تمت الإزالة من المفضلة");
  };

  const showFollowSuccess = () => {
    showSuccess("تم المتابعة بنجاح");
  };

  const showUnfollowSuccess = () => {
    showSuccess("تم إلغاء المتابعة");
  };

  const showSubscriptionSuccess = () => {
    showSuccess("تم الاشتراك بنجاح", {
      description: "شكراً لاختيارك خطتنا المميزة",
    });
  };

  const showCopyToClipboard = () => {
    showSuccess("تم النسخ إلى الحافظة");
  };

  const showNetworkError = () => {
    showError("خطأ في الاتصال", {
      description: "يرجى التحقق من اتصالك بالإنترنت",
    });
  };

  const showValidationError = (field: string) => {
    showError(`خطأ في ${field}`, {
      description: "يرجى التحقق من البيانات المدخلة",
    });
  };

  const showUnauthorized = () => {
    showError("غير مصرح", {
      description: "يرجى تسجيل الدخول أولاً",
    });
  };

  const showNotFound = () => {
    showError("لم يتم العثور على البيانات");
  };

  const showServerError = () => {
    showError("خطأ في الخادم", {
      description: "يرجى المحاولة لاحقاً",
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showListingCreated,
    showListingUpdated,
    showListingDeleted,
    showMessageSent,
    showAddedToFavorites,
    showRemovedFromFavorites,
    showFollowSuccess,
    showUnfollowSuccess,
    showSubscriptionSuccess,
    showCopyToClipboard,
    showNetworkError,
    showValidationError,
    showUnauthorized,
    showNotFound,
    showServerError,
  };
}
