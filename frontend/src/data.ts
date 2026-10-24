import type { ConnEvent, DrainEvent, Measurement } from "./types/telemetry";

export const WARN_DEFAULT = 60;
export const CRIT_DEFAULT = 75;

// deterministic pseudo-random so demo data is stable between renders
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export const stateFor = (level: number | null, warn: number, crit: number) =>
  level === null ? "UNKNOWN" : level >= crit ? "CRITICAL" : level >= warn ? "WARNING" : "NORMAL";

/** 73 readings, one every 5 min over 6 h, ending ~12 s ago (demo only). */
export function makeMeasurements(now = Date.now()): Measurement[] {
  const r = rng(7);
  const n = 73;
  let level = 24;
  const out: Measurement[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const target = 24 + 28 * Math.pow(t, 1.05) + Math.sin(t * 9) * 3 * (1 - t * 0.6);
    level += (target - level) * 0.55 + (r() - 0.5) * 1.2;
    const tail = [50.2, 52.4, 54.8, 58, 62];
    const lv = i >= n - 5 ? tail[i - (n - 5)] : Math.round(level * 10) / 10;
    out.push({
      id: i + 1,
      timestamp: new Date(now - 12000 - (n - 1 - i) * 5 * 60000).toISOString(),
      level: lv,
      state: stateFor(lv, WARN_DEFAULT, CRIT_DEFAULT),
      sensorOk: !(i === 31 || i === 52),
      seq: 951 + i
    });
  }
  return out;
}

const ago = (min: number, now: number) => new Date(now - min * 60000).toISOString();

export function makeEvents(now = Date.now()): DrainEvent[] {
  const base: [number, DrainEvent["severity"], string, string, string][] = [
    [4, "WARNING", "Threshold", "SD-001", "Water level is approaching warning threshold (58 cm)"],
    [19, "INFO", "Threshold", "SD-001", "Water level returned to normal (52 cm)"],
    [36, "CRITICAL", "Threshold", "SD-003", "Water level exceeded critical threshold (75 cm)"],
    [51, "INFO", "Connectivity", "SD-002", "Device came back online"],
    [66, "WARNING", "Threshold", "SD-002", "Water level is approaching warning threshold (60 cm)"],
    [80, "INFO", "Data Quality", "SD-001", "Malformed data packet rejected"],
    [104, "CRITICAL", "Device Health", "SD-004", "Sensor health check failed"],
    [131, "INFO", "Connectivity", "SD-003", "Device went offline"],
    [166, "WARNING", "Threshold", "SD-001", "Water level is approaching warning threshold (48 cm)"],
    [214, "INFO", "System", "System", "Scheduled data backup completed"],
    [250, "INFO", "Threshold", "SD-001", "Water level returned to normal (44 cm)"],
    [281, "WARNING", "Threshold", "SD-003", "Water level is approaching warning threshold (61 cm)"],
    [318, "INFO", "Connectivity", "SD-004", "Device came back online"],
    [362, "INFO", "Connectivity", "SD-004", "Device went offline"],
    [401, "CRITICAL", "Threshold", "SD-002", "Water level exceeded critical threshold (76 cm)"],
    [455, "WARNING", "Threshold", "SD-001", "Water level is approaching warning threshold (55 cm)"],
    [512, "INFO", "Connectivity", "SD-001", "Device came back online"],
    [560, "INFO", "Threshold", "SD-002", "Water level returned to normal (50 cm)"],
    [640, "WARNING", "Threshold", "SD-003", "Water level is approaching warning threshold (62 cm)"],
    [721, "CRITICAL", "Device Health", "SD-002", "Battery voltage below limit"],
    [803, "INFO", "Connectivity", "SD-003", "Device went offline"],
    [902, "WARNING", "Threshold", "SD-004", "Water level is approaching warning threshold (59 cm)"],
    [1010, "INFO", "Connectivity", "SD-002", "Device reconnected"],
    [1190, "CRITICAL", "Threshold", "SD-003", "Water level exceeded critical threshold (77 cm)"]
  ];
  return base.map(([m, severity, type, device, description], i) => ({
    id: i + 1, timestamp: ago(m, now), severity, type, device, description
  }));
}

export const makeConnEvents = (now = Date.now()): ConnEvent[] => [
  { id: 1, timestamp: ago(20, now), online: true, details: "Device reconnected" },
  { id: 2, timestamp: ago(20.2, now), online: false, details: "No data received (timeout)" },
  { id: 3, timestamp: ago(209, now), online: true, details: "Device reconnected" },
  { id: 4, timestamp: ago(209.3, now), online: false, details: "No data received (timeout)" }
];

export const makeDelivery = (measurements: Measurement[]) => {
  const r = rng(21);
  return measurements.map((m, i) => ({
    timestamp: m.timestamp,
    rate: Math.round((98.5 + (r() - 0.5) * 2 - (i === 34 ? 3 : 0)) * 10) / 10,
    online: !(i === 42 || i === 66)
  }));
};
