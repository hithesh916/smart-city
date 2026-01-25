import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  Wind,
  Droplets,
  Zap,
  Thermometer,
} from "lucide-react";
import Link from "next/link";

export default function AreaDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const areaName = "Downtown District"; // Would come from ID fetch
  const overallScore = 78;

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/map">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{areaName}</h1>
          <p className="text-muted-foreground">Area ID: {params.id}</p>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <Badge variant={overallScore > 70 ? "default" : "destructive"} className="text-lg px-4 py-1">
            {overallScore > 70 ? "Safe" : "Attention Needed"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Overall Livability Score</CardTitle>
            <CardDescription>Composite metric based on environment, safety, and infrastructure.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={overallScore} className="h-4 w-full" />
              <span className="text-2xl font-bold">{overallScore}/100</span>
            </div>
          </CardContent>
        </Card>

        {/* Environment Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" />
              Environmental Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-muted-foreground" />
                <span>Air Quality (AQI)</span>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Moderate (85)</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-muted-foreground" />
                <span>Water Quality</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Good (92)</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trees className="w-4 h-4 text-muted-foreground" />
                {/* Note: Trees import needs to be added if not global. Used Leaf above. */}
                <span>Green Cover</span>
              </div>
              <span className="font-semibold">32%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-muted-foreground" />
                <span>Avg Temp</span>
              </div>
              <span className="font-semibold">24°C</span>
            </div>
          </CardContent>
        </Card>

        {/* Safety Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              Safety & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Crime Rate</span>
              <Badge variant="secondary">Low</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Police Response Time</span>
                <span className="font-medium">5 min</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Fire Safety Coverage</span>
                <span className="font-medium">98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="md:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Zap className="w-5 h-5" />
              AI-Driven Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Card className="bg-background shadow-sm border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Traffic Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Adjust traffic light timings at 5th & Main during rush hour to reduce congestion by 15%.</p>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-sm border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Green Space Expansion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Potential zone for new vertical garden identified at Block C to improve micro-climate.</p>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-sm border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Water Conservation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Detected localized pressure drop. Check for leaks in Sector 4 distribution network.</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper component for icon since I missed importing Trees
function Trees({ className }: { className?: string }) {
  return <Leaf className={className} />
}
