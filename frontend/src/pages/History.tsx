import { useMemo, useState } from "react";
import {
  AlertTriangle, ArrowUpDown, CalendarDays, ChevronDown, CircleCheck, Download, Droplet,
  FileText, Filter, RefreshCw, Sigma, TrendingUp, Wifi
} from "lucide-react";
import type { Ctx, Measurement } from "../types/telemetry";
import { toCsv } from "../services/api";
import { Dot } from "../components/StatusBadge";
import { LevelChart } from "../components/LevelChart";
import { Card, DateStamp, Kpi, Pager, Select, Title } from "../ui";
import { RANGES, cap, fmtFull, fmtShortDT, rangeHours } from "../format";

export default function HistoryPage(c: Ctx) {
  const [range, setRange] = useState("Last 6 hours");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState<{ k: keyof Measurement; asc: boolean }>({ k: "timestamp", asc: false });
  const [pg, setPg] = useState(0);
  const h = rangeHours(range);
  const end = new Date(c.lastTs).getTime();
  const inRange: Measurement[] = useMemo(
    () => c.measurements.filter((m: Measurement) => new Date(m.timestamp).getTime() >= end - h * 3600000),
    [c.measurements, end, h]
  );
  const rows = inRange.filter(m => status === "All Status" || cap(m.state) === status);
  const valid = inRange.filter(m => m.level !== null && m.sensorOk) as (Measurement & { level: number })[];
  const min = valid.reduce((a, b) => (b.level < a.level ? b : a), valid[0]);
  const max = valid.reduce((a, b) => (b.level > a.level ? b : a), valid[0]);
  const avg = valid.reduce((a, b) => a + b.level, 0) / (valid.length || 1);
  const sorted = [...rows].sort((a, b) => {
    const x = a[sort.k] as number | string, y = b[sort.k] as number | string;
    return (x < y ? -1 : x > y ? 1 : 0) * (sort.asc ? 1 : -1);
  });
  const per = 8, pages = Math.max(1, Math.ceil(sorted.length / per));
  const page = sorted.slice(pg * per, pg * per + per);
  const th = (k: keyof Measurement, label: string) => (
    <th scope="col" aria-sort={sort.k === k ? (sort.asc ? "ascending" : "descending") : "none"}><button className="th" onClick={() => { setSort(s => ({ k, asc: s.k === k ? !s.asc : true })); setPg(0); }}>{label}<ArrowUpDown size={13} /></button></th>
  );
  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([toCsv(sorted)], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "water-level-history.csv"; a.click(); URL.revokeObjectURL(url);
  };
  const from = new Date(end - h * 3600000);
  return (
    <>
      <Title right={<DateStamp now={c.now} />}>History</Title>
      <Card className="filters">
        <div className="filter-row">
          <label className="field wide"><span className="field-l"><CalendarDays size={15} />Date Range</span>
            <span className="sel static"><CalendarDays size={16} />{fmtShortDT(from)} <span>→</span> {fmtShortDT(new Date(end))}<ChevronDown size={16} /></span></label>
          <Select label="Device" icon={Wifi} value="Main Drainage Sensor" onChange={() => {}} options={["Main Drainage Sensor"]} />
          <Select label="Status" icon={Filter} value={status} onChange={v => { setStatus(v); setPg(0); }} options={["All Status", "Normal", "Warning", "Critical", "Unknown"]} />
          <button className="btn outline" onClick={c.refresh}><RefreshCw size={16} />Refresh</button>
          <button className="btn primary" onClick={exportCsv}><Download size={16} />Export CSV</button>
        </div>
      </Card>
      <div className="kpis four">
        <Kpi icon={Droplet} label="Minimum Water Level" value={<>{min?.level ?? "—"} cm</>} sub={min && fmtShortDT(min.timestamp)} />
        <Kpi icon={TrendingUp} tone="red" label="Maximum Water Level" value={<>{max?.level ?? "—"} cm</>} sub={max && fmtShortDT(max.timestamp)} />
        <Kpi icon={Sigma} label="Average Water Level" value={<>{Math.round(avg)} cm</>} />
        <Kpi icon={FileText} label="Total Readings" value={rows.length} sub="In selected period" />
      </div>
      <Card title="Water Level Over Time" icon={TrendingUp} action={<Select label="" ariaLabel="Time range" value={range} onChange={v => { setRange(v); setPg(0); }} options={RANGES} />}>
        <LevelChart data={inRange} warn={c.warn} crit={c.crit} height={300} />
      </Card>
      <Card title="Measurements" icon={FileText} className="tbl">
        <div className="scroll"><table>
          <caption className="sr-only">Water level measurements</caption>
          <thead><tr>{th("timestamp", "Timestamp")}{th("level", "Water Level (cm)")}{th("state", "Status")}{th("sensorOk", "Sensor OK")}{th("seq", "Seq")}</tr></thead>
          <tbody>{page.map(m => (
            <tr key={m.id}><td>{fmtFull(m.timestamp)}</td><td>{m.level ?? "—"}</td>
              <td><span className="st"><Dot s={m.state} />{cap(m.state)}</span></td>
              <td><span className="st">{m.sensorOk ? <><CircleCheck size={17} className="ok" />Yes</> : <><AlertTriangle size={16} className="bad" />No</>}</span></td>
              <td>{m.seq}</td></tr>))}
            {!page.length && <tr><td colSpan={5} className="empty">No readings match the selected filters.</td></tr>}
          </tbody></table></div>
        <Pager pg={pg} pages={pages} setPg={setPg} total={sorted.length} />
      </Card>
    </>
  );
}
