export type StatCardColor = "blue" | "green" | "yellow" | "red" | "purple";

export function getStatCardVariant(color: StatCardColor): string {
  switch (color) {
    case "red":
      return "border-red-200/60 dark:border-red-800/60 bg-gradient-to-br from-red-50/80 via-red-25/40 to-background dark:from-red-950/50 dark:via-red-950/20 dark:to-background hover:from-red-50 hover:via-red-25/60 dark:hover:from-red-950/70 dark:hover:via-red-950/30";
    case "green":
      return "border-emerald-200/60 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50/80 via-emerald-25/40 to-background dark:from-emerald-950/50 dark:via-emerald-950/20 dark:to-background hover:from-emerald-50 hover:via-emerald-25/60 dark:hover:from-emerald-950/70 dark:hover:via-emerald-950/30";
    case "yellow":
      return "border-amber-200/60 dark:border-amber-800/60 bg-gradient-to-br from-amber-50/80 via-amber-25/40 to-background dark:from-amber-950/50 dark:via-amber-950/20 dark:to-background hover:from-amber-50 hover:via-amber-25/60 dark:hover:from-amber-950/70 dark:hover:via-amber-950/30";
    case "purple":
      return "border-violet-200/60 dark:border-violet-800/60 bg-gradient-to-br from-violet-50/80 via-violet-25/40 to-background dark:from-violet-950/50 dark:via-violet-950/20 dark:to-background hover:from-violet-50 hover:via-violet-25/60 dark:hover:from-violet-950/70 dark:hover:via-violet-950/30";
    default:
      return "border-blue-200/60 dark:border-blue-800/60 bg-gradient-to-br from-blue-50/80 via-blue-25/40 to-background dark:from-blue-950/50 dark:via-blue-950/20 dark:to-background hover:from-blue-50 hover:via-blue-25/60 dark:hover:from-blue-950/70 dark:hover:via-blue-950/30";
  }
}

export function getStatCardIconColor(color: StatCardColor): string {
  switch (color) {
    case "red":
      return "text-red-600 dark:text-red-400";
    case "green":
      return "text-emerald-600 dark:text-emerald-400";
    case "yellow":
      return "text-amber-600 dark:text-amber-400";
    case "purple":
      return "text-violet-600 dark:text-violet-400";
    default:
      return "text-blue-600 dark:text-blue-400";
  }
}

export function getStatCardShadowColor(color: StatCardColor): string {
  switch (color) {
    case "red":
      return "red";
    case "green":
      return "emerald";
    case "yellow":
      return "amber";
    case "purple":
      return "violet";
    default:
      return "blue";
  }
}
