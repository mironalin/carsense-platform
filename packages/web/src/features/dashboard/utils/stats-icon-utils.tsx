import { AlertCircle, BarChart3, Bell, DollarSign, Stethoscope, Wrench } from "lucide-react";

export function getStatsIcon(iconType: string) {
  switch (iconType) {
    case "stethoscope":
      return <Stethoscope className="h-5 w-5" />;
    case "alert-circle":
      return <AlertCircle className="h-5 w-5" />;
    case "wrench":
      return <Wrench className="h-5 w-5" />;
    case "bell":
      return <Bell className="h-5 w-5" />;
    case "dollar-sign":
      return <DollarSign className="h-5 w-5" />;
    default:
      return <BarChart3 className="h-5 w-5" />;
  }
}
