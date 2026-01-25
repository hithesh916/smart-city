"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Loader2, Activity, Droplets, HeartPulse, Building2 } from "lucide-react";

interface PanelProps {
    data: any | null; // Renamed from summary to match usage in MapPage
    loading: boolean;
    lat: number | null;
    lng: number | null;
}

export default function ContextPanel({ data, loading, lat, lng }: PanelProps) {

    // Transition Config
    const variants: any = {
        hidden: { x: "100%", opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { x: "100%", opacity: 0 }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                className="absolute top-20 right-4 z-20 w-80 shadow-2xl"
            >
                <Card className="bg-zinc-950/90 backdrop-blur-md border border-zinc-800 overflow-hidden text-zinc-100">
                    {/* Header */}
                    <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                        <div>
                            <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Area Intelligence</div>
                            <h2 className="text-lg font-bold truncate">Summary View</h2>
                            <p className="text-xs text-zinc-400 font-mono">
                                {lat && lng ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : "Pan map to analyze"}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-8 text-zinc-500">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                <span className="text-sm">Analyzing view...</span>
                            </div>
                        ) : (
                            <>
                                {/* Metrics Grid */}
                                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                                    <div className="flex items-center gap-2 mb-1 text-zinc-400">
                                        <Activity className="h-4 w-4" />
                                        <span className="text-xs font-bold">Congestion</span>
                                    </div>
                                    <div className="text-2xl font-black text-red-500">
                                        {data?.avg_congestion ? `${data.avg_congestion.toFixed(0)}%` : "--"}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                                    <div className="flex items-center gap-2 mb-1 text-zinc-400">
                                        <Droplets className="h-4 w-4" />
                                        <span className="text-xs font-bold">Avg Speed</span>
                                    </div>
                                    <div className="text-2xl font-black text-blue-400">
                                        {data?.avg_speed ? `${data.avg_speed.toFixed(0)} km/h` : "--"}
                                    </div>
                                </div>

                                {/* AI Insight */}
                                <div className="p-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm space-y-2">
                                    <div className="flex items-center gap-2 font-semibold text-xs uppercase text-purple-400">
                                        <HeartPulse className="h-3 w-3" />
                                        <span>AI Health Insight</span>
                                    </div>
                                    <p className="leading-snug text-zinc-300">
                                        {data?.ai_insight || "Move the map to see real-time environmental insights."}
                                    </p>
                                </div>

                                {/* Infrastructure Count */}
                                <div className="flex items-center justify-between text-sm pt-2 border-t border-zinc-800">
                                    <span className="text-zinc-500 flex items-center gap-1">
                                        <Building2 className="h-3 w-3" /> Visible Hospitals
                                    </span>
                                    <span className="font-mono font-bold text-zinc-200">{data?.hospital_count || 0}</span>
                                </div>

                            </>
                        )}
                    </div>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
