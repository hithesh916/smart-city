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
function MapEvents({ onBoundsChange, onMapClick }: { onBoundsChange: (bounds: L.LatLngBounds) => void, onMapClick: (e: L.LeafletMouseEvent) => void }) {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
    zoomend: () => {
      onBoundsChange(map.getBounds());
    },
    click: (e) => {
      onMapClick(e);
    }
  });
  return null;
}

interface CityMapProps {
  places: any[];
  trafficData: any[];
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  flyToPosition: [number, number] | null;
  showPlaces: boolean;
  showTraffic: boolean;
  onProbeUpdate?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number; address: string } | null; // NEW PROP
}

export default function CityMap({
  places, trafficData,
  onBoundsChange, flyToPosition,
  showPlaces, showTraffic,
  onProbeUpdate,
  selectedLocation
}: CityMapProps) {

  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    if (mapInstance && flyToPosition) {
      mapInstance.flyTo(flyToPosition, 14, {
        duration: 2,
        easeLinearity: 0.25
      });
      if (onProbeUpdate) onProbeUpdate(flyToPosition[0], flyToPosition[1]);
    }
  }, [flyToPosition, mapInstance]);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (onProbeUpdate) {
      onProbeUpdate(e.latlng.lat, e.latlng.lng);
    }
  };

  const getCongestionColor = (value: number) => {
    if (value > 60) return "#7f0025";
    if (value > 45) return "#ff0000";
    if (value > 30) return "#ff7e00";
    if (value > 15) return "#ffff00";
    return "#00e400";
  };

  return (
    <div className="h-full w-full z-0 bg-black">
      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full outline-none"
        ref={setMapInstance}
        zoomControl={true}
      >
        <MapEvents onBoundsChange={onBoundsChange} onMapClick={handleMapClick} />

        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Selected Location Marker (The Probe) */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            eventHandlers={{
              add: (e) => {
                e.target.openPopup();
              }
            }}
          >
            <Popup>
              <div className="bg-zinc-950 text-white text-sm font-sans p-3 rounded-md shadow-xl border border-zinc-800 min-w-[180px]">
                <strong className="block mb-1 text-rose-500 font-bold uppercase tracking-wider text-xs">Selected Location</strong>
                <p className="leading-relaxed text-zinc-300">{selectedLocation.address}</p>
              </div>
            </Popup>
          </Marker>
        )}

        <LayersControl position="topright">
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
