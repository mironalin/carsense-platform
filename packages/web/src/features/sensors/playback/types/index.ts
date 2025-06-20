export type SensorReading = {
  value: number;
  timestamp: string;
};

export type PlaybackSensor = {
  pid: string;
  name: string;
  unit: string;
  category: string;
  readings: SensorReading[];
  minValue?: number | null;
  maxValue?: number | null;
};

export type SensorPlaybackProps = {
  data: any;
  isLoading: boolean;
};

export type SensorValue = {
  value: number;
  hasValue: boolean;
};

export type PlaybackSpeedOption = "0.25x" | "0.5x" | "1x" | "2x" | "5x" | "10x";

export type PlaybackState = {
  isPlaying: boolean;
  playbackSpeed: PlaybackSpeedOption;
  isLooping: boolean;
  currentIndex: number;
  progress: number;
  elapsedTime: number;
  selectedSensors: string[];
  sensorOrder: string[];
  sensorValues: Record<string, number>;
  timestamps: string[];
  startTime: Date;
  timeRange: number;
  currentTimestamp: string | null;
  currentTime: Date | null;
  sensors: PlaybackSensor[];
};

export type PlaybackControls = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  restart: () => void;
  toggleLoop: () => void;
  setPlaybackSpeed: (speed: PlaybackSpeedOption) => void;
  handleSliderChange: (value: number[]) => void;
  toggleSensor: (pid: string) => void;
  selectAllSensors: () => void;
  clearAllSensors: () => void;
  reorderSensors: (newOrder: string[]) => void;
};

// Sensor Selector Props Interface
export type PlaybackSensorSelectorProps = {
  sensors: PlaybackSensor[];
  selectedSensors: string[];
  onToggleSensor: (pid: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
};
