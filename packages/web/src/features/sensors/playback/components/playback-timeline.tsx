import { Slider } from "@/components/ui/slider";

import { formatTime } from "../utils/format-utils";

type PlaybackTimelineProps = {
  elapsedTime: number;
  timeRange: number;
  progress: number;
  currentTime: Date | null;
  onSliderChange: (value: number[]) => void;
};

export function PlaybackTimeline({
  elapsedTime,
  timeRange,
  progress,
  currentTime,
  onSliderChange,
}: PlaybackTimelineProps) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <div className="flex justify-between text-xs sm:text-sm text-muted-foreground px-1">
        <span className="font-mono">{formatTime(elapsedTime)}</span>
        <span className="font-mono">{formatTime(timeRange)}</span>
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
            {" "}
            <span className="text-[10px] sm:text-xs opacity-70 inline-block w-[40px] sm:w-[50px]">
              {currentTime.getMilliseconds().toString().padStart(3, "0")}
              ms
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
