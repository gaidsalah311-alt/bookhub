/**
 * ثوابت منصة BookMarket
 */

// الأدوار
export const USER_ROLES = {
  USER: "user",
  AUTHOR: "author",
  LIBRARY: "library",
  PUBLISHER: "publisher",
  ADMIN: "admin",
} as const;

export const ROLE_LABELS = {
  user: "مستخدم عادي",
  author: "مؤلف",
  library: "مكتبة",
  publisher: "دار نشر",
  admin: "مسؤول",
} as const;

// أنواع الكتب
export const LISTING_TYPES = {
  PAPER: "paper",
  DIGITAL: "digital",
  EXTERNAL_LINK: "external_link",
} as const;

export const LISTING_TYPE_LABELS = {
  paper: "ورقي",
  digital: "رقمي مرخص",
  external_link: "رابط خارجي",
} as const;

// حالة الكتاب
export const BOOK_CONDITION = {
  NEW: "new",
  LIKE_NEW: "like_new",
  GOOD: "good",
  FAIR: "fair",
} as const;

export const BOOK_CONDITION_LABELS = {
  new: "جديد",
  like_new: "كالجديد",
  good: "جيد",
  fair: "مقبول",
} as const;

// حالة الإعلان
export const LISTING_STATUS = {
  ACTIVE: "active",
  SOLD: "sold",
  ARCHIVED: "archived",
  PENDING_REVIEW: "pending_review",
} as const;

export const LISTING_STATUS_LABELS = {
  active: "نشط",
  sold: "مباع",
  archived: "مؤرشف",
  pending_review: "قيد المراجعة",
} as const;

// خطط الاشتراك
export const SUBSCRIPTION_TIERS = {
  FREE: "free",
  PRO: "pro",
  PUBLISHER: "publisher",
  LIBRARY: "library",
} as const;

export const SUBSCRIPTION_TIER_LABELS = {
  free: "مجاني",
  pro: "احترافي",
  publisher: "دار نشر",
  library: "مكتبة",
} as const;

// مستويات الإعلانات المميزة
export const PREMIUM_TIERS = {
  STANDARD: "standard",
  GOLD: "gold",
  PLATINUM: "platinum",
} as const;

export const PREMIUM_TIER_LABELS = {
  standard: "عادي",
  gold: "ذهبي",
  platinum: "بلاتيني",
} as const;

// اللغات المدعومة
export const SUPPORTED_LANGUAGES = {
  AR: "ar",
  EN: "en",
  FR: "fr",
} as const;

export const LANGUAGE_LABELS = {
  ar: "العربية",
  en: "English",
  fr: "Français",
} as const;

// العملات
export const SUPPORTED_CURRENCIES = {
  USD: "USD",
  EUR: "EUR",
  AED: "AED",
  SAR: "SAR",
  EGP: "EGP",
  JOD: "JOD",
  KWD: "KWD",
} as const;

// الدول
export const COUNTRIES = [
  { code: "SA", name: "السعودية", nameEn: "Saudi Arabia", currency: "SAR" },
  { code: "AE", name: "الإمارات", nameEn: "United Arab Emirates", currency: "AED" },
  { code: "EG", name: "مصر", nameEn: "Egypt", currency: "EGP" },
  { code: "JO", name: "الأردن", nameEn: "Jordan", currency: "JOD" },
  { code: "KW", name: "الكويت", nameEn: "Kuwait", currency: "KWD" },
  { code: "US", name: "الولايات المتحدة", nameEn: "United States", currency: "USD" },
  { code: "GB", name: "المملكة المتحدة", nameEn: "United Kingdom", currency: "GBP" },
  { code: "FR", name: "فرنسا", nameEn: "France", currency: "EUR" },
] as const;

// التصنيفات الرئيسية
export const MAIN_CATEGORIES = [
  { id: 1, name: "الأدب", icon: "📚" },
  { id: 2, name: "التاريخ", icon: "📖" },
  { id: 3, name: "العلوم", icon: "🔬" },
  { id: 4, name: "التكنولوجيا", icon: "💻" },
  { id: 5, name: "الأعمال", icon: "💼" },
  { id: 6, name: "التنمية الذاتية", icon: "🌱" },
  { id: 7, name: "الأطفال", icon: "👶" },
  { id: 8, name: "الروايات", icon: "✨" },
] as const;

// أسباب البلاغات
export const REPORT_REASONS = [
  "محتوى مسيء",
  "كتاب مقرصن",
  "سعر غير واقعي",
  "صور مضللة",
  "انتحال شخصية",
  "محتوى جنسي",
  "عنف أو تهديدات",
  "بيانات شخصية",
  "أخرى",
] as const;

// حدود النظام
export const LIMITS = {
  MAX_LISTINGS_FREE: 5,
  MAX_LISTINGS_PRO: 50,
  MAX_LISTINGS_PUBLISHER: 500,
  MAX_LISTINGS_LIBRARY: 1000,
  MAX_IMAGES_PER_LISTING: 5,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_TITLE_LENGTH: 255,
  LISTING_EXPIRY_DAYS: 90,
  MESSAGE_PAGE_SIZE: 20,
  SEARCH_PAGE_SIZE: 20,
} as const;

// رسائل الأخطاء
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "غير مصرح لك بهذا الإجراء",
  NOT_FOUND: "لم يتم العثور على البيانات",
  INVALID_INPUT: "البيانات المدخلة غير صحيحة",
  SERVER_ERROR: "حدث خطأ في الخادم",
  NETWORK_ERROR: "خطأ في الاتصال",
  QUOTA_EXCEEDED: "تم تجاوز الحد المسموح",
} as const;

// رسائل النجاح
export const SUCCESS_MESSAGES = {
  CREATED: "تم الإنشاء بنجاح",
  UPDATED: "تم التحديث بنجاح",
  DELETED: "تم الحذف بنجاح",
  SENT: "تم الإرسال بنجاح",
  SAVED: "تم الحفظ بنجاح",
} as const;

// مدة الاشتراكات (بالأيام)
export const SUBSCRIPTION_DURATIONS = {
  MONTHLY: 30,
  QUARTERLY: 90,
  ANNUAL: 365,
} as const;

// أسعار الاشتراكات (بالدولار)
export const SUBSCRIPTION_PRICES = {
  PRO_MONTHLY: 9.99,
  PRO_ANNUAL: 99.99,
  PUBLISHER_MONTHLY: 49.99,
  PUBLISHER_ANNUAL: 499.99,
  LIBRARY_MONTHLY: 29.99,
  LIBRARY_ANNUAL: 299.99,
} as const;

// أسعار الإعلانات المميزة
export const PREMIUM_AD_PRICES = {
  GOLD_DAILY: 5.99,
  PLATINUM_DAILY: 14.99,
} as const;

// الحد الأدنى والأقصى للأسعار
export const PRICE_LIMITS = {
  MIN: 0.01,
  MAX: 999999.99,
} as const;

// الحد الأدنى والأقصى للتقييمات
export const RATING_LIMITS = {
  MIN: 1,
  MAX: 5,
} as const;

// مدة صلاحية الرابط المؤقت
export const LINK_EXPIRY = {
  RESET_PASSWORD: 24 * 60 * 60 * 1000, // 24 ساعة
  EMAIL_VERIFICATION: 7 * 24 * 60 * 60 * 1000, // 7 أيام
  INVITE: 30 * 24 * 60 * 60 * 1000, // 30 يوم
} as const;

// حدود الرسائل
export const MESSAGE_LIMITS = {
  MAX_LENGTH: 5000,
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// حدود البحث
export const SEARCH_LIMITS = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 100,
  MAX_RESULTS: 100,
} as const;
