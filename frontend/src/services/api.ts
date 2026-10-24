import type { DrainState, Measurement, StatusResponse } from "../types/telemetry";

const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
export const deviceId = import.meta.env.VITE_DEVICE_ID || "esp32-001";
export const apiConfigured = Boolean(base);

const REQUEST_TIMEOUT_MS = 4000;

/** The contract names the "no trustworthy measurement" state NO_DATA; the UI shows it as UNKNOWN. */
function toDrainState(value: unknown): DrainState {
  switch (value) {
    case "NORMAL": case "WARNING": case "CRITICAL": return value;
    default: return "UNKNOWN"; // NO_DATA or anything the UI does not recognise
  }
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isFiniteNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** Runtime check of GET /api/v1/status — TypeScript types alone cannot vouch for live JSON. */
export function parseStatus(raw: unknown): StatusResponse {
  if (!isRecord(raw)) throw new Error("Status response is not a JSON object.");
  if (typeof raw.online !== "boolean") throw new Error("Status response is missing a boolean 'online' field.");
  if (typeof raw.last_seen_at !== "string" || Number.isNaN(Date.parse(raw.last_seen_at)))
    throw new Error("Status response has no valid 'last_seen_at' timestamp.");
  if (raw.level_cm !== null && raw.level_cm !== undefined && !isFiniteNumber(raw.level_cm))
    throw new Error("Status response has a non-numeric 'level_cm'.");

  const out: StatusResponse = {
    device_id: typeof raw.device_id === "string" ? raw.device_id : deviceId,
    level_cm: isFiniteNumber(raw.level_cm) ? raw.level_cm : null,
    state: toDrainState(raw.state),
    online: raw.online,
    last_seen_at: raw.last_seen_at
  };
  const t = raw.thresholds;
  if (isRecord(t) && isFiniteNumber(t.warning_cm) && isFiniteNumber(t.critical_cm) && t.warning_cm > 0 && t.critical_cm > t.warning_cm)
    out.thresholds = { warning_cm: t.warning_cm, critical_cm: t.critical_cm };
  const tr = raw.trend;
  if (isRecord(tr) && isFiniteNumber(tr.rate_cm_per_min))
    out.trend = { rate_cm_per_min: tr.rate_cm_per_min, eta_to_critical_sec: isFiniteNumber(tr.eta_to_critical_sec) ? tr.eta_to_critical_sec : null };
  return out;
}

export async function fetchLiveStatus(): Promise<StatusResponse> {
  if (!base) throw new Error("API base URL is not configured.");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${base}/api/v1/status?device_id=${encodeURIComponent(deviceId)}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Status endpoint returned HTTP ${response.status}.`);
    return parseStatus(await response.json());
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw new Error("Status request timed out.");
    if (e instanceof SyntaxError) throw new Error("Status response is not valid JSON.");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export function toCsv(rows: Measurement[]): string {
  const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [
    ["Timestamp", "Water Level (cm)", "State", "Sensor OK", "Sequence"].map(escape).join(","),
    ...rows.map(r => [r.timestamp, r.level, r.state, r.sensorOk, r.seq].map(escape).join(","))
  ].join("\r\n");
}
