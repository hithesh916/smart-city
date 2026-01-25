"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search, Loader2 } from "lucide-react";

// @ts-ignore
import { useDebouncedCallback } from "use-debounce";
import ContextPanel from "@/components/map/ContextPanel";

// Dynamically import Map to avoid SSR issues
const CityMap = dynamic(() => import("@/components/map/CityMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-muted"><Loader2 className="h-8 w-8 animate-spin" /></div>
});

export default function MapPage() {
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
        fetch(`http://localhost:8000/api/data/traffic?${params}`),
        fetch(`http://localhost:8000/api/analytics/summary?${params}`), // Keeping analytics for now, might need update
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
      const res = await fetch(`http://localhost:8000/api/geocode/search?q=${encodeURIComponent(searchQuery)}`);
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

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Map Layer */}
      <div className="absolute inset-0 z-0">
        <CityMap
          flyToPosition={searchResult}
          places={places}
          trafficData={trafficData}
          showPlaces={showPlaces}
          showTraffic={showTraffic}
          onBoundsChange={fetchMapData}
        />
      </div>

      {/* Floating Search Bar */}
      <div className="absolute top-4 left-4 z-10 w-full max-w-sm space-y-2">
        <Card className="p-2 flex gap-2 shadow-xl bg-zinc-900/90 backdrop-blur border-zinc-800">
          <Input
            placeholder="Search location (e.g., 'New Delhi')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
          />
          <Button size="icon" onClick={handleSearch} disabled={loading} variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </Card>

        {/* Layer Toggles */}
        <Card className="p-4 shadow-xl bg-zinc-900/90 backdrop-blur border-zinc-800 space-y-4 text-zinc-200">
          <h3 className="font-semibold text-sm text-zinc-100">Map Layers</h3>
          <div className="flex items-center justify-between space-x-2">
            <label className="text-sm font-medium">Traffic Flow</label>
            <Switch checked={showTraffic} onCheckedChange={setShowTraffic} />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <label className="text-sm font-medium">Hospitals & Police</label>
            <Switch checked={showPlaces} onCheckedChange={setShowPlaces} />
          </div>
        </Card>
      </div>

      {/* Contextual Panel */}
      <ContextPanel
        data={summary}
        loading={summaryLoading}
        lat={currentBBox ? (currentBBox.min_lat + currentBBox.max_lat) / 2 : null}
        lng={currentBBox ? (currentBBox.min_lng + currentBBox.max_lng) / 2 : null}
      />
    </div>
  );
}
