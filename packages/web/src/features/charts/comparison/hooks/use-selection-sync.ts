import { useEffect } from "react";

type SelectionSyncProps = {
  urlSessions: string[];
  urlSensors: string[];
  localStorageSessions: string[];
  localStorageSensors: string[];
  setUrlSessions: (sessions: string) => void;
  setUrlSensors: (sensors: string) => void;
  updateLocalStorageSessions: (sessions: string[]) => void;
  updateLocalStorageSensors: (sensors: string[]) => void;
};

/**
 * Hook to synchronize URL parameters with localStorage preferences
 */
export function useSelectionSync({
  urlSessions,
  urlSensors,
  localStorageSessions,
  localStorageSensors,
  setUrlSessions,
  setUrlSensors,
  updateLocalStorageSessions,
  updateLocalStorageSensors,
}: SelectionSyncProps) {
  // Sync URL query parameters with localStorage preferences
  useEffect(() => {
    // When URL params change, update localStorage
    if (urlSessions.length > 0 && JSON.stringify(urlSessions) !== JSON.stringify(localStorageSessions)) {
      updateLocalStorageSessions(urlSessions);
    }

    if (urlSensors.length > 0 && JSON.stringify(urlSensors) !== JSON.stringify(localStorageSensors)) {
      updateLocalStorageSensors(urlSensors);
    }

    // When component mounts and URL params are empty, restore from localStorage
    if (urlSessions.length === 0 && localStorageSessions.length > 0) {
      setUrlSessions(localStorageSessions.join(","));
    }

    if (urlSensors.length === 0 && localStorageSensors.length > 0) {
      setUrlSensors(localStorageSensors.join(","));
    }
  }, [
    urlSessions,
    urlSensors,
    localStorageSessions,
    localStorageSensors,
    updateLocalStorageSessions,
    updateLocalStorageSensors,
    setUrlSessions,
    setUrlSensors,
  ]);
}
