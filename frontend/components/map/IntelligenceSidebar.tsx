"use client";

import { Card } from "@/components/ui/card";
import { Loader2, Shield, Cloud, Activity, MapPin, History, Navigation } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function IntelligenceSidebar({
    data,
    loading,
    history,
    onSelectHistory
}: {
    data: any,
    loading: boolean,
    history: any[],
    onSelectHistory: (item: any) => void
}) {

    return (
        <div className="h-full w-full bg-zinc-950 border-l border-zinc-800 flex flex-col">
            {/* Header */}
            <div className="p-3 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Live Signal</span>
                </div>
                <h2 className="text-base font-bold text-white truncate" title={data?.location?.address}>
                    {data?.location?.address ? data.location.address.split(",")[0] : (data?.location?.lat ? `Loc: ${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}` : "Area Intelligence")}
                </h2>
                <p className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">
                    {data?.location?.address || (data?.location?.lat ? `${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}` : "Select a location")}
                </p>
            </div>

            <ScrollArea className="flex-1 p-3 space-y-4">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 pt-20">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p className="text-xs">Analyzing Street Data...</p>
                    </div>
                ) : !data ? (
                    <div className="text-center text-zinc-500 pt-20">
                        <Navigation className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-xs">Click on the map to scan<br />a specific street.</p>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">

                        {/* STREET VIEW BUTTON */}
                        <Button
                            variant="outline"
                            className="w-full h-8 text-xs bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-blue-400"
                            onClick={() => window.open(`https://www.google.com/maps?layer=c&cbll=${data.location.lat},${data.location.lng}`, '_blank')}
                        >
                            <MapPin className="h-3 w-3 mr-2" /> Open Street View
                        </Button>

                        {/* VERDICT SECTION (PROS & CONS) */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-emerald-950/30 border border-emerald-900/50 p-2 rounded">
                                <h4 className="text-[10px] font-bold text-emerald-400 uppercase mb-1">The Good</h4>
                                <ul className="text-[9px] text-emerald-100/80 space-y-1 list-disc pl-3">
                                    {data.verdict?.pros?.length > 0 ? data.verdict.pros.map((p: string, i: number) => (
                                        <li key={i}>{p}</li>
                                    )) : <li>No major pros detected</li>}
                                </ul>
                            </div>
                            <div className="bg-red-950/30 border border-red-900/50 p-2 rounded">
                                <h4 className="text-[10px] font-bold text-red-400 uppercase mb-1">The Bad</h4>
                                <ul className="text-[9px] text-red-100/80 space-y-1 list-disc pl-3">
                                    {data.verdict?.cons?.length > 0 ? data.verdict.cons.map((c: string, i: number) => (
                                        <li key={i}>{c}</li>
                                    )) : <li>No major issues</li>}
                                </ul>
                            </div>
                        </div>

                        {/* TOP ROW: Safety & Environment */}
                        <div className="grid grid-cols-2 gap-2">
                            <Card className="p-3 bg-zinc-900/80 border-zinc-800 flex flex-col justify-center items-center text-center">
                                <div className="text-pink-500 mb-1"><Shield className="h-5 w-5" /></div>
                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Safety</div>
                                <div className="text-2xl font-black text-white leading-none mt-1">{data.safety?.score}</div>
                                <div className={`text-[10px] font-bold ${data.safety?.score > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {data.safety?.rating}
                                </div>
                            </Card>

                            <Card className="p-3 bg-zinc-900/80 border-zinc-800 space-y-2">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Cloud className="h-4 w-4 text-sky-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Env</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-zinc-500">AQI</span>
                                        <span className={`font-mono font-bold ${data.environment?.aqi?.value > 150 ? "text-red-400" : "text-emerald-400"}`}>
                                            {data.environment?.aqi?.value}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-zinc-500">Noise</span>
                                        <span className={`font-mono font-bold ${parseInt(data.environment?.noise?.value) > 70 ? "text-amber-400" : "text-emerald-400"}`}>
                                            {data.environment?.noise?.value}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-zinc-500">Temp</span>
                                        <span className="text-zinc-300 font-mono">{data.environment?.weather?.temp}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* MIDDLE ROW: Transport & Vital Stats */}
                        <Card className="p-3 bg-zinc-900/80 border-zinc-800 space-y-2">
                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="h-3 w-3" /> Urban Pulse
                            </h3>
                            <div className="grid grid-cols-4 gap-2 text-center divide-x divide-zinc-800">
                                <div>
                                    <span className="block text-[9px] text-zinc-500 uppercase">Traffic</span>
                                    <span className={`font-black text-sm ${data.traffic?.congestion > 40 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {data.traffic?.congestion?.toFixed(0)}%
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[9px] text-zinc-500 uppercase">Crime</span>
                                    <span className="font-black text-sm text-rose-500">{data.safety?.crime_rate}</span>
                                </div>
                                <div>
                                    <span className="block text-[9px] text-zinc-500 uppercase">Transit</span>
                                    <span className="font-black text-sm text-blue-400">{data.nearby?.transport_score || 85}</span>
                                </div>
                                <div>
                                    <span className="block text-[9px] text-zinc-500 uppercase">Parking</span>
                                    <span className="font-black text-sm text-purple-400">{data.nearby?.parking_score || 50}%</span>
                                </div>
                            </div>
                        </Card>

                        {/* BOTTOM ROW: Tiny Labels for Amenities */}
                        <div>
                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Nearby Access</h3>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-zinc-900 border border-zinc-800 p-2 rounded text-center">
                                    <div className="text-lg font-bold text-white leading-none">{data.nearby?.hospitals}</div>
                                    <div className="text-[9px] text-zinc-500 uppercase">Medical</div>
                                </div>
                                <div className="flex-1 bg-zinc-900 border border-zinc-800 p-2 rounded text-center">
                                    <div className="text-lg font-bold text-white leading-none">{data.nearby?.parks}</div>
                                    <div className="text-[9px] text-zinc-500 uppercase">Parks</div>
                                </div>
                                <div className="flex-1 bg-zinc-900 border border-zinc-800 p-2 rounded text-center">
                                    <div className="text-lg font-bold text-white leading-none">{data.nearby?.malls}</div>
                                    <div className="text-[9px] text-zinc-500 uppercase">Shops</div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* HISTORY SECTION */}
                {history.length > 0 && (
                    <div className="pt-6 border-t border-zinc-800">
                        <h3 className="text-sm font-bold text-zinc-300 uppercase flex items-center gap-2 mb-3">
                            <History className="h-4 w-4" /> Recent Scans
                        </h3>
                        <div className="space-y-2">
                            {history.map((item, idx) => (
                                <Button
                                    key={idx}
                                    variant="ghost"
                                    className="w-full justify-start h-auto py-2 px-3 text-left bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                                    onClick={() => onSelectHistory(item)}
                                >
                                    <MapPin className="h-4 w-4 mr-2 text-zinc-500 shrink-0" />
                                    <div className="overflow-hidden">
                                        <div className="text-xs font-bold text-zinc-300 truncate">
                                            {item.location?.address?.split(",")[0] || "Unknown Location"}
                                        </div>
                                        <div className="text-[10px] text-zinc-500 font-mono truncate">
                                            {item.safety?.score ? `Safety: ${item.safety.score}` : "Scanned"}
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

            </ScrollArea>
        </div>
    );
}
