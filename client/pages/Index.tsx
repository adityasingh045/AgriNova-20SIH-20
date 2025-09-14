import { useEffect, useState, useMemo } from "react";
import { DemoResponse, NDVITimeseries, SensorReading } from "@shared/api";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Leaf,
  LineChart as LineChartIcon,
  Radar,
  Droplets,
  Bug,
  Satellite,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart as RAreaChart,
} from "recharts";
import { connectSensorStream, fetchNDVI } from "@/lib/api";
import { ImageAnalyzer } from "@/components/ImageAnalyzer";

export default function Index() {
  const [exampleFromServer, setExampleFromServer] = useState("");
  useEffect(() => {
    fetchDemo();
  }, []);
  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = (await response.json()) as DemoResponse;
      setExampleFromServer(data.message);
    } catch (error) {
      console.error("Error fetching hello:", error);
    }
  };

  const [ndvi, setNdvi] = useState<NDVITimeseries | null>(null);
  const [moisture, setMoisture] = useState<{ t: number; v: number }[]>([]);

  useEffect(() => {
    // NDVI
    fetchNDVI("field-a").then(setNdvi).catch(console.error);

    // Live sensor stream
    const disconnect = connectSensorStream("field-a", (r: SensorReading) => {
      setMoisture((prev) => {
        const next = [...prev, { t: r.timestamp, v: r.moistureKpa }];
        // keep last 30 points
        return next.slice(Math.max(0, next.length - 30));
      });
    });
    return disconnect;
  }, []);

  const ndviData = ndvi?.points ?? [];
  const moistureData = useMemo(() => {
    if (moisture.length === 0) return [] as { t: number; v: number }[];
    const base = moisture[0]?.t ?? Date.now();
    // Normalize timestamps to seconds since base for chart readability
    return moisture.map((m) => ({
      t: Math.round((m.t - base) / 1000),
      v: m.v,
    }));
  }, [moisture]);

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_10%_10%,hsl(var(--primary)/0.12),transparent_70%),radial-gradient(50%_50%_at_90%_20%,hsl(var(--accent)/0.12),transparent_70%)]" />
      <section className="container mx-auto px-4 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground bg-background/60 backdrop-blur">
              <Leaf className="size-3 text-primary" />
              Multispectral + Sensors
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              AI-powered crop, soil, and pest monitoring
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Fuse satellite, drone and in-field sensor data to detect stress
              early, optimize irrigation and nutrition, and forecast pest risks
              with explainable AI.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#contact">
                <Button className="gap-2">
                  <Activity className="size-4" /> Request Demo
                </Button>
              </a>
              <a href="/insights">
                <Button variant="outline" className="gap-2">
                  <LineChartIcon className="size-4" /> Explore Insights
                </Button>
              </a>
            </div>
            <p className="sr-only">{exampleFromServer}</p>
          </div>
          <div className="grid gap-6">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <p className="text-sm text-muted-foreground">NDVI Trend</p>
                  <p className="text-2xl font-bold">Field A • 2025</p>
                </div>
                <div className="rounded-md bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 px-2 py-1 text-xs font-semibold">
                  Healthy
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RLineChart
                    data={ndviData}
                    margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="t"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      domain={[0, 1]}
                      ticks={[0, 0.25, 0.5, 0.75, 1]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary)/0.2)"
                    />
                    <Line
                      type="monotone"
                      dataKey="v"
                      strokeWidth={2.5}
                      stroke="hsl(var(--primary))"
                      dot={false}
                    />
                  </RLineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-sm text-muted-foreground">Soil Moisture</p>
                  <span className="rounded-md bg-cyan-600/10 text-cyan-700 dark:text-cyan-300 px-2 py-1 text-xs font-semibold">
                    kPa
                  </span>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <RAreaChart
                      data={moistureData}
                      margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                    >
                      <XAxis dataKey="t" hide />
                      <YAxis hide />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="hsl(var(--accent))"
                        fill="hsl(var(--accent)/0.2)"
                      />
                    </RAreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-sm text-muted-foreground">
                    Pest Risk • 7d
                  </p>
                  <span className="rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-1 text-xs font-semibold">
                    Low
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-sm"
                      style={{
                        background: `hsl(var(--primary)/${0.1 + (i % 5) / 10})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-4 gap-6">
          <Feature
            icon={<Radar className="size-5" />}
            title="Crop Health Index"
            desc="NDVI, NDRE and custom spectral indices detect stress before it’s visible."
          />
          <Feature
            icon={<Droplets className="size-5" />}
            title="Soil & Irrigation"
            desc="Moisture and salinity from probes and weather for precision irrigation."
          />
          <Feature
            icon={<Bug className="size-5" />}
            title="Pest Forecasts"
            desc="Risk models fuse climate and imagery to predict outbreaks up to 14 days."
          />
          <Feature
            icon={<Satellite className="size-5" />}
            title="Any Data Source"
            desc="Satellites, drones, tractors and IoT sensors unify into one platform."
          />
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4 rounded-2xl border p-6 md:p-10 bg-card">
            <h2 className="text-2xl md:text-3xl font-bold">
              Explainable AI that farmers trust
            </h2>
            <p className="text-muted-foreground">
              Every alert includes the spectral drivers, sensor corroboration,
              and recommended actions. Users can trace back to raw tiles and
              telemetry for full transparency.
            </p>
            <div className="flex gap-3">
              <a href="#contact">
                <Button>Talk to sales</Button>
              </a>
              <a href="/insights">
                <Button variant="outline">See examples</Button>
              </a>
            </div>
          </div>
          <ImageAnalyzer />
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3 text-primary">
        <div className="grid size-9 place-items-center rounded-md bg-primary/10">
          {icon}
        </div>
        <p className="font-semibold">{title}</p>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
