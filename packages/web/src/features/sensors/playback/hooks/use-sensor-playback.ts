import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { PlaybackControls, PlaybackSensor, PlaybackSpeedOption, PlaybackState, SensorPlaybackProps } from "../types";

import { getStandardCategory } from "../../utils/sensor-categories";
import { loadSelectedSensors, loadSensorOrder, saveSelectedSensors, saveSensorOrder } from "../utils/storage-utils";

export function useSensorPlayback({ data, isLoading }: SensorPlaybackProps): [PlaybackState, PlaybackControls] {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeedState] = useState<PlaybackSpeedOption>("1x");
  const [isLooping, setIsLooping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [sensorOrder, setSensorOrder] = useState<string[]>([]);
  const [sensorValues, setSensorValues] = useState<Record<string, number>>({});

  // Refs
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialized = useRef(false);

  // Process data
  const { sensors, timestamps, startTime, timeRange } = useMemo(() => {
    // console.log("Processing sensor data:", data?.sensors?.length || 0, "sensors");

    if (isLoading || !data?.sensors || !Array.isArray(data.sensors)) {
      return {
        sensors: [] as PlaybackSensor[],
        timestamps: [] as string[],
        startTime: new Date(),
        endTime: new Date(),
        timeRange: 0,
      };
    }

    // Process sensors
    const processedSensors: PlaybackSensor[] = data.sensors.map((sensor: any) => {
      // Standardize the category
      const standardizedCategory = getStandardCategory(sensor.category, sensor.pid);

      return {
        pid: sensor.pid,
        name: sensor.name || `Sensor ${sensor.pid}`,
        unit: sensor.unit || "",
        category: standardizedCategory,
        readings: Array.isArray(sensor.readings) ? sensor.readings : [],
        minValue: sensor.minValue,
        maxValue: sensor.maxValue,
      };
    });

    // Extract timestamps
    const allTimestamps: string[] = Array.from(
      new Set(
        processedSensors.flatMap((s: PlaybackSensor) => s.readings.map(r => r.timestamp)),
      ),
    ).sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());

    // console.log(`Found ${allTimestamps.length} unique timestamps`);

    // Calculate time range
    const start = allTimestamps.length > 0 ? new Date(allTimestamps[0]) : new Date();
    const end = allTimestamps.length > 0 ? new Date(allTimestamps[allTimestamps.length - 1]) : new Date();
    const range = end.getTime() - start.getTime();

    return {
      sensors: processedSensors,
      timestamps: allTimestamps,
      startTime: start,
      endTime: end,
      timeRange: range,
    };
  }, [data, isLoading]);

  // Update values for a specific timestamp
  const updateValuesForTimestamp = useCallback((timestamp: string) => {
    const newValues: Record<string, number> = {};

    sensors.forEach((sensor) => {
      const reading = sensor.readings.find(r => r.timestamp === timestamp);
      if (reading) {
        newValues[sensor.pid] = reading.value;
      }
    });

    setSensorValues(prev => ({ ...prev, ...newValues }));
  }, [sensors]);

  // Load saved state from localStorage
  useEffect(() => {
    if (typeof window === "undefined")
      return;

    // Load saved selections
    const savedSensors = loadSelectedSensors();
    const savedOrder = loadSensorOrder();

    if (savedSensors.length > 0) {
      setSelectedSensors(savedSensors);
    }

    if (savedOrder.length > 0) {
      setSensorOrder(savedOrder);
    }
  }, []);

  // Initialize
  useEffect(() => {
    if (sensors.length === 0 || initialized.current)
      return;

    // If we have saved sensors, filter them to only include ones that exist in current data
    const savedSensors = loadSelectedSensors();
    const savedOrder = loadSensorOrder();

    const validSavedSensors = savedSensors.filter(pid =>
      sensors.some(sensor => sensor.pid === pid),
    );

    // Use saved sensors if available and valid, otherwise select defaults
    if (validSavedSensors.length > 0) {
      setSelectedSensors(validSavedSensors);

      // Restore saved order, but only for valid sensors
      const validSavedOrder = savedOrder.filter(pid =>
        validSavedSensors.includes(pid),
      );

      // Add any selected sensors that aren't in the order
      const missingFromOrder = validSavedSensors.filter(pid =>
        !validSavedOrder.includes(pid),
      );

      setSensorOrder([...validSavedOrder, ...missingFromOrder]);
    }
    else {
      // Select primary sensors or default to first 5
      const primaryPids = sensors
        .filter((s: PlaybackSensor) => ["0C", "0D", "05", "42", "2F", "0B"].includes(s.pid))
        .map((s: PlaybackSensor) => s.pid);

      const pidsToSelect = primaryPids.length > 0
        ? primaryPids
        : sensors.slice(0, 5).map((s: PlaybackSensor) => s.pid);

      setSelectedSensors(pidsToSelect);
      setSensorOrder([...pidsToSelect]);
    }

    if (timestamps.length > 0) {
      setCurrentIndex(0);
      updateValuesForTimestamp(timestamps[0]);
    }

    initialized.current = true;
  }, [sensors, timestamps, updateValuesForTimestamp]);

  // Update when currentIndex changes
  useEffect(() => {
    if (timestamps.length === 0 || currentIndex >= timestamps.length)
      return;

    const timestamp = timestamps[currentIndex];

    // Update values
    updateValuesForTimestamp(timestamp);

    // Update progress and elapsed time
    if (timeRange > 0) {
      const current = new Date(timestamp).getTime();
      const elapsed = current - startTime.getTime();
      const newProgress = (elapsed / timeRange) * 100;

      setElapsedTime(elapsed);
      setProgress(newProgress);
    }
  }, [currentIndex, timestamps, updateValuesForTimestamp, startTime, timeRange]);

  // Playback control
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
    const delay = Math.max(10, (next - current) / speedFactor); // Minimum 10ms

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

  // Toggle loop mode
  const toggleLoop = useCallback(() => {
    setIsLooping(prev => !prev);
  }, []);

  // Set playback speed
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

  // Toggle sensor selection
  const toggleSensor = useCallback((pid: string) => {
    setSelectedSensors((prev) => {
      const newSelected = prev.includes(pid)
        ? prev.filter(s => s !== pid)
        : [...prev, pid];

      // Update sensor order when adding new sensors
      if (!prev.includes(pid)) {
        setSensorOrder((current) => {
          const updatedOrder = [...current, pid];
          saveSensorOrder(updatedOrder);
          return updatedOrder;
        });
      }

      // Save the selection to localStorage
      saveSelectedSensors(newSelected);
      return newSelected;
    });
  }, []);

  // Reorder sensors
  const reorderSensors = useCallback((newOrder: string[]) => {
    setSensorOrder(newOrder);
    saveSensorOrder(newOrder);
  }, []);

  // Select all sensors
  const selectAllSensors = useCallback(() => {
    const allPids = sensors.map(s => s.pid);
    setSelectedSensors(allPids);

    // Save the selection to localStorage
    saveSelectedSensors(allPids);

    // Add any missing sensors to the order
    setSensorOrder((current) => {
      const currentSet = new Set(current);
      const newItems = allPids.filter(pid => !currentSet.has(pid));
      const updatedOrder = [...current, ...newItems];

      // Save the order to localStorage
      saveSensorOrder(updatedOrder);

      return updatedOrder;
    });
  }, [sensors]);

  // Clear all sensors
  const clearAllSensors = useCallback(() => {
    setSelectedSensors([]);
    saveSelectedSensors([]);
  }, []);

  // Current timestamp
  const currentTimestamp = timestamps[currentIndex];
  const currentTime = currentTimestamp ? new Date(currentTimestamp) : null;

  // Return state and controls
  return [
    {
      isPlaying,
      playbackSpeed,
      isLooping,
      currentIndex,
      progress,
      elapsedTime,
      selectedSensors,
      sensorOrder,
      sensorValues,
      timestamps,
      startTime,
      timeRange,
      currentTimestamp: currentTimestamp || null,
      currentTime,
      sensors,
    },
    {
      play,
      pause,
      stop,
      restart,
      toggleLoop,
      setPlaybackSpeed,
      handleSliderChange,
      toggleSensor,
      selectAllSensors,
      clearAllSensors,
      reorderSensors,
    },
  ];
}
