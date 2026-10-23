import type { Dispatch, SetStateAction } from "react";

export type Page = "Dashboard" | "History" | "Events" | "Device Status" | "Threshold Settings";
export type DrainState = "NORMAL" | "WARNING" | "CRITICAL" | "UNKNOWN";
export type Severity = "INFO" | "WARNING" | "CRITICAL";
export interface ConfigChange { id: number; timestamp: string; parameter: string; oldValue: string; newValue: string; by: string }

export interface Measurement {
  id: number;
  timestamp: string;
  level: number | null;
  state: DrainState;
  sensorOk: boolean;
  seq: number;
}
export interface DrainEvent {
  id: number;
  timestamp: string;
  severity: Severity;
  type: string;
  device: string;
  description: string;
}
export interface Thresholds {
  warning: number;
  critical: number;
  offlineTimeout: number;
  trendEnabled: boolean;
}
export interface StatusResponse {
  device_id: string;
  level_cm: number | null;
  state: DrainState;
  online: boolean;
  last_seen_at: string;
  thresholds?: { warning_cm: number; critical_cm: number };
  trend?: { rate_cm_per_min: number; eta_to_critical_sec: number | null };
}

export interface ConnEvent { id: number; timestamp: string; online: boolean; details: string }

/** Everything App computes once and hands to each page. */
export interface Ctx {
  level: number | null;
  warn: number;
  crit: number;
  state: DrainState;
  online: boolean;
  lastTs: string;
  delta: number | null;
  eta: number | null;
  measurements: Measurement[];
  events: DrainEvent[];
  connEvents: ConnEvent[];
  now: Date;
  saved: Thresholds;
  setSaved: Dispatch<SetStateAction<Thresholds>>;
  changes: ConfigChange[];
  setChanges: Dispatch<SetStateAction<ConfigChange[]>>;
  refresh: () => void;
  isLive: boolean;
  setPage: (page: Page) => void;
  apiNote: string | null;
}
