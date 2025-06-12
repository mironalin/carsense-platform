/**
 * Utility functions for working with browser storage
 */

const STORAGE_PREFIX = "carsense";

/**
 * Storage keys used in the application
 */
export const STORAGE_KEYS = {
  SELECTED_SENSORS: `${STORAGE_PREFIX}_selected_sensors`,
  SENSOR_ORDER: `${STORAGE_PREFIX}_sensor_order`,
} as const;

/**
 * Save data to localStorage with error handling
 */
export function saveToStorage<T>(key: string, data: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  }
  catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Load data from localStorage with error handling
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    if (data === null)
      return defaultValue;
    return JSON.parse(data) as T;
  }
  catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Save selected sensors to localStorage
 */
export function saveSelectedSensors(sensors: string[]): void {
  saveToStorage(STORAGE_KEYS.SELECTED_SENSORS, sensors);
}

/**
 * Load selected sensors from localStorage
 */
export function loadSelectedSensors(): string[] {
  return loadFromStorage<string[]>(STORAGE_KEYS.SELECTED_SENSORS, []);
}

/**
 * Save sensor order to localStorage
 */
export function saveSensorOrder(order: string[]): void {
  saveToStorage(STORAGE_KEYS.SENSOR_ORDER, order);
}

/**
 * Load sensor order from localStorage
 */
export function loadSensorOrder(): string[] {
  return loadFromStorage<string[]>(STORAGE_KEYS.SENSOR_ORDER, []);
}
