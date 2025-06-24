export function getStatusColor(daysSinceLastDiagnostic: number | null) {
  if (!daysSinceLastDiagnostic)
    return "gray";
  if (daysSinceLastDiagnostic <= 7)
    return "green";
  if (daysSinceLastDiagnostic <= 30)
    return "yellow";
  return "red";
}

export function getStatusText(daysSinceLastDiagnostic: number | null) {
  if (!daysSinceLastDiagnostic)
    return "No diagnostics";
  if (daysSinceLastDiagnostic <= 7)
    return "Recently checked";
  if (daysSinceLastDiagnostic <= 30)
    return "Check soon";
  return "Overdue";
}

export function getBadgeVariant(statusColor: string) {
  switch (statusColor) {
    case "green":
      return "default";
    case "yellow":
      return "secondary";
    case "red":
      return "destructive";
    default:
      return "outline";
  }
}
