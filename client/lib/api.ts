import type { ImageAnalysisRequest, ImageAnalysisResult, NDVITimeseries, SensorReading } from "@shared/api";

export function connectSensorStream(fieldId = "field-a", onData: (r: SensorReading) => void) {
  const url = `/api/sensors/stream?fieldId=${encodeURIComponent(fieldId)}`;
  const es = new EventSource(url);
  es.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg?.type === "sensor") onData(msg.payload as SensorReading);
    } catch (err) {
      // ignore parse errors
    }
  };
  return () => es.close();
}

export async function fetchNDVI(fieldId = "field-a"): Promise<NDVITimeseries> {
  const res = await fetch(`/api/fields/${encodeURIComponent(fieldId)}/ndvi?points=12`);
  if (!res.ok) throw new Error("Failed to fetch NDVI");
  return (await res.json()) as NDVITimeseries;
}

export async function analyzeImage(req: ImageAnalysisRequest): Promise<ImageAnalysisResult> {
  const res = await fetch("/api/images/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error("Failed to analyze image");
  return (await res.json()) as ImageAnalysisResult;
}
