import { RequestHandler } from "express";
import type { SensorReading } from "@shared/api";

// In-memory store (per-process)
const readings: SensorReading[] = [];

function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export const ingestReading: RequestHandler = (req, res) => {
  const body = req.body as Partial<SensorReading>;
  if (!body.sensorId || !body.fieldId || typeof body.moistureKpa !== "number") {
    return res
      .status(400)
      .json({ error: "sensorId, fieldId and moistureKpa are required" });
  }
  const reading: SensorReading = {
    sensorId: body.sensorId,
    fieldId: body.fieldId,
    timestamp: body.timestamp ?? Date.now(),
    moistureKpa: body.moistureKpa,
    temperatureC:
      typeof body.temperatureC === "number" ? body.temperatureC : 22,
    humidityPct: typeof body.humidityPct === "number" ? body.humidityPct : 55,
  };
  readings.push(reading);
  res.json({ ok: true });
};

export const getLatestReading: RequestHandler = (req, res) => {
  const fieldId = (req.query.fieldId as string) ?? "field-a";
  const latest = [...readings].reverse().find((r) => r.fieldId === fieldId);
  if (!latest) return res.json({});
  res.json(latest);
};

export const streamReadings: RequestHandler = (req, res) => {
  const fieldId = (req.query.fieldId as string) ?? "field-a";

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  // Start with a baseline using seeded randomness per field
  const rand = seeded(
    fieldId.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
  );
  let last: SensorReading = {
    sensorId: `sensor-${fieldId}-1`,
    fieldId,
    timestamp: Date.now(),
    moistureKpa: 18 + rand() * 15, // 15..33
    temperatureC: 18 + rand() * 12,
    humidityPct: 40 + rand() * 30,
  };

  const write = (data: unknown) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send data periodically
  const interval = setInterval(() => {
    // small drift
    last = {
      ...last,
      timestamp: Date.now(),
      moistureKpa: clamp(last.moistureKpa + (rand() - 0.5) * 2, 10, 60),
      temperatureC: clamp(last.temperatureC + (rand() - 0.5) * 0.6, -10, 50),
      humidityPct: clamp(last.humidityPct + (rand() - 0.5) * 1.5, 10, 100),
    };
    readings.push(last);
    write({ type: "sensor", payload: last });
  }, 1000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
};

export const health: RequestHandler = (_req, res) => {
  res.json({ ok: true, service: "sensors", count: readings.length });
};
