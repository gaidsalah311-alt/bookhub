export interface Book {
  id: number;
  userId: number;
  title: string;
  author: string;
  description: string | null;
  categoryId: number | null;
  publishYear: number | null;
  rating: number | null;
  readingStatus: "مقروء" | "قيد القراءة" | "لم يُقرأ" | null;
  coverImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookStatistics {
  totalBooks: number;
  readBooks: number;
  readingBooks: number;
  unreadBooks: number;
  averageRating: number;
}
