import "@/styles/leaflet.css";

import L from "leaflet";
import { MapPin, Navigation, Play, Square } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

import type { LocationWithParsedDates } from "../../types";

export type DiagnosticRouteMapRef = {
  centerMap: () => void;
  fitToBounds: () => void;
};

type DiagnosticRouteMapProps = {
  locations: LocationWithParsedDates[];
  make?: string;
  model?: string;
  className?: string;
};

export const DiagnosticRouteMap = forwardRef<DiagnosticRouteMapRef, DiagnosticRouteMapProps>(
  ({ locations, make, model, className = "h-[400px] w-full" }, ref) => {
    const [isMounted, setIsMounted] = useState(false);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    const sortedLocations = [...locations].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const pathCoordinates: [number, number][] = sortedLocations.map(loc => [loc.latitude, loc.longitude]);

    useImperativeHandle(ref, () => ({
      centerMap: () => {
        if (mapRef.current && pathCoordinates.length > 0) {
          const bounds = L.latLngBounds(pathCoordinates);
          mapRef.current.fitBounds(bounds, { padding: [20, 20] });
        }
      },
      fitToBounds: () => {
        if (mapRef.current && pathCoordinates.length > 0) {
          const bounds = L.latLngBounds(pathCoordinates);
          mapRef.current.fitBounds(bounds, { padding: [20, 20] });
        }
      },
    }));

    if (!isMounted) {
      return (
        <div className={`flex items-center justify-center bg-muted/20 p-6 text-center rounded-md ${className}`}>
          <div>
            <MapPin className="mx-auto mb-2 h-10 w-10 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">Loading route map...</p>
          </div>
        </div>
      );
    }

    if (locations.length === 0) {
      return (
        <div className={`flex items-center justify-center bg-muted/20 p-6 text-center rounded-md ${className}`}>
          <div>
            <Navigation className="mx-auto mb-2 h-10 w-10 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">No location data available</p>
          </div>
        </div>
      );
    }

    // Create custom icons
    const startIcon = new L.Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5,3 19,12 5,21 12,12"></polygon>
        </svg>
      `)}`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
      className: "text-green-600",
    });

    const endIcon = new L.Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
        </svg>
      `)}`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
      className: "text-red-600",
    });

    const startLocation = sortedLocations[0];
    const endLocation = sortedLocations[sortedLocations.length - 1];

    // Calculate center point for initial view
    const centerLat = pathCoordinates.reduce((sum, coord) => sum + coord[0], 0) / pathCoordinates.length;
    const centerLng = pathCoordinates.reduce((sum, coord) => sum + coord[1], 0) / pathCoordinates.length;

    return (
      <div className={`overflow-hidden rounded-md ${className}`}>
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          scrollWheelZoom={true}
          className="map-monochrome"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />

          {/* Route polyline */}
          {pathCoordinates.length > 1 && (
            <Polyline
              positions={pathCoordinates}
              color="#3B82F6"
              weight={4}
              opacity={0.8}
            />
          )}

          {/* Start marker */}
          {startLocation && (
            <Marker position={[startLocation.latitude, startLocation.longitude]} icon={startIcon}>
              <Popup className="custom-popup">
                <div className="font-medium text-green-700 mb-1 flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  Start
                </div>
                {make && model ? `${make} ${model}` : "Vehicle"}
                <br />
                <span className="text-xs text-muted-foreground">
                  {startLocation.timestamp.toLocaleString()}
                </span>
                {startLocation.speed && (
                  <>
                    <br />
                    <span className="text-xs">
                      Speed:
                      {startLocation.speed.toFixed(1)}
                      {" "}
                      km/h
                    </span>
                  </>
                )}
              </Popup>
            </Marker>
          )}

          {/* End marker */}
          {endLocation && sortedLocations.length > 1 && (
            <Marker position={[endLocation.latitude, endLocation.longitude]} icon={endIcon}>
              <Popup className="custom-popup">
                <div className="font-medium text-red-700 mb-1 flex items-center gap-1">
                  <Square className="h-3 w-3" />
                  End
                </div>
                {make && model ? `${make} ${model}` : "Vehicle"}
                <br />
                <span className="text-xs text-muted-foreground">
                  {endLocation.timestamp.toLocaleString()}
                </span>
                {endLocation.speed && (
                  <>
                    <br />
                    <span className="text-xs">
                      Speed:
                      {endLocation.speed.toFixed(1)}
                      {" "}
                      km/h
                    </span>
                  </>
                )}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    );
  },
);

DiagnosticRouteMap.displayName = "DiagnosticRouteMap";
