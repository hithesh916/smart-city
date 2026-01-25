"use client";

import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup, CircleMarker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix for default marker icon in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// Map Events Component
function MapEvents({ onBoundsChange }: { onBoundsChange: (bounds: L.LatLngBounds) => void }) {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
    zoomend: () => {
      onBoundsChange(map.getBounds());
    },
  });
  return null;
}

interface CityMapProps {
  places: any[];
  trafficData: any[]; // NEW: Traffic Data
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  flyToPosition: [number, number] | null;
  showPlaces: boolean;
  showTraffic: boolean; // NEW Toggle
}

export default function CityMap({
  places, trafficData,
  onBoundsChange, flyToPosition,
  showPlaces, showTraffic
}: CityMapProps) {

  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    if (mapInstance && flyToPosition) {
      mapInstance.flyTo(flyToPosition, 14, {
        duration: 2,
        easeLinearity: 0.25
      });
    }
  }, [flyToPosition, mapInstance]);

  // Traffic Color Scale
  const getCongestionColor = (value: number) => {
    if (value > 60) return "#7f0025"; // Gridlock (Maroon)
    if (value > 45) return "#ff0000"; // Heavy (Red)
    if (value > 30) return "#ff7e00"; // Moderate (Orange)
    if (value > 15) return "#ffff00"; // Light (Yellow)
    return "#00e400";                 // Free Flow (Green)
  };

  return (
    <div className="h-full w-full z-0 bg-black">
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full outline-none"
        ref={setMapInstance}
        zoomControl={false}
      >
        <MapEvents onBoundsChange={onBoundsChange} />

        {/* Pitch Black Theme: CartoDB Dark Matter */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <LayersControl position="topright">

          {/* Traffic Flow Layer */}
          {showTraffic && (
            <LayersControl.Overlay checked name="Traffic Flow">
              <LayerGroup>
                {trafficData?.map((point, idx) => (
                  <CircleMarker
                    key={`traffic-${idx}`}
                    center={[point.geometry.coordinates[1], point.geometry.coordinates[0]]}
                    pathOptions={{
                      color: getCongestionColor(point.properties.congestion),
                      weight: 1,
                      fillOpacity: 0.8,
                      fillColor: getCongestionColor(point.properties.congestion)
                    }}
                    radius={6}
                  >
                    <Popup>
                      <div className="text-zinc-900">
                        <strong>Intersection #{point.properties.intersection_id}</strong><br />
                        Congestion: {point.properties.congestion?.toFixed(1)}%<br />
                        Speed: {point.properties.avg_speed?.toFixed(1)} km/h<br />
                        Flow: {point.properties.flow_vpm?.toFixed(0)} vpm
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          {/* Places Layer */}
          {showPlaces && (
            <LayersControl.Overlay checked name="Places">
              <LayerGroup>
                {places.map((place, idx) => (
                  <Marker
                    key={`place-${idx}`}
                    position={[place.geometry.coordinates[1], place.geometry.coordinates[0]]}
                  >
                    <Popup>
                      <div className="text-zinc-900">
                        <strong>{place.properties.name || "Unknown Place"}</strong><br />
                        Type: {place.properties.amenity || place.properties.leisure}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}

        </LayersControl>
      </MapContainer>
    </div>
  );
}
