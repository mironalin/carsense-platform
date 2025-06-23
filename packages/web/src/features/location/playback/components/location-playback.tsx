import { motion } from "framer-motion";
import { MapPin, Target } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderPage } from "@/components/loader-page";

import type { LocationWithParsedDates } from "../../types";
import type { LocationPlaybackMapRef } from "../maps/location-playback-map";

import { useLocationPlayback } from "../hooks/use-location-playback";
import { LocationPlaybackMap } from "../maps/location-playback-map";
import { LocationPlaybackControls } from "./location-playback-controls";
import { LocationPlaybackTimeline } from "./location-playback-timeline";
import { containerVariants, itemVariants } from "../../utils/animation-variants";

type LocationPlaybackProps = {
  locations: LocationWithParsedDates[];
  isLoading: boolean;
  make?: string;
  model?: string;
};

export function LocationPlayback({ locations, isLoading, make, model }: LocationPlaybackProps) {
  const mapRef = useRef<LocationPlaybackMapRef>(null);

  const [
    {
      isPlaying,
      playbackSpeed,
      isLooping,
      progress,
      elapsedTime,
      timeRange,
      currentTime,
      currentLocation,
      currentIndex,
      locations: sortedLocations,
    },
    {
      play,
      pause,
      stop,
      restart,
      toggleLoop,
      setPlaybackSpeed,
      handleSliderChange,
    },
  ] = useLocationPlayback({ locations, isLoading });

  const handleCenterOnCurrent = () => {
    if (mapRef.current && currentLocation) {
      mapRef.current.centerOnCurrentLocation();
      toast.success("Map centered on current position");
    }
  };

  const handleFitToBounds = () => {
    if (mapRef.current) {
      mapRef.current.fitToBounds();
      toast.success("Map adjusted to show full route");
    }
  };

  if (isLoading) {
    return <LoaderPage />;
  }

  if (sortedLocations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertTitle>No location data available</AlertTitle>
          <AlertDescription>
            No location data found for this diagnostic session
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Playback
            </CardTitle>
            <CardDescription>
              Interactive playback of the vehicle's route during the diagnostic session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Playback Timeline */}
            <motion.div variants={itemVariants}>
              <LocationPlaybackTimeline
                elapsedTime={elapsedTime}
                timeRange={timeRange}
                progress={progress}
                currentTime={currentTime}
                onSliderChange={handleSliderChange}
              />
            </motion.div>

            {/* Playback Controls */}
            <motion.div variants={itemVariants}>
              <LocationPlaybackControls
                isPlaying={isPlaying}
                playbackSpeed={playbackSpeed}
                isLooping={isLooping}
                onPlay={play}
                onPause={pause}
                onStop={stop}
                onRestart={restart}
                onSpeedChange={setPlaybackSpeed}
                onLoopToggle={toggleLoop}
              />
            </motion.div>

            {/* Current Location Info */}
            {currentLocation && (
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg"
              >
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Position</p>
                  <p className="text-sm font-medium">
                    {currentIndex + 1}
                    {" "}
                    /
                    {sortedLocations.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Speed</p>
                  <p className="text-sm font-medium">
                    {currentLocation.speed ? `${currentLocation.speed.toFixed(1)} km/h` : "N/A"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Altitude</p>
                  <p className="text-sm font-medium">
                    {currentLocation.altitude ? `${currentLocation.altitude.toFixed(1)} m` : "N/A"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                  <p className="text-sm font-medium">
                    {currentLocation.accuracy ? `${currentLocation.accuracy.toFixed(1)} m` : "N/A"}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Map Controls */}
            <motion.div variants={itemVariants} className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCenterOnCurrent}
                disabled={!currentLocation}
                className="flex-1"
              >
                <Target className="mr-2 h-4 w-4" />
                Center on Current
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFitToBounds}
                className="flex-1"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Fit to Route
              </Button>
            </motion.div>

            {/* Playback Map */}
            <motion.div variants={itemVariants}>
              <LocationPlaybackMap
                ref={mapRef}
                locations={sortedLocations}
                currentLocation={currentLocation}
                currentIndex={currentIndex}
                make={make}
                model={model}
                className="h-[500px] w-full"
                showFullRoute={true}
                showTrail={true}
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
