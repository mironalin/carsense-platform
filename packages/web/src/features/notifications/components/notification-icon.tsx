import { Bell, CheckCircle, Mail, XCircle } from "lucide-react";

type NotificationIconProps = {
  type: string;
};

export function NotificationIcon({ type }: NotificationIconProps) {
  switch (type) {
    case "transfer_request":
      return <Mail className="h-4 w-4 text-blue-500 dark:text-blue-600" />;
    case "transfer_accepted":
      return <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-600" />;
    case "transfer_rejected":
      return <XCircle className="h-4 w-4 text-red-500 dark:text-red-600" />;
    case "transfer_cancelled":
      return <XCircle className="h-4 w-4 text-gray-500 dark:text-gray-600" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />;
  }
}
