import { Badge } from "@/components/ui/badge";

type NotificationBadgeProps = {
  isRead: string;
};

export function NotificationBadge({ isRead }: NotificationBadgeProps) {
  if (isRead === "false") {
    return (
      <Badge variant="secondary" className="bg-blue-500 dark:bg-blue-600">
        New
      </Badge>
    );
  }

  return null;
}
