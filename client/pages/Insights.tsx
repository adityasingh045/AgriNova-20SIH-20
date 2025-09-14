import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Insights() {
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_10%_10%,hsl(var(--primary)/0.15),transparent_70%),radial-gradient(50%_50%_at_90%_20%,hsl(var(--accent)/0.15),transparent_70%)]" />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Insights</h1>
          <p className="text-muted-foreground">This page will showcase deep analytics: NDVI/NDRE trends, soil moisture maps, pest risk forecasts, and sensor telemetry. Ask to expand it when you are ready.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
            <a href="#contact"><Button variant="outline">Request a Feature</Button></a>
          </div>
        </div>
      </div>
    </section>
  );
}
