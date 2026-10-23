import type { DrainState } from "../types/telemetry";

/** Vertical tank gauge: fill height = water level, with dashed warning / critical marks. */
export function TankGauge({
  level, warn, crit, state, max = 100, height = 220
}: { level: number | null; warn: number; crit: number; state: DrainState; max?: number; height?: number }) {
  const w = 90, top = 8, h = height - 16;
  const y = (cm: number) => top + h - (Math.min(Math.max(cm, 0), max) / max) * h;
  const fill = state === "CRITICAL" ? "#e5354a" : state === "WARNING" ? "#f5a623" : state === "UNKNOWN" ? "#98a2b3" : "#1f6fff";
  return (
    <svg width={w + 60} height={height} role="img" aria-label={level === null ? "Water level unavailable" : `Water level ${level} cm`}>
      <rect x={10} y={top} width={w} height={h} rx={8} fill="#f5f8fc" stroke="#e5eaf2" strokeWidth={2} />
      {level !== null && (
        <rect x={12} y={y(level)} width={w - 4} height={top + h - y(level) - 2} rx={6} fill={fill} fillOpacity={0.35} stroke={fill} strokeWidth={1.5} />
      )}
      <line x1={10} x2={10 + w} y1={y(crit)} y2={y(crit)} stroke="#e5354a" strokeDasharray="6 5" />
      <line x1={10} x2={10 + w} y1={y(warn)} y2={y(warn)} stroke="#f5a623" strokeDasharray="6 5" />
      <text x={10 + w + 6} y={y(crit) + 4} fontSize={12} fill="#e5354a">{crit}</text>
      <text x={10 + w + 6} y={y(warn) + 4} fontSize={12} fill="#e08a00">{warn}</text>
      {level !== null && (
        <text x={10 + w / 2} y={Math.min(y(level) + 18, top + h - 6)} textAnchor="middle" fontSize={14} fontWeight={700} fill="#1b2a41">{level} cm</text>
      )}
    </svg>
  );
}
