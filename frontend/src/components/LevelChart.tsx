import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Measurement } from "../types/telemetry";
import { tipProps, xTick } from "../format";

export function LevelChart({ data, warn, crit, height = 330 }: { data: Measurement[]; warn: number; crit: number; height?: number }) {
  const d = data.map(m => ({ t: m.timestamp, level: m.level }));
  if (!d.length) return <div className="chart-empty" style={{ height }}>No readings in the selected range.</div>;
  const last = d[d.length - 1].level;
  return (
    <div style={{ height }} role="img" aria-label={`Water level chart, ${d.length} readings, latest ${last ?? "unavailable"}${last === null ? "" : " cm"}; warning ${warn} cm, critical ${crit} cm`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={d} margin={{ top: 10, right: 16, left: 0, bottom: 4 }}>
          <defs><linearGradient id="lv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1f6fff" stopOpacity={0.22} /><stop offset="100%" stopColor="#1f6fff" stopOpacity={0.03} /></linearGradient></defs>
          <CartesianGrid stroke="#e8edf4" />
          <XAxis dataKey="t" tickFormatter={xTick} tick={{ fontSize: 12, fill: "#5c6b82" }} tickLine={false} minTickGap={36} label={{ value: "Time", position: "insideBottom", offset: -2, fontSize: 12, fill: "#5c6b82" }} height={42} />
          <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fontSize: 12, fill: "#5c6b82" }} tickLine={false} width={46} label={{ value: "Water Level (cm)", angle: -90, position: "insideLeft", fontSize: 12, fill: "#5c6b82", dy: 45 }} />
          <ReferenceLine y={crit} stroke="#e5354a" strokeDasharray="6 5" label={{ value: `Critical (${crit} cm)`, position: "insideTopLeft", fill: "#e5354a", fontSize: 12 }} />
          <ReferenceLine y={warn} stroke="#f5a623" strokeDasharray="6 5" label={{ value: `Warning (${warn} cm)`, position: "insideTopLeft", fill: "#e08a00", fontSize: 12 }} />
          <Tooltip {...tipProps} />
          <Area type="monotone" dataKey="level" stroke="#1f6fff" strokeWidth={2.2} fill="url(#lv)" dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
