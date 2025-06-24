type StatItemProps = {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: "default" | "success" | "warning" | "danger";
};

export function StatItem({ icon, value, label, color = "default" }: StatItemProps) {
  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "bg-gradient-to-br from-emerald-50/80 via-emerald-50/40 to-background dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-background border-emerald-200/60 dark:border-emerald-800/60";
      case "warning":
        return "bg-gradient-to-br from-amber-50/80 via-amber-50/40 to-background dark:from-amber-950/40 dark:via-amber-950/20 dark:to-background border-amber-200/60 dark:border-amber-800/60";
      case "danger":
        return "bg-gradient-to-br from-red-50/80 via-red-50/40 to-background dark:from-red-950/40 dark:via-red-950/20 dark:to-background border-red-200/60 dark:border-red-800/60";
      default:
        return "bg-gradient-to-br from-blue-50/80 via-blue-50/40 to-background dark:from-blue-950/40 dark:via-blue-950/20 dark:to-background border-blue-200/60 dark:border-blue-800/60";
    }
  };

  const getValueColor = () => {
    switch (color) {
      case "success":
        return "text-emerald-700 dark:text-emerald-300";
      case "warning":
        return "text-amber-700 dark:text-amber-300";
      case "danger":
        return "text-red-700 dark:text-red-300";
      default:
        return "text-blue-700 dark:text-blue-300";
    }
  };

  const getIconColor = () => {
    switch (color) {
      case "success":
        return "text-emerald-600 dark:text-emerald-400";
      case "warning":
        return "text-amber-600 dark:text-amber-400";
      case "danger":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <div className={`relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md backdrop-blur-sm ${getColorClasses()}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-background/70 backdrop-blur-sm border border-border/50 ${getIconColor()}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className={`text-2xl font-bold tabular-nums ${getValueColor()}`}>{value}</div>
          <div className="text-xs font-medium text-muted-foreground/80">{label}</div>
        </div>
      </div>
    </div>
  );
}
