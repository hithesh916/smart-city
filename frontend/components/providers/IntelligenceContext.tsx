"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Activity, Droplets, Car, AlertTriangle, Stethoscope, Trees } from "lucide-react";

// Default Initial Stats
const defaultStats = {
    location: "City Overview",
    address: "General City Area",
    metrics: [
        {
            title: "Air Pollution",
            value: "AQI 142",
            status: "Moderate Risk",
            description: "PM2.5 levels are higher than average today.",
            icon: "Activity",
            color: "text-yellow-500",
        },
        {
            title: "Water Quality",
            value: "Safe",
            status: "Optimal",
            description: "Drinking water quality is within safe limits.",
            icon: "Droplets",
            color: "text-blue-500",
        },
        {
            title: "Traffic Congestion",
            value: "High",
            status: "Delays Exp.",
            description: "Heavy traffic on Main St and 5th Ave.",
            icon: "Car",
            color: "text-red-500",
        },
        {
            title: "Crime Rate",
            value: "Low",
            status: "Safe",
            description: "No major incidents reported in the last 24h.",
            icon: "AlertTriangle",
            color: "text-green-500",
        },
        {
            title: "Medical Facilities",
            value: "98% Avail",
            status: "Good",
            description: "Hospital beds and ER capacity normal.",
            icon: "Stethoscope",
            color: "text-emerald-500",
        },
        {
            title: "Parks & Open Land",
            value: "24",
            status: "Active",
            description: "Public parks open. Maintenance ongoing.",
            icon: "Trees",
            color: "text-green-600",
        },
    ]
};

type IntelligenceContextType = {
    globalStats: any;
    setGlobalStats: (stats: any) => void;
};

const IntelligenceContext = createContext<IntelligenceContextType>({
    globalStats: defaultStats,
    setGlobalStats: () => { },
});

export function IntelligenceProvider({ children }: { children: React.ReactNode }) {
    const [globalStats, setStatsInternal] = useState(defaultStats);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("cityStats");
            if (saved) {
                setStatsInternal(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load stats", e);
        }
        setIsInitialized(true);
    }, []);

    // Sync to LocalStorage
    const setGlobalStats = (stats: any) => {
        setStatsInternal(stats);
        localStorage.setItem("cityStats", JSON.stringify(stats));
    };

    if (!isInitialized) {
        return null; // or a loader
    }

    return (
        <IntelligenceContext.Provider value={{ globalStats, setGlobalStats }}>
            {children}
        </IntelligenceContext.Provider>
    );
}

export const useIntelligence = () => useContext(IntelligenceContext);
