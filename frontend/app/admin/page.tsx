import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Database, CheckCircle2, AlertCircle, RefreshCw, Activity, Users, ShieldAlert } from "lucide-react";

export default function AdminPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">System configuration and data management.</p>
            </div>

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
                            <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">Operational</Badge>
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

                {/* Data Ingestion */}
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
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Activity */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>System logs and audit trails.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { msg: "User 'admin' updated model params", time: "2m ago", icon: Users },
                                { msg: "Automated backup completed", time: "1h ago", icon: Database },
                                { msg: "High latency warning resolved", time: "3h ago", icon: ShieldAlert },
                                { msg: "New dataset 'traffic_v2.csv' uploaded", time: "5h ago", icon: Upload },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-muted p-2 rounded-full">
                                            <log.icon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <span className="text-sm font-medium">{log.msg}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* User Management */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Authorized Users
                        </CardTitle>
                        <CardDescription>Manage access and permissions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="flex items-center gap-2 font-medium">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/avatars/01.png" />
                                            <AvatarFallback>AD</AvatarFallback>
                                        </Avatar>
                                        Admin
                                    </TableCell>
                                    <TableCell>Super Admin</TableCell>
                                    <TableCell className="text-right"><Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">Active</Badge></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="flex items-center gap-2 font-medium">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/avatars/02.png" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        John Doe
                                    </TableCell>
                                    <TableCell>Analyst</TableCell>
                                    <TableCell className="text-right"><Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">Active</Badge></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="flex items-center gap-2 font-medium">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/avatars/03.png" />
                                            <AvatarFallback>SM</AvatarFallback>
                                        </Avatar>
                                        Sarah M.
                                    </TableCell>
                                    <TableCell>Viewer</TableCell>
                                    <TableCell className="text-right"><Badge variant="secondary">Offline</Badge></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
