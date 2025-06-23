import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DiagnosticSessionSelector } from "@/features/sensors/components/diagnostic-session-selector";
import { useGetVehicleDiagnostics } from "@/features/vehicles/api/use-get-vehicle-diagnostics";

import type { LocationData, LocationWithParsedDates } from "../../types";

import { useGetDiagnosticLocations } from "../../api/use-get-diagnostic-locations";
import { LocationOverview } from "../../overview/components/location-overview";
import { LocationPlayback } from "../../playback/components/location-playback";
import { LocationTabs } from "../shared/location-tabs";
import { containerVariants, itemVariants } from "../../utils/animation-variants";

type LocationPageProps = {
  vehicleId: string;
};

export function LocationPage({ vehicleId }: LocationPageProps) {
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useQueryState("tab", parseAsString.withDefault("overview"));

  // Fetch diagnostics for the vehicle
  const {
    data: diagnosticsData,
    isLoading: isLoadingDiagnostics,
    error: diagnosticsError,
  } = useGetVehicleDiagnostics({ vehicleId, suspense: true });

  // Fetch locations for selected diagnostic
  const {
    data: locationsData,
    isLoading: isLoadingLocations,
    error: locationsError,
  } = useGetDiagnosticLocations({ diagnosticUUID: selectedDiagnosticId! });

  // Convert location data to typed format
  const processedLocations: LocationWithParsedDates[] = locationsData?.map((location: LocationData) => ({
    ...location,
    timestamp: new Date(location.timestamp),
  })) || [];

  const handleDiagnosticSessionChange = (sessionId: string) => {
    setSelectedDiagnosticId(sessionId);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Auto-select first diagnostic if none selected
  useEffect(() => {
    if (!selectedDiagnosticId && diagnosticsData && diagnosticsData.length > 0) {
      setSelectedDiagnosticId(diagnosticsData[0].uuid);
    }
  }, [selectedDiagnosticId, diagnosticsData]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Error Alerts */}
      {diagnosticsError && (
        <motion.div variants={itemVariants}>
          <Alert variant="destructive">
            <MapPin className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load diagnostic sessions. Please try again later.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* No Diagnostics Available */}
      {!isLoadingDiagnostics && (!diagnosticsData || diagnosticsData.length === 0) && (
        <motion.div variants={itemVariants}>
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertTitle>No diagnostic sessions found</AlertTitle>
            <AlertDescription>
              No diagnostic sessions available for this vehicle. Start a diagnostic session to view location data.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Main Content with Tabs */}
      {(selectedDiagnosticId || activeTab === "overview") && (
        <motion.div variants={itemVariants}>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <LocationTabs />
              
              <DiagnosticSessionSelector
                sessions={diagnosticsData || []}
                selectedSession={selectedDiagnosticId || null}
                onSessionChange={handleDiagnosticSessionChange}
                isLoading={isLoadingDiagnostics}
              />
            </div>

            <TabsContent value="overview" className="space-y-4">
              <LocationOverview 
                locations={processedLocations} 
                isLoading={isLoadingLocations}
                error={locationsError}
              />
            </TabsContent>

            <TabsContent value="playback">
              <LocationPlayback
                locations={processedLocations}
                isLoading={isLoadingLocations}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </motion.div>
  );
}
