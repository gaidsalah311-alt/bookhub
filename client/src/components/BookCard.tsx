import { Book } from "@shared/types";
import { Star, Trash2, Edit2, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: number) => void;
  onStatusChange?: (bookId: number, status: string) => void;
}

const statusColors: Record<string, string> = {
  "مقروء": "bg-green-100 text-green-800",
  "قيد القراءة": "bg-blue-100 text-blue-800",
  "لم يُقرأ": "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  "مقروء": "مقروء",
  "قيد القراءة": "قيد القراءة",
  "لم يُقرأ": "لم يُقرأ",
};

export default function BookCard({
  book,
  onEdit,
  onDelete,
  onStatusChange,
}: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= (rating || 0)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={48} className="text-gray-300" />
          </div>
        )}
        {/* Overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300">
            {onEdit && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(book)}
                className="rounded-full"
              >
                <Edit2 size={16} />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(book.id)}
                className="rounded-full"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
            {book.title}
          </h3>
        </div>

        {/* Author */}
        <p className="text-xs text-gray-600">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          {renderStars(book.rating || 0)}
          <span className="text-xs text-gray-500">
            ({book.rating || 0}/5)
          </span>
        </div>

        {/* Status Badge */}
        <Badge
          className={`w-fit text-xs font-medium ${
            statusColors[book.readingStatus as keyof typeof statusColors] || statusColors["لم يُقرأ"]
          }`}
        >
          {statusLabels[book.readingStatus as keyof typeof statusLabels] || "لم يُقرأ"}
        </Badge>

        {/* Publish Year */}
        {book.publishYear && (
          <p className="text-xs text-gray-500">
            سنة النشر: {book.publishYear}
          </p>
        )}

        {/* Status Change Buttons */}
        {onStatusChange && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex gap-1 flex-wrap">
              {(["لم يُقرأ", "قيد القراءة", "مقروء"] as const).map((status) => (
              <Button
                key={status}
                size="sm"
                variant={
                  book.readingStatus === status ? "default" : "outline"
                }
                onClick={() => onStatusChange(book.id, status)}
                className="text-xs"
              >
                {status}
              </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
