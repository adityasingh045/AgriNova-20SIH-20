import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { ingestReading, getLatestReading, streamReadings, health as sensorsHealth } from "./routes/sensors";
import { getNDVI, analyzeImage, serviceHealth as analyticsHealth } from "./routes/analytics";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));

  // Health
  app.get("/api/health", (_req, res) => res.json({ ok: true, service: "api" }));
  app.get("/api/health/sensors", sensorsHealth);
  app.get("/api/health/analytics", analyticsHealth);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Sensors
  app.post("/api/sensors/ingest", ingestReading);
  app.get("/api/sensors/latest", getLatestReading);
  app.get("/api/sensors/stream", streamReadings);

  // Analytics
  app.get("/api/fields/:id/ndvi", getNDVI);
  app.post("/api/images/analyze", analyzeImage);

  return app;
}
