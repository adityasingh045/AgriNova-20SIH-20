import { useState } from "react";
import { analyzeImage } from "@/lib/api";
import type { ImageAnalysisResult } from "@shared/api";
import { Button } from "@/components/ui/button";

export function ImageAnalyzer() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File) => {
    setError(null);
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      try {
        const r = await analyzeImage({
          imageData: dataUrl,
          fieldId: "field-a",
        });
        setResult(r);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm text-muted-foreground">Quick Image Analysis</p>
        <div className="space-x-2">
          <label className="inline-block">
            <input
              type="file"
              accept="image/*;capture=camera"
              className="hidden"
              onChange={(e) => e.target.files && onFile(e.target.files[0])}
            />
            <Button asChild variant="secondary">
              <span>Upload/Capture</span>
            </Button>
          </label>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="aspect-video rounded-md overflow-hidden bg-muted flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm text-muted-foreground">
              No image selected
            </span>
          )}
        </div>
        <div className="text-sm">
          {loading && <p className="text-muted-foreground">Analyzing…</p>}
          {error && <p className="text-destructive">{error}</p>}
          {result && (
            <div className="space-y-1">
              <p>
                <span className="font-medium">Health Score:</span>{" "}
                {(result.healthScore * 100).toFixed(0)}%
              </p>
              <p>
                <span className="font-medium">NDVI mean:</span>{" "}
                {result.ndviMean.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">NDRE mean:</span>{" "}
                {result.ndreMean.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Stress areas:</span>{" "}
                {result.stressAreas}
              </p>
              <p>
                <span className="font-medium">Pest risk:</span>{" "}
                {result.pestRisk}
              </p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {result.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          )}
          {!result && !loading && (
            <p className="text-muted-foreground">
              Upload a drone or field image to compute NDVI/NDRE and get a quick
              health and pest risk assessment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
