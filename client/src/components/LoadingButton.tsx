import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: string;
  size?: string;
}

/**
 * مكون Button محسّن مع تأثيرات تحميل سلسة
 * يعرض مؤشر تحميل عند isLoading = true
 */
export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading = false, loadingText, children, disabled, className, variant, size, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={isLoading || disabled}
        variant={variant as any}
        size={size as any}
        className={cn(
          "transition-all duration-200",
          isLoading && "opacity-80",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || "جاري المعالجة..."}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
