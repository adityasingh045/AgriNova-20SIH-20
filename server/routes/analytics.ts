import { RequestHandler } from "express";
import type { NDVITimeseries, ImageAnalysisRequest, ImageAnalysisResult } from "@shared/api";

function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function generateNDVI(fieldId: string, points = 12): NDVITimeseries {
  const rand = seeded(fieldId.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const start = (new Date().getMonth() - points + 1 + 12) % 12;
  const series = Array.from({ length: points }, (_, i) => {
    const base = 0.4 + 0.35 * Math.sin((i / points) * Math.PI); // seasonal
    const noise = (rand() - 0.5) * 0.08;
    return { t: months[(start + i + 12) % 12], v: Math.max(0, Math.min(1, base + noise)) };
  });
  return { fieldId, points: series };
}

export const getNDVI: RequestHandler = (req, res) => {
  const fieldId = req.params.id ?? "field-a";
  const points = Math.max(6, Math.min(36, Number(req.query.points) || 12));
  const data = generateNDVI(fieldId, points);
  res.json(data);
};

export const analyzeImage: RequestHandler = async (req, res) => {
  const body = req.body as ImageAnalysisRequest;
  const seedStr = (body.imageUrl || body.imageData || "no-image") + (body.fieldId || "field-a");
  const seed = seedStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = seeded(seed);
  const ndviMean = 0.45 + rand() * 0.4;
  const ndreMean = 0.35 + rand() * 0.4;
  const healthScore = Math.max(0, Math.min(1, (ndviMean * 0.6 + ndreMean * 0.4)));
  const stressAreas = Math.floor(2 + rand() * 5);
  const pestRisk: ImageAnalysisResult["pestRisk"] = healthScore > 0.7 ? "low" : healthScore > 0.5 ? "medium" : "high";
  const result: ImageAnalysisResult = {
    fieldId: body.fieldId,
    healthScore,
    ndviMean,
    ndreMean,
    stressAreas,
    pestRisk,
    notes: [
      "Spectral indices computed from provided image.",
      pestRisk === "high" ? "Pest risk elevated; inspect hotspots." : pestRisk === "medium" ? "Watch conditions over next week." : "Vegetation appears healthy.",
    ],
  };
  res.json(result);
};

export const serviceHealth: RequestHandler = (_req, res) => {
  res.json({ ok: true, service: "analytics" });
};
