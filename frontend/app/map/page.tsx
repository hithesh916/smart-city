"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search, Loader2 } from "lucide-react";
import { useIntelligence } from "@/components/providers/IntelligenceContext";

// @ts-ignore
import { useDebouncedCallback } from "use-debounce";
import IntelligenceSidebar from "@/components/map/IntelligenceSidebar";

// Dynamically import Map to avoid SSR issues
const CityMap = dynamic(() => import("@/components/map/CityMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-muted"><Loader2 className="h-8 w-8 animate-spin" /></div>
});

export default function MapPage() {
  const { setGlobalStats } = useIntelligence();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);

  // Data States
  const [places, setPlaces] = useState([]);
  const [trafficData, setTrafficData] = useState([]); // NEW

  // Analytics State
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [currentBBox, setCurrentBBox] = useState<any>(null);

  // Toggle States
  const [showTraffic, setShowTraffic] = useState(true);
  const [showPlaces, setShowPlaces] = useState(true);

  // Fetch Data based on BBox (Debounced)
  const fetchMapData = useDebouncedCallback(async (bounds: any) => {
    if (!bounds) return;

    const min_lat = bounds.getSouth();
    const max_lat = bounds.getNorth();
    const min_lng = bounds.getWest();
    const max_lng = bounds.getEast();

    setSummaryLoading(true);
    setCurrentBBox({ min_lat, max_lat, min_lng, max_lng });

    try {
      const params = `min_lat=${min_lat}&max_lat=${max_lat}&min_lng=${min_lng}&max_lng=${max_lng}`;

      // In a real app, optimize this to not fetch everything every move if not needed
      const [trafficRes, summaryRes] = await Promise.all([
        fetch(`http://localhost:8001/api/data/traffic?${params}`),
        fetch(`http://localhost:8001/api/analytics/summary?${params}`), // Keeping analytics for now, might need update
      ]);

      if (trafficRes.ok) {
        const data = await trafficRes.json();
        setTrafficData(data.features || []);
      }
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setSummary(data);
      }
    } catch (e) {
      console.error("Failed to fetch map data", e);
    } finally {
      setSummaryLoading(false);
    }
  }, 800);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8001/api/geocode/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setSearchResult([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setLoading(false);
    }
  };

  // History State
  const [history, setHistory] = useState<any[]>([]);

  // Find nearest traffic point to probe (Local Check) OR Fetch Full Intelligence (Server)
  const handleProbeUpdate = async (lat: number, lng: number) => {
    setSummaryLoading(true);

    // 1. Local Traffic Check (Fast Visual Feedback)
    let trafficInfo = null;
    if (trafficData && trafficData.length > 0) {
      let nearestPoint = null;
      let minDist = Infinity;
      trafficData.forEach((point: any) => {
        const pLat = point.geometry.coordinates[1];
        const pLng = point.geometry.coordinates[0];
        const dist = Math.sqrt(Math.pow(pLat - lat, 2) + Math.pow(pLng - lng, 2));
        if (dist < minDist) { minDist = dist; nearestPoint = point; }
      });
      trafficInfo = nearestPoint;
    }

    try {
      // 2. Fetch Comprehensive Analysis from Backend
      const res = await fetch(`http://localhost:8001/api/probe/analyze?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data = await res.json();

        // Merge local traffic info if backend returns sparse traffic data (optional)
        // But backend probe should match.
        setSummary(data);

        // SYNC GLOBAL STATS FOR OVERVIEW PAGE
        const newMetrics = [
          {
            title: "Air Pollution",
            value: `AQI ${data.environment.aqi.value}`,
            status: data.environment.aqi.status,
            description: data.environment.aqi.status === "Good" ? "Air quality is healthy." : "Air quality is poor.",
            icon: "Activity",
            color: data.environment.aqi.value > 100 ? "text-red-500" : "text-emerald-500",
          },
          {
            title: "Water Quality",
            value: data.environment.water.status,
            status: data.environment.water.value > 80 ? "Optimal" : "Check",
            description: `Index: ${data.environment.water.value}/100.`,
            icon: "Droplets",
            color: data.environment.water.value > 80 ? "text-blue-500" : "text-orange-500",
          },
          {
            title: "Traffic Congestion",
            value: data.traffic.status,
            status: `${data.traffic.congestion.toFixed(0)}% Load`,
            description: `Avg Speed: ${data.traffic.speed.toFixed(1)} km/h.`,
            icon: "Car",
            color: data.traffic.congestion > 40 ? "text-red-500" : "text-emerald-500",
          },
          {
            title: "Crime Rate",
            value: data.safety.rating,
            status: data.safety.crime_rate,
            description: `Safety Score: ${data.safety.score}/100.`,
            icon: "AlertTriangle",
            color: data.safety.score > 70 ? "text-green-500" : "text-red-500",
          },
          {
            title: "Medical Facilities",
            value: `${data.nearby.hospitals} Nearby`,
            status: "Avail",
            description: "Emergency services accessible.",
            icon: "Stethoscope",
            color: "text-emerald-500",
          },
          {
            title: "Parks & Open Land",
            value: `${data.nearby.parks}`,
            status: "Active",
            description: "Green spaces in vicinity.",
            icon: "Trees",
            color: "text-green-600",
          },
        ];

        // Extract street name or use coords
        const locName = data.location?.address?.split(",")[0] || `Lat ${lat.toFixed(2)}`;
        setGlobalStats({
          location: locName,
          address: data.location?.address || "Unknown Address",
          metrics: newMetrics
        });


        // Add to History (avoid duplicates)
        setHistory(prev => {
          const newEntry = data;
          // Keep last 10
          return [newEntry, ...prev].slice(0, 10);
        });
      }
    } catch (e) {
      console.error("Probe fetch failed", e);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleHistorySelect = (item: any) => {
    setSummary(item);
    // Move map/probe to this location
    setSearchResult([item.location.lat, item.location.lng]);
    // Also update global stats on history select
    const locName = item.location?.address?.split(",")[0] || "History Item";
    const data = item; // item has same structure
    const newMetrics = [
      { title: "Air Pollution", value: `AQI ${data.environment.aqi.value}`, status: data.environment.aqi.status, description: "Historical Scan", icon: "Activity", color: "text-yellow-500" },
      // ... (simplified reconstruction or just store full metrics in history if possible, but for now just updating basic)
      // Actually, let's just trigger the probe update for proper consistency
    ];
    // Better to just let the probe update handle it via the map effect or explicit call if needed, 
    // but handleProbeUpdate is triggered by map click/flyTo usually. 
    // Let's manually trigger the full fetch/sync to ensure consistency
    handleProbeUpdate(item.location.lat, item.location.lng);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-black">

      {/* LEFT: Map Layer (Flex Grow) */}
      <div className="flex-1 relative border-r border-zinc-800">
        <CityMap
          flyToPosition={searchResult}
          places={places}
          trafficData={trafficData}
          showPlaces={showPlaces}
          showTraffic={showTraffic}
          onBoundsChange={fetchMapData}
          onProbeUpdate={handleProbeUpdate} // Data connection
          selectedLocation={summary?.location ? { lat: summary.location.lat, lng: summary.location.lng, address: summary.location.address } : null}
        />

        {/* Floating Search Bar (Inside Map area) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-md space-y-2 pointer-events-auto">
          <Card className="p-2 flex gap-2 shadow-2xl bg-black/80 backdrop-blur-md border border-zinc-700/50 rounded-full">
            <Input
              placeholder="Search location (e.g., 'Chennai')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-transparent border-none text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 w-full"
            />
            <Button size="icon" onClick={handleSearch} disabled={loading} variant="ghost" className="rounded-full hover:bg-zinc-800 text-zinc-300">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
            <Button size="icon" onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  const { latitude, longitude } = pos.coords;
                  setSearchResult([latitude, longitude]);
                  handleProbeUpdate(latitude, longitude);
                });
              }
            }} variant="ghost" className="rounded-full hover:bg-zinc-800 text-blue-400" title="Use Current Location">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
            </Button>
          </Card>


        </div>
      </div>

      {/* RIGHT: Intelligence Sidebar (Fixed Width) */}
      <div className="w-80 h-full relative z-20 shrink-0">
        <div className="absolute inset-0 bg-zinc-950">
          <IntelligenceSidebar
            data={summary}
            loading={summaryLoading}
            history={history}
            onSelectHistory={handleHistorySelect}
          />
        </div>
      </div>

    </div>
  );
}
