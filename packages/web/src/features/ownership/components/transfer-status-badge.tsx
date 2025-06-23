import { CheckCircle, Clock, X, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type TransferStatusBadgeProps = {
  status: string;
};

export function TransferStatusBadge({ status }: TransferStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="bg-amber-500 dark:bg-amber-600">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "accepted":
      return (
        <Badge variant="default">
          <CheckCircle className="h-3 w-3" />
          Accepted
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          <X className="h-3 w-3" />
          Cancelled
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
}
