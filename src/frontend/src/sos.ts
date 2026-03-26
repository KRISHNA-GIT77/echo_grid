import type { Severity } from "./backend";

export interface SosRequest {
  id: string;
  latitude: number;
  longitude: number;
  severity: Severity;
  description: string;
  timestamp: number;
}

