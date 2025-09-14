/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface SensorReading {
  sensorId: string;
  fieldId: string;
  timestamp: number; // epoch ms
  moistureKpa: number; // soil tension (kPa)
  temperatureC: number;
  humidityPct: number;
}

export interface NDVIPoint {
  t: string; // label or ISO date
  v: number; // 0..1
}

export interface NDVITimeseries {
  fieldId: string;
  points: NDVIPoint[];
}

export interface ImageAnalysisRequest {
  imageUrl?: string;
  imageData?: string; // base64 data URL
  fieldId?: string;
}

export interface ImageAnalysisResult {
  fieldId?: string;
  healthScore: number; // 0..1
  ndviMean: number;
  ndreMean: number;
  stressAreas: number; // count of clusters
  pestRisk: "low" | "medium" | "high";
  notes: string[];
}
