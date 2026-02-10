"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Database, CheckCircle2, AlertCircle, RefreshCw, Activity, Users, ShieldAlert, Search, Calendar, Filter, FileText, Lock } from "lucide-react";

// Mock Data Generators
const generateLogs = () => {
    const logs = [];
    const actions = ["System Startup", "Data Ingestion", "Model Retraining", "API Request", "Database Backup", "User Login", "Alert Triggered"];
    const levels = ["INFO", "SUCCESS", "WARNING", "ERROR"];
    const modules = ["Core", "Auth", "TrafficAI", "EnvironmentSensors", "Database", "API Gateway"];

    for (let i = 0; i < 50; i++) {
        const date = new Date();
        date.setHours(date.getHours() - i);
        logs.push({
            id: `LOG-${1000 + i}`,
            timestamp: date.toISOString(),
            level: levels[Math.floor(Math.random() * levels.length)],
            module: modules[Math.floor(Math.random() * modules.length)],
            message: `${actions[Math.floor(Math.random() * actions.length)]} - ${Math.random() > 0.5 ? "Operation completed successfully" : "Latency observed"}`,
        });
    }
    return logs;
};

const generateLogins = () => {
    const logins = [];
    const users = [
        { name: "Admin User", email: "admin@smartcity.gov", role: "Super Admin", img: "/avatars/01.png" },
        { name: "John Doe", email: "john.d@smartcity.gov", role: "Analyst", img: "/avatars/02.png" },
        { name: "Sarah Connor", email: "sarah.c@smartcity.gov", role: "Viewer", img: "/avatars/03.png" }
    ];
    const status = ["Success", "Success", "Failed", "Success"];

    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(Math.random() * 24);
        const user = users[Math.floor(Math.random() * users.length)];
        logins.push({
            id: `AUTH-${5000 + i}`,
            timestamp: date.toISOString(),
            user: user,
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            status: status[Math.floor(Math.random() * status.length)],
            location: "Chennai, India"
        });
    }
    return logins;
};

const MOCK_LOGS = generateLogs();
const MOCK_LOGINS = generateLogins();

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "logs" | "logins">("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterLevel, setFilterLevel] = useState("ALL");
    const [dateStart, setDateStart] = useState("");

    // Filter Logic
    const filteredLogs = MOCK_LOGS.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || log.module.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = filterLevel === "ALL" || log.level === filterLevel;
        const matchesDate = !dateStart || new Date(log.timestamp) >= new Date(dateStart);
        return matchesSearch && matchesLevel && matchesDate;
    });

    const filteredLogins = MOCK_LOGINS.filter(login => {
        const matchesSearch = login.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || login.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = !dateStart || new Date(login.timestamp) >= new Date(dateStart);
        return matchesSearch && matchesDate;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">System configuration, logs, and audit trails.</p>
                </div>
                <div className="flex bg-muted p-1 rounded-lg">
                    {[
                        { id: "overview", label: "Overview", icon: Activity },
                        { id: "logs", label: "System Logs", icon: FileText },
                        { id: "logins", label: "Login History", icon: Lock },
                    ].map((tab) => (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? "secondary" : "ghost"}
                            className={`flex items-center gap-2 ${activeTab === tab.id ? "bg-background shadow-sm" : ""}`}
                            onClick={() => setActiveTab(tab.id as any)}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* System Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                System Status
                            </CardTitle>
                            <CardDescription>Real-time pipeline monitoring.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-md">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="font-medium">Data Pipeline</span>
                                </div>
                                <Badge variant="outline" className="border-green-500 text-green-600">Operational</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-md">
                                <div className="flex items-center gap-3">
                                    <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                                    <span className="font-medium">Model Retraining</span>
                                </div>
                                <Badge variant="secondary">Processing (84%)</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-md">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                    <span className="font-medium">API Latency</span>
                                </div>
                                <span className="text-sm font-mono text-muted-foreground">124ms</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Data Ingestion
                            </CardTitle>
                            <CardDescription>Upload new sensor data sets (CSV/JSON).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid w-full max-w-sm items-center gap-2">
                                <Label htmlFor="dataset">Dataset File</Label>
                                <Input id="dataset" type="file" className="cursor-pointer" />
                            </div>
                            <div className="pt-2">
                                <Button className="w-full sm:w-auto">
                                    <Upload className="mr-2 h-4 w-4" /> Upload Dataset
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users Summary */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Active Personnel
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-6">
                                <div className="flex -space-x-4">
                                    <Avatar className="border-2 border-background"><AvatarImage src="/avatars/01.png" /><AvatarFallback>AD</AvatarFallback></Avatar>
                                    <Avatar className="border-2 border-background"><AvatarImage src="/avatars/02.png" /><AvatarFallback>JD</AvatarFallback></Avatar>
                                    <Avatar className="border-2 border-background"><AvatarImage src="/avatars/03.png" /><AvatarFallback>SC</AvatarFallback></Avatar>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted font-medium text-xs">+5</div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-bold text-foreground">8 users</span> currently active in the dashboard.
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* SYSTEM LOGS TAB */}
            {activeTab === "logs" && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>System Logs</CardTitle>
                                <CardDescription>Comprehensive event log for debugging and audit.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-md">
                                <Search className="h-4 w-4 ml-2 text-muted-foreground" />
                                <Input
                                    placeholder="Search logs..."
                                    className="border-none bg-transparent focus-visible:ring-0 w-48"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <select
                                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                    value={filterLevel}
                                    onChange={(e) => setFilterLevel(e.target.value)}
                                >
                                    <option value="ALL">All Levels</option>
                                    <option value="INFO">Info</option>
                                    <option value="WARNING">Warning</option>
                                    <option value="ERROR">Error</option>
                                    <option value="SUCCESS">Success</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="date"
                                    className="w-auto h-9"
                                    value={dateStart}
                                    onChange={(e) => setDateStart(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Logs Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[180px]">Timestamp</TableHead>
                                        <TableHead className="w-[100px]">Level</TableHead>
                                        <TableHead>Module</TableHead>
                                        <TableHead>Message</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`
                                                    ${log.level === 'ERROR' ? 'border-red-500 text-red-500' :
                                                        log.level === 'WARNING' ? 'border-yellow-500 text-yellow-500' :
                                                            log.level === 'SUCCESS' ? 'border-green-500 text-green-500' : 'text-zinc-500'}
                                                `}>
                                                    {log.level}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium text-xs">{log.module}</TableCell>
                                            <TableCell className="text-sm">{log.message}</TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredLogs.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                No logs found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* LOGIN HISTORY TAB */}
            {activeTab === "logins" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Login Audit</CardTitle>
                        <CardDescription>Authentication history and access tracking.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-md">
                                <Search className="h-4 w-4 ml-2 text-muted-foreground" />
                                <Input
                                    placeholder="Search user..."
                                    className="border-none bg-transparent focus-visible:ring-0 w-48"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="date"
                                    className="w-auto h-9"
                                    value={dateStart}
                                    onChange={(e) => setDateStart(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Timestamp</TableHead>
                                        <TableHead>IP Address</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLogins.map((login) => (
                                        <TableRow key={login.id}>
                                            <TableCell className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={login.user.img} />
                                                    <AvatarFallback>{login.user.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{login.user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{login.user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{login.user.role}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(login.timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">{login.ip}</TableCell>
                                            <TableCell>
                                                <Badge variant={login.status === 'Success' ? 'secondary' : 'destructive'}>
                                                    {login.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Icon Helper
function Download({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
    )
}
