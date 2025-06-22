import { CheckCircle, Clock, X, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type TransferStatusBadgeProps = {
  status: string;
};

export function TransferStatusBadge({ status }: TransferStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="bg-amber-500 text-white dark:bg-amber-600">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "accepted":
      return (
        <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Accepted
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="secondary" className="bg-red-500 text-white dark:bg-red-600">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          <X className="h-3 w-3 mr-1" />
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
