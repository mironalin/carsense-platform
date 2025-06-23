import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  LocationPlaybackControls,
  LocationPlaybackProps,
  LocationPlaybackState,
  PlaybackSpeedOption,
} from "../types";

export function useLocationPlayback({
  locations,
  isLoading,
}: LocationPlaybackProps): [LocationPlaybackState, LocationPlaybackControls] {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeedState] = useState<PlaybackSpeedOption>("1x");
  const [isLooping, setIsLooping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Refs
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialized = useRef(false);

  // Process locations data
  const { timestamps, startTime, timeRange, sortedLocations } = useMemo(() => {
    if (isLoading || !locations || locations.length === 0) {
      return {
        timestamps: [] as string[],
        startTime: new Date(),
        timeRange: 0,
        sortedLocations: [] as typeof locations,
      };
    }

    // Sort locations by timestamp
    const sorted = [...locations].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Extract timestamps
    const allTimestamps = sorted.map(location => location.timestamp.toISOString());

    // Calculate time range
    const start = sorted[0]?.timestamp || new Date();
    const end = sorted[sorted.length - 1]?.timestamp || new Date();
    const range = end.getTime() - start.getTime();

    return {
      timestamps: allTimestamps,
      startTime: start,
      timeRange: range,
      sortedLocations: sorted,
    };
  }, [locations, isLoading]);

  // Initialize playback
  useEffect(() => {
    if (sortedLocations.length === 0 || initialized.current)
      return;

    setCurrentIndex(0);
    setProgress(0);
    setElapsedTime(0);
    setIsPlaying(false);

    initialized.current = true;
  }, [sortedLocations]);

  // Reset when locations change
  useEffect(() => {
    initialized.current = false;
  }, [locations]);

  // Update progress when currentIndex changes
  useEffect(() => {
    if (timestamps.length === 0 || currentIndex >= timestamps.length)
      return;

    if (timeRange > 0) {
      const current = new Date(timestamps[currentIndex]).getTime();
      const elapsed = current - startTime.getTime();
      const newProgress = (elapsed / timeRange) * 100;

      setElapsedTime(elapsed);
      setProgress(newProgress);
    }
  }, [currentIndex, timestamps, startTime, timeRange]);

  // Playback control loop
  useEffect(() => {
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current);
    }

    if (!isPlaying || timestamps.length === 0) {
      return;
    }

    // Handle end of playback
    if (currentIndex >= timestamps.length - 1) {
      if (isLooping) {
        // Loop back to the beginning
        setCurrentIndex(0);
      }
      else {
        // Stop playback
        setIsPlaying(false);
      }
      return;
    }

    // Calculate speed factor
    let speedFactor = 1;
    switch (playbackSpeed) {
      case "0.25x":
        speedFactor = 0.25;
        break;
      case "0.5x":
        speedFactor = 0.5;
        break;
      case "2x":
        speedFactor = 2;
        break;
      case "5x":
        speedFactor = 5;
        break;
      case "10x":
        speedFactor = 10;
        break;
    }

    // Calculate delay to next timestamp
    const current = new Date(timestamps[currentIndex]).getTime();
    const next = new Date(timestamps[currentIndex + 1]).getTime();
    const delay = Math.max(50, (next - current) / speedFactor); // Minimum 50ms for smooth animation

    playbackTimerRef.current = setTimeout(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }, delay);

    return () => {
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
      }
    };
  }, [isPlaying, currentIndex, timestamps, playbackSpeed, isLooping]);

  // Playback controls
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  const restart = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLooping(prev => !prev);
  }, []);

  const setPlaybackSpeed = useCallback((newSpeed: PlaybackSpeedOption) => {
    setPlaybackSpeedState(newSpeed);
  }, []);

  // Slider handler
  const handleSliderChange = useCallback((value: number[]) => {
    if (timestamps.length === 0)
      return;

    const newProgress = value[0];

    // Find timestamp based on progress
    const targetTime = startTime.getTime() + (timeRange * (newProgress / 100));

    // Find closest timestamp
    let closestIndex = 0;
    let minDiff = Infinity;

    timestamps.forEach((ts, index) => {
      const time = new Date(ts).getTime();
      const diff = Math.abs(time - targetTime);

      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    setCurrentIndex(closestIndex);
  }, [timestamps, startTime, timeRange]);

  // Current data
  const currentTimestamp = timestamps[currentIndex];
  const currentTime = currentTimestamp ? new Date(currentTimestamp) : null;
  const currentLocation = sortedLocations[currentIndex] || null;

  // Return state and controls
  return [
    {
      isPlaying,
      playbackSpeed,
      isLooping,
      currentIndex,
      progress,
      elapsedTime,
      timestamps,
      startTime,
      timeRange,
      currentTimestamp: currentTimestamp || null,
      currentTime,
      currentLocation,
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
  ];
}
