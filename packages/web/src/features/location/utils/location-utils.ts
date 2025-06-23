import type { LocationWithParsedDates } from "../types";

/**
 * Calculate the distance between two geographic points using the Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a
    = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate total distance traveled for a route
 */
export function calculateTotalDistance(locations: LocationWithParsedDates[]): number {
  if (locations.length < 2)
    return 0;

  let totalDistance = 0;
  for (let i = 1; i < locations.length; i++) {
    totalDistance += calculateDistance(
      locations[i - 1].latitude,
      locations[i - 1].longitude,
      locations[i].latitude,
      locations[i].longitude,
    );
  }

  return totalDistance;
}

/**
 * Calculate average speed for a route
 */
export function calculateAverageSpeed(locations: LocationWithParsedDates[]): number {
  const validSpeeds = locations.filter(loc => loc.speed && loc.speed > 0).map(loc => loc.speed!);
  if (validSpeeds.length === 0)
    return 0;

  return validSpeeds.reduce((sum, speed) => sum + speed, 0) / validSpeeds.length;
}

/**
 * Get the bounds of a set of locations
 */
export function getLocationBounds(locations: LocationWithParsedDates[]): {
  north: number;
  south: number;
  east: number;
  west: number;
} | null {
  if (locations.length === 0)
    return null;

  let north = locations[0].latitude;
  let south = locations[0].latitude;
  let east = locations[0].longitude;
  let west = locations[0].longitude;

  locations.forEach((location) => {
    north = Math.max(north, location.latitude);
    south = Math.min(south, location.latitude);
    east = Math.max(east, location.longitude);
    west = Math.min(west, location.longitude);
  });

  return { north, south, east, west };
}

/**
 * Format speed value for display
 */
export function formatSpeed(speed: number): string {
  return `${speed.toFixed(1)} km/h`;
}

/**
 * Format duration in milliseconds to human readable format
 */
export function formatDuration(durationMs: number): string {
  const minutes = Math.round(durationMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString();
}

/**
 * Calculate route statistics from location data
 */
export function calculateRouteStats(locations: LocationWithParsedDates[]) {
  if (locations.length === 0) {
    return null;
  }

  const startTime = locations[0]?.timestamp;
  const endTime = locations[locations.length - 1]?.timestamp;
  const duration = locations.length > 1 
    ? endTime.getTime() - startTime.getTime() 
    : 0;

  const speedValues = locations.filter(loc => loc.speed && loc.speed > 0).map(loc => loc.speed!);
  const maxSpeed = speedValues.length > 0 ? Math.max(...speedValues) : 0;
  const avgSpeed = speedValues.length > 0 
    ? speedValues.reduce((sum, speed) => sum + speed, 0) / speedValues.length 
    : 0;

  return {
    totalPoints: locations.length,
    startTime,
    endTime,
    duration,
    maxSpeed,
    avgSpeed,
  };
}

/**
 * Check if location data has valid coordinates
 */
export function hasValidCoordinates(location: LocationWithParsedDates): boolean {
  return location.latitude !== null && 
         location.longitude !== null && 
         !isNaN(location.latitude) && 
         !isNaN(location.longitude);
}

/**
 * Filter locations with valid coordinates
 */
export function filterValidLocations(locations: LocationWithParsedDates[]): LocationWithParsedDates[] {
  return locations.filter(hasValidCoordinates);
}

/**
 * Filter locations by time range
 */
export function filterLocationsByTimeRange(
  locations: LocationWithParsedDates[],
  startTime: Date,
  endTime: Date,
): LocationWithParsedDates[] {
  return locations.filter(location =>
    location.timestamp >= startTime && location.timestamp <= endTime,
  );
}

/**
 * Simplify route by removing points that are too close together (Douglas-Peucker algorithm simplified)
 */
export function simplifyRoute(
  locations: LocationWithParsedDates[],
  tolerance: number = 0.001, // tolerance in kilometers
): LocationWithParsedDates[] {
  if (locations.length <= 2)
    return locations;

  const simplified: LocationWithParsedDates[] = [locations[0]];

  for (let i = 1; i < locations.length - 1; i++) {
    const distance = calculateDistance(
      simplified[simplified.length - 1].latitude,
      simplified[simplified.length - 1].longitude,
      locations[i].latitude,
      locations[i].longitude,
    );

    if (distance >= tolerance) {
      simplified.push(locations[i]);
    }
  }

  // Always include the last point
  simplified.push(locations[locations.length - 1]);

  return simplified;
}
