/**
 * دوال مساعدة مشتركة
 */

/**
 * تنسيق السعر بالعملة المحددة
 */
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * تنسيق التاريخ بالصيغة المحلية
 */
export function formatDate(date: Date | string, locale: string = "ar-SA"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * تنسيق الوقت بصيغة نسبية (منذ ساعة، منذ يومين، إلخ)
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسبوع`;
  if (diffDays < 365) return `منذ ${Math.floor(diffDays / 30)} شهر`;
  return `منذ ${Math.floor(diffDays / 365)} سنة`;
}

/**
 * اختصار النص الطويل
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * تحويل النص إلى slug
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * التحقق من صحة البريد الإلكتروني
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * التحقق من صحة رقم الهاتف
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

/**
 * التحقق من صحة رابط URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * التحقق من صحة ISBN
 */
export function isValidISBN(isbn: string): boolean {
  const cleaned = isbn.replace(/[^\d]/g, "");
  return cleaned.length === 10 || cleaned.length === 13;
}

/**
 * حساب متوسط التقييم
 */
export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

/**
 * الحصول على نص التقييم
 */
export function getRatingText(rating: number): string {
  if (rating >= 4.5) return "ممتاز جداً";
  if (rating >= 4) return "ممتاز";
  if (rating >= 3) return "جيد";
  if (rating >= 2) return "مقبول";
  return "ضعيف";
}

/**
 * تحويل حجم الملف إلى صيغة قابلة للقراءة
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * التحقق من صحة كلمة المرور
 */
export function isValidPassword(password: string): boolean {
  // يجب أن تحتوي على 8 أحرف على الأقل، حرف واحد كبير، حرف واحد صغير، رقم واحد
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

/**
 * حساب قوة كلمة المرور
 */
export function getPasswordStrength(password: string): "weak" | "medium" | "strong" {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  if (strength <= 2) return "weak";
  if (strength <= 3) return "medium";
  return "strong";
}

/**
 * إنشاء معرف فريد
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * التحقق من وجود تضارب في الأدوار
 */
export function canUserRole(userRole: string, requiredRole: string | string[]): boolean {
  if (userRole === "admin") return true;
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}

/**
 * دمج الفئات والفئات الفرعية
 */
export function mergeCategoryWithSubcategory(
  category: string,
  subcategory?: string
): string {
  if (!subcategory) return category;
  return `${category} > ${subcategory}`;
}

/**
 * تحويل الكائن إلى query string
 */
export function objectToQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else {
        params.append(key, String(value));
      }
    }
  });
  return params.toString();
}

/**
 * تحويل query string إلى كائن
 */
export function queryStringToObject(queryString: string): Record<string, any> {
  const params = new URLSearchParams(queryString);
  const obj: Record<string, any> = {};
  params.forEach((value, key) => {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  });
  return obj;
}

/**
 * التحقق من تطابق الأنماط (regex)
 */
export function matchesPattern(text: string, pattern: string): boolean {
  try {
    const regex = new RegExp(pattern);
    return regex.test(text);
  } catch {
    return false;
  }
}

/**
 * تنظيف النص من الأحرف الخاصة
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

/**
 * تحويل الأرقام إلى كلمات (للعربية)
 */
export function numberToArabicWords(num: number): string {
  const arabicNumbers = ["صفر", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
  if (num < 10) return arabicNumbers[num];
  if (num < 100) return `${arabicNumbers[Math.floor(num / 10)]}ون`;
  if (num < 1000) return `${arabicNumbers[Math.floor(num / 100)]}مائة`;
  return num.toString();
}

/**
 * حساب الفرق بين تاريخين بالأيام
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;
  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * التحقق من انتهاء الصلاحية
 */
export function isExpired(expiryDate: Date | string): boolean {
  const expiry = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  return expiry < new Date();
}

/**
 * تحويل الأحرف الإنجليزية إلى أرقام عربية
 */
export function convertToArabicNumbers(text: string): string {
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return text.replace(/\d/g, (digit) => arabicNumbers[parseInt(digit)]);
}

/**
 * تحويل الأرقام العربية إلى إنجليزية
 */
export function convertToEnglishNumbers(text: string): string {
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let result = text;
  arabicNumbers.forEach((arabicNum, index) => {
    result = result.replace(new RegExp(arabicNum, "g"), index.toString());
  });
  return result;
}
