import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Cpu, FileSpreadsheet, Calendar as CalendarIcon, Download } from "lucide-react";

export default function AnalyticsPage() {
    const modelMetrics = [
        { title: "Model Accuracy", value: "94.2%", icon: TrendingUp, desc: "+2.1% from last month" },
        { title: "Algorithm", value: "Random Forest", icon: Cpu, desc: "v2.4.0 (Ensemble w/ XGBoost)" },
        { title: "Dataset Size", value: "1.2TB", icon: FileSpreadsheet, desc: "Updated 2 hours ago" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
                    <p className="text-muted-foreground">Predictive modeling performance and historical data analysis.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-9">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Jan 20, 2024 - Feb 20, 2024
                    </Button>
                    <Button className="h-9">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {modelMetrics.map((metric) => (
                    <Card key={metric.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {metric.title}
                            </CardTitle>
                            <metric.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {metric.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Trend Analysis</CardTitle>
                        <CardDescription>
                            Pollution levels vs Traffic Density (Last 7 Days)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full flex items-end justify-between px-4 pb-4 border rounded-md bg-muted/10 gap-2">
                            {/* Simulated Bar Chart */}
                            {[40, 65, 33, 87, 55, 76, 45, 60, 50, 65, 45, 70].map((h, i) => (
                                <div key={i} className="w-full bg-primary/80 rounded-t-sm hover:bg-primary transition-colors" style={{ height: `${h}%` }}>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground px-4">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Regional Comparison</CardTitle>
                        <CardDescription>
                            Metric performance across top districts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>District</TableHead>
                                    <TableHead>AQI</TableHead>
                                    <TableHead>Safety</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Downtown</TableCell>
                                    <TableCell>142</TableCell>
                                    <TableCell><Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">Good</Badge></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Westside</TableCell>
                                    <TableCell>89</TableCell>
                                    <TableCell><Badge variant="default" className="bg-red-500 hover:bg-red-600">Risk</Badge></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">North Hills</TableCell>
                                    <TableCell>45</TableCell>
                                    <TableCell><Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">Safe</Badge></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Industrial</TableCell>
                                    <TableCell>210</TableCell>
                                    <TableCell><Badge variant="secondary">Moderate</Badge></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Harbor View</TableCell>
                                    <TableCell>65</TableCell>
                                    <TableCell><Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">Safe</Badge></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
