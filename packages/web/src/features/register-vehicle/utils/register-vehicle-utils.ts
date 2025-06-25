export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

export function isExpired(expiresAt: string): boolean {
  return new Date() > new Date(expiresAt);
}

export function getTransferRequestStatusText(isExpired: boolean): string {
  return isExpired ? "Expired" : "Pending";
}

export function getTransferRequestVariant(isExpired: boolean): "destructive" | "default" {
  return isExpired ? "destructive" : "default";
}
