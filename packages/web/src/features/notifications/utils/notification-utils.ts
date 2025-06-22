export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return "Just now";
  }
  else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  }
  else if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)}d ago`;
  }
  else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}

export function parseNotificationData(data: string | null) {
  if (!data)
    return null;
  try {
    return JSON.parse(data);
  }
  catch {
    return null;
  }
}
