import type { LocationWithParsedDates } from "../../types";

export type PlaybackSpeedOption = "0.25x" | "0.5x" | "1x" | "2x" | "5x" | "10x";

export type LocationPlaybackState = {
  isPlaying: boolean;
  playbackSpeed: PlaybackSpeedOption;
  isLooping: boolean;
  currentIndex: number;
  progress: number;
  elapsedTime: number;
  timestamps: string[];
  startTime: Date;
  timeRange: number;
  currentTimestamp: string | null;
  currentTime: Date | null;
  currentLocation: LocationWithParsedDates | null;
  locations: LocationWithParsedDates[];
};

export type LocationPlaybackControls = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  restart: () => void;
  toggleLoop: () => void;
  setPlaybackSpeed: (speed: PlaybackSpeedOption) => void;
  handleSliderChange: (value: number[]) => void;
};

export type LocationPlaybackProps = {
  locations: LocationWithParsedDates[];
  isLoading: boolean;
};
