import "@/styles/leaflet.css";

import L from "leaflet";
import { MapPin } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export type VehicleMapRef = {
  centerMap: () => void;
};

type VehicleLocationMapProps = {
  latitude: number;
  longitude: number;
  timestamp?: string;
  make?: string;
  model?: string;
};

export const VehicleLocationMap = forwardRef<VehicleMapRef, VehicleLocationMapProps>(
  ({ latitude, longitude, timestamp, make, model }, ref) => {
    const [isMounted, setIsMounted] = useState(false);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    useImperativeHandle(ref, () => ({
      centerMap: () => {
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 13);
        }
      },
    }));

    if (!isMounted) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-muted/20 p-6 text-center">
          <div>
            <MapPin className="mx-auto mb-2 h-10 w-10 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      );
    }

    const customIcon = new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      shadowSize: [41, 41],
    });

    const position: [number, number] = [latitude, longitude];

    return (
      <div className="h-full w-full overflow-hidden rounded-md">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          className="map-monochrome"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />
          <Marker position={position} icon={customIcon}>
            <Popup className="custom-popup">
              {make && model ? `${make} ${model}` : "Vehicle"}
              <br />
              {timestamp ? `Last seen: ${new Date(timestamp).toLocaleString()}` : ""}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  },
);
