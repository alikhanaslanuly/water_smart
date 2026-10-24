export const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const p2 = (n: number) => String(n).padStart(2, "0");
export const fmtDate = (v: string | Date) => { const d = new Date(v); return `${MON[d.getMonth()]} ${p2(d.getDate())}, ${d.getFullYear()}`; };
export const fmtHM = (v: string | Date) => { const d = new Date(v); return `${p2(d.getHours())}:${p2(d.getMinutes())}`; };
export const fmtHMS = (v: string | Date) => `${fmtHM(v)}:${p2(new Date(v).getSeconds())}`;
export const fmtFull = (v: string | Date) => `${fmtDate(v)} ${fmtHMS(v)}`;
export const fmtShortDT = (v: string | Date) => `${fmtDate(v)} ${fmtHM(v)}`;
export const fmtTopDate = (d: Date) => `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]}, ${fmtDate(d)}`;
export const cap = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
export const r1 = (n: number) => Math.round(n * 10) / 10;
export const tipProps = { contentStyle: { borderRadius: 8, border: "1px solid #e5eaf2", fontSize: 12 }, labelFormatter: (v: string) => fmtHM(v), formatter: (v: number | string) => [`${v} cm`, "Level"] } as any;
export const xTick = (v: string) => fmtHM(v);
export const rangeHours = (r: string) => Number(/\d+/.exec(r)?.[0]) || 6; // "Last 12 hours" -> 12
export const RANGES = ["Last 2 hours", "Last 6 hours", "Last 12 hours"];
