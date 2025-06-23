import { motion } from "framer-motion";
import { useRef } from "react";
import { toast } from "sonner";

import type { LocationWithParsedDates } from "../../types";
import type { DiagnosticRouteMapRef } from "../../components/maps/diagnostic-route-map";

import { LocationErrorAlert } from "../../components/shared/location-error-alert";
import { LocationEmptyState } from "../../components/shared/location-empty-state";
import { LocationRouteStats } from "./location-route-stats";
import { LocationRouteMapCard } from "./location-route-map-card";
import { LoaderPage } from "@/components/loader-page";
import { containerVariants } from "../../utils/animation-variants";

type LocationOverviewProps = {
  locations: LocationWithParsedDates[];
  isLoading: boolean;
  error?: Error | null;
};

export function LocationOverview({ locations, isLoading, error }: LocationOverviewProps) {
  const mapRef = useRef<DiagnosticRouteMapRef>(null);

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.centerMap();
      toast.success("Map centered on route");
    }
  };

  const handleFitToBounds = () => {
    if (mapRef.current) {
      mapRef.current.fitToBounds();
      toast.success("Map adjusted to show full route");
    }
  };

  if (error) {
    return <LocationErrorAlert />;
  }

  if (locations.length === 0 && !isLoading) {
    return <LocationEmptyState />;
  }

  if (isLoading) {
    return <LoaderPage />;

  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 md:grid-cols-3"
    >
      <LocationRouteStats
        locations={locations}
        isLoading={isLoading}
        onCenterMap={handleCenterMap}
        onFitToBounds={handleFitToBounds}
      />
      <LocationRouteMapCard
        ref={mapRef}
        locations={locations}
        isLoading={isLoading}
      />
    </motion.div>
  );
} 