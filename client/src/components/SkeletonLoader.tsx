import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * مكون Skeleton محسّن لتأثيرات التحميل
 */

export function BookCardSkeleton() {
  return (
    <div className="book-card space-y-3">
      <Skeleton className="book-cover h-64 w-full rounded-lg" />
      <div className="book-info space-y-2">
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-6 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* رأس الملف الشخصي */}
      <div className="profile-header">
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>

      {/* معلومات الملف الشخصي */}
      <div className="container space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-1/3 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
          <Skeleton className="h-10 w-24 rounded" />
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-8 w-12 mx-auto rounded mb-2" />
              <Skeleton className="h-4 w-16 mx-auto rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-12 w-full rounded" />
        </div>
      </div>
    </div>
  );
}

export function MessageListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <MessageSkeleton key={i} />
      ))}
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {/* شريط البحث */}
      <Skeleton className="h-12 w-full rounded-lg" />

      {/* النتائج */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ListingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-8 w-1/3 rounded" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex gap-4 p-4 border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-6 flex-1 rounded" />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </div>
  );
}

/**
 * مكون تحميل عام مع رسالة
 */
export function LoadingSpinner({ message = "جاري التحميل..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-muted border-t-accent animate-spin" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
