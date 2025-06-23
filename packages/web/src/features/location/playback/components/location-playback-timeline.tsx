import { Slider } from "@/components/ui/slider";

import { formatDuration } from "../../utils/location-utils";

type LocationPlaybackTimelineProps = {
  elapsedTime: number;
  timeRange: number;
  progress: number;
  currentTime: Date | null;
  onSliderChange: (value: number[]) => void;
};

export function LocationPlaybackTimeline({
  elapsedTime,
  timeRange,
  progress,
  currentTime,
  onSliderChange,
}: LocationPlaybackTimelineProps) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <div className="flex justify-between text-xs sm:text-sm text-muted-foreground px-1">
        <span className="font-mono">{formatDuration(elapsedTime)}</span>
        <span className="font-mono">{formatDuration(timeRange)}</span>
      </div>
      <div className="relative px-1">
        <Slider
          value={[progress]}
          min={0}
          max={100}
          step={0.1}
          onValueChange={onSliderChange}
          className="h-2"
        />
      </div>

      <div className="text-xs sm:text-sm text-center mt-2 sm:mt-4">
        {currentTime && (
          <div className="text-muted-foreground font-mono truncate">
            <span className="hidden xs:inline">{currentTime.toLocaleString()}</span>
            <span className="xs:hidden">{currentTime.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
