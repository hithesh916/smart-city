"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Droplets,
  Car,
  AlertTriangle,
  Stethoscope,
  Trees,
  ArrowRight,
  MapPin
} from "lucide-react";
import { useIntelligence } from "@/components/providers/IntelligenceContext";

// Icon Mapper (String -> Component)
const iconMap: any = {
  Activity: Activity,
  Droplets: Droplets,
  Car: Car,
  AlertTriangle: AlertTriangle,
  Stethoscope: Stethoscope,
  Trees: Trees
};

export default function Home() {
  const { globalStats, setGlobalStats } = useIntelligence();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      // 1. Geocode
      const geoRes = await fetch(`http://localhost:8001/api/geocode/search?q=${encodeURIComponent(searchQuery)}`);
      const geoData = await geoRes.json();

      if (geoData && geoData.length > 0) {
        const { lat, lon, display_name } = geoData[0];
        const city = display_name.split(",")[0];

        // 2. Probe Data
        const probeRes = await fetch(`http://localhost:8001/api/probe/analyze?lat=${lat}&lng=${lon}`);
        const data = await probeRes.json();

        // 3. Map Data to Cards
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
            value: data.environment.water.status, // "Potable" or "Needs Treatment"
            status: data.environment.water.value > 80 ? "Optimal" : "Check",
            description: `Index: ${data.environment.water.value}/100.`,
            icon: "Droplets",
            color: data.environment.water.value > 80 ? "text-blue-500" : "text-orange-500",
          },
          {
            title: "Traffic Congestion",
            value: data.traffic.status, // "High Traffic"
            status: `${data.traffic.congestion.toFixed(0)}% Load`,
            description: `Avg Speed: ${data.traffic.speed.toFixed(1)} km/h.`,
            icon: "Car",
            color: data.traffic.congestion > 40 ? "text-red-500" : "text-emerald-500",
          },
          {
            title: "Crime Rate",
            value: data.safety.rating, // "Safe", "Caution"
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

        const locName = data.location?.address?.split(",")[0] || city;
        setGlobalStats({
          location: locName,
          address: data.location?.address || display_name,
          metrics: newMetrics
        });
      } else {
        alert("No results found. Please try a different location.");
      }
    } catch (e) {
      console.error("Overview search failed", e);
      alert("Search failed. Please ensure the backend is running at http://localhost:8001");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl truncate leading-normal py-1">
            {globalStats.location}
          </h1>
          {/* Street Name Display (Small & Crisp) */}
          {globalStats.address && (
            <div className="flex items-center text-rose-500 font-mono text-xs gap-1">
              <MapPin className="h-3 w-3" />
              <span>{globalStats.address}</span>
            </div>
          )}
        </div>

        <p className="text-xl text-muted-foreground">
          Real-time insights for a smarter, safer, and efficient city.
        </p>

        {/* Dynamic Search Bar */}
        <div className="flex gap-2 max-w-lg mb-4">
          {/* @ts-ignore */}
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search city, street, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Scanning..." : "Search"}
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/20">
            <Link href="/map">
              Explore City Map <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="border-rose-900/30 hover:bg-zinc-900">
            <Link href="/analytics">View Full Analytics</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {globalStats.metrics.map((metric: any, idx: number) => {
          const Icon = iconMap[metric.icon] || Activity;
          return (
            <Card key={idx} className="hover:shadow-2xl hover:shadow-rose-900/10 transition-all duration-300 bg-zinc-950/40 border-zinc-800/50 backdrop-blur-sm group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                  {metric.title}
                </CardTitle>
                <Icon
                  className={`h-4 w-4 ${metric.color}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white tracking-tight">{metric.value}</div>
                <p className="text-xs text-zinc-500 mt-1">
                  <span className={metric.color + " font-medium"}>
                    {metric.status}
                  </span>{" "}
                  - {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
