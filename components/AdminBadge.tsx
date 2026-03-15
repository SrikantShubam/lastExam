import { Shield } from "lucide-react";

interface AdminBadgeProps {
  className?: string;
}

export function AdminBadge({ className = "" }: AdminBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 text-xs font-medium rounded-full ${className}`}
    >
      <Shield size={12} />
      Admin
    </span>
  );
}
