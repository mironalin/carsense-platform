import { PauseCircleIcon, PlayCircleIcon, RepeatIcon, SkipBackIcon, StopCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { PlaybackSpeedOption } from "../types";

type PlaybackControlsProps = {
  isPlaying: boolean;
  playbackSpeed: PlaybackSpeedOption;
  isLooping: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: PlaybackSpeedOption) => void;
  onLoopToggle: () => void;
};

export function PlaybackControls({
  isPlaying,
  playbackSpeed,
  isLooping,
  onPlay,
  onPause,
  onStop,
  onRestart,
  onSpeedChange,
  onLoopToggle,
}: PlaybackControlsProps) {
  const speedOptions: PlaybackSpeedOption[] = ["0.25x", "0.5x", "1x", "2x", "5x", "10x"];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 my-3 sm:my-4 bg-muted/30 p-3 sm:p-4 rounded-lg">
      {/* Left controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRestart}
          className="rounded-full h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary/10 hover:text-primary transition-colors"
          title="Restart"
        >
          <SkipBackIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onStop}
          className="rounded-full h-8 w-8 sm:h-9 sm:w-9 hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="Stop"
        >
          <StopCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>

      {/* Center play/pause button */}
      <div className="flex items-center justify-center">
        {isPlaying
          ? (
              <Button
                variant="default"
                size="icon"
                onClick={onPause}
                className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                title="Pause"
              >
                <PauseCircleIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </Button>
            )
          : (
              <Button
                variant="default"
                size="icon"
                onClick={onPlay}
                className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                title="Play"
              >
                <PlayCircleIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </Button>
            )}
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Button
          variant={isLooping ? "outline" : "ghost"}
          size="icon"
          onClick={onLoopToggle}
          className={cn(
            "rounded-full h-8 w-8 sm:h-9 sm:w-9 transition-colors",
            isLooping
              ? "bg-primary/10 text-primary border-primary/30"
              : "hover:bg-primary/10 hover:text-primary",
          )}
          title="Toggle loop playback"
        >
          <RepeatIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-8 w-8 sm:h-9 sm:w-9 transition-colors font-mono text-[10px] sm:text-xs",
                "hover:bg-primary/10 hover:text-primary flex items-center justify-center gap-0.5",
              )}
              title="Playback speed"
            >
              <span className="font-mono text-[10px] sm:text-xs">{playbackSpeed}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={5} className="rounded-xl min-w-0">
            {speedOptions.map(speed => (
              <DropdownMenuItem
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={cn(
                  "text-xs justify-center font-mono",
                  playbackSpeed === speed && "bg-primary/10 text-primary font-medium rounded-md",
                )}
              >
                {speed}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
