import { AlertTriangle } from "lucide-react";
import type { DrainState, Severity } from "../types/telemetry";

export function Dot({ s }: { s: DrainState | Severity | "ok" | "bad" }) {
  const c = s === "NORMAL" ? "blue" : s === "WARNING" ? "orange" : s === "CRITICAL" || s === "bad" ? "red" : s === "ok" ? "green" : "gray";
  return <i className={`dot ${c}`} />;
}
export function StatusBadge({ kind, children }: { kind: string; children: React.ReactNode }) {
  return <span className={`pill ${kind}`}>{children}</span>;
}
export function Banner({ state, online }: { state: DrainState; online: boolean }) {
  if (!online) return <div className="banner unknown" role="status"><AlertTriangle size={44} /><div><b>DEVICE OFFLINE</b><p>No current data. The last known reading may be out of date.</p></div></div>;
  const text = {
    NORMAL: ["NORMAL", "Water level is within the normal range."],
    WARNING: ["WARNING", "Water level is approaching the critical threshold."],
    CRITICAL: ["CRITICAL", "Water level has exceeded the critical threshold."],
    UNKNOWN: ["UNKNOWN", "Sensor reading is invalid or unavailable."]
  }[state];
  return <div className={`banner ${state.toLowerCase()}`} role={state === "CRITICAL" ? "alert" : "status"}><AlertTriangle size={44} /><div><b>{text[0]}</b><p>{text[1]}</p></div></div>;
}
