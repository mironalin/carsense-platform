import type { ReactNode } from "react";

import { Battery, Droplet, Gauge, GaugeCircle, Info, ThermometerIcon, Wind } from "lucide-react";

/**
 * Get category icon as React component
 */
export function getCategoryIcon(category: string, className: string = "size-4"): ReactNode {
  // Use lowercase comparison for icon selection
  const iconType = category?.toLowerCase() || "";

  switch (iconType) {
    case "engine":
      return <Gauge className={className} />;
    case "temperature":
      return <ThermometerIcon className={className} />;
    case "electrical":
      return <Battery className={className} />;
    case "fluid":
      return <Droplet className={className} />;
    case "emissions":
      return <Wind className={className} />;
    case "gauge":
      return <Gauge className={className} />;
    case "gaugecircle":
      return <GaugeCircle className={className} />;
    default:
      return <Info className={className} />;
  }
}
