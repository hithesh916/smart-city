import Link from "next/link";
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
} from "lucide-react";

export default function Home() {
  const metrics = [
    {
      title: "Air Pollution",
      value: "AQI 142",
      status: "Moderate Risk",
      description: "PM2.5 levels are higher than average today.",
      icon: Activity,
      color: "text-yellow-500",
    },
    {
      title: "Water Quality",
      value: "Safe",
      status: "Optimal",
      description: "Drinking water quality is within safe limits.",
      icon: Droplets,
      color: "text-blue-500",
    },
    {
      title: "Traffic Congestion",
      value: "High",
      status: "Delays Exp.",
      description: "Heavy traffic on Main St and 5th Ave.",
      icon: Car,
      color: "text-red-500",
    },
    {
      title: "Crime Rate",
      value: "Low",
      status: "Safe",
      description: "No major incidents reported in the last 24h.",
      icon: AlertTriangle,
      color: "text-green-500",
    },
    {
      title: "Medical Facilities",
      value: "98% Avail",
      status: "Good",
      description: "Hospital beds and ER capacity normal.",
      icon: Stethoscope,
      color: "text-emerald-500",
    },
    {
      title: "Parks & Open Land",
      value: "24",
      status: "Active",
      description: "Public parks open. Maintenance ongoing in Central Park.",
      icon: Trees,
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          City Overview
        </h1>
        <p className="text-xl text-muted-foreground">
          Real-time insights for a smarter, safer, and efficient city.
        </p>
        <div className="flex items-center space-x-4">
          <Button asChild size="lg">
            <Link href="/map">
              Explore City Map <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/analytics">View Analytics</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon
                className={`h-4 w-4 text-muted-foreground ${metric.color}`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={metric.color + " font-medium"}>
                  {metric.status}
                </span>{" "}
                - {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
