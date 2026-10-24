import { useState } from "react";
import { AlertTriangle, ChevronRight, FileText, Info, PieChart, Search } from "lucide-react";
import type { Ctx, DrainEvent } from "../types/telemetry";
import { StatusBadge } from "../components/StatusBadge";
import { Card, DateStamp, Kpi, Pager, Select, Title } from "../ui";
import { fmtFull, fmtShortDT } from "../format";

export default function EventsPage(c: Ctx) {
  const [sev, setSev] = useState("All Severities");
  const [type, setType] = useState("All Types");
  const [q, setQ] = useState("");
  const [pg, setPg] = useState(0);
  const all: DrainEvent[] = c.events;
  const total = all.length;
  const count = (f: (e: DrainEvent) => boolean) => all.filter(f).length;
  const pct = (n: number) => `${(n / total * 100).toFixed(1)}% of total`;
  const nW = count(e => e.severity === "WARNING"), nC = count(e => e.severity === "CRITICAL"), nK = count(e => e.type === "Connectivity");
  const rows = all.filter(e => (sev === "All Severities" || e.severity === sev.toUpperCase()) && (type === "All Types" || e.type === type) &&
    (!q || `${e.device} ${e.description} ${e.type}`.toLowerCase().includes(q.toLowerCase())));
  const per = 10, pages = Math.max(1, Math.ceil(rows.length / per));
  const page = rows.slice(pg * per, pg * per + per);
  const types = ["Threshold", "Connectivity", "Device Health", "Data Quality", "System"];
  const alerts = all.filter(e => e.severity !== "INFO").slice(0, 2);
  return (
    <>
      <Title right={<DateStamp now={c.now} />}>Events</Title>
      <div className="kpis four">
        <Kpi icon={FileText} label="Total Events" value={total} sub="Last 24 hours" />
        <Kpi icon={AlertTriangle} tone="orange" label="Warning Events" value={nW} sub={pct(nW)} />
        <Kpi icon={AlertTriangle} tone="red" label="Critical Events" value={nC} sub={pct(nC)} />
        <Kpi icon={Info} label="Connectivity Events" value={nK} sub={pct(nK)} />
      </div>
      <Card className="filters"><div className="filter-row">
        <Select label="Date Range" value="Last 24 hours" onChange={() => {}} options={["Last 24 hours"]} />
        <Select label="Severity" value={sev} onChange={v => { setSev(v); setPg(0); }} options={["All Severities", "Info", "Warning", "Critical"]} />
        <Select label="Event Type" value={type} onChange={v => { setType(v); setPg(0); }} options={["All Types", ...types]} />
        <label className="field grow"><span className="field-l">Search Events</span>
          <span className="sel search"><Search size={16} /><input placeholder="Search by device, message..." value={q} onChange={e => { setQ(e.target.value); setPg(0); }} /></span></label>
      </div></Card>
      <div className="grid-ev">
        <Card title="Event Log" icon={FileText} action={<span className="muted">Showing {rows.length} events</span>} className="tbl">
          <div className="scroll"><table>
            <caption className="sr-only">Event log</caption>
            <thead><tr><th scope="col">Time</th><th scope="col">Severity</th><th scope="col">Event Type</th><th scope="col">Device</th><th scope="col">Description</th></tr></thead>
            <tbody>{page.map(e => (
              <tr key={e.id}><td className="nw">{fmtFull(e.timestamp)}</td><td><StatusBadge kind={e.severity.toLowerCase()}>{e.severity}</StatusBadge></td><td>{e.type}</td><td>{e.device}</td><td>{e.description}</td></tr>))}
              {!page.length && <tr><td colSpan={5} className="empty">No events match the selected filters.</td></tr>}
            </tbody></table></div>
          <Pager pg={pg} pages={pages} setPg={setPg} total={rows.length} />
        </Card>
        <div className="stack">
          <Card title="Active Alerts" icon={AlertTriangle} action={<button className="link" onClick={() => { setSev("All Severities"); setPg(0); }}>View All</button>}>
            {alerts.map(a => (
              <div className="alert-card" key={a.id}>
                <div><StatusBadge kind={a.severity.toLowerCase()}>{a.severity}</StatusBadge><b>{a.device}</b><span className="muted">{fmtShortDT(a.timestamp)}</span><p>{a.description}</p></div>
                <ChevronRight size={18} className="muted" />
              </div>))}
          </Card>
          <Card title="Event Type Breakdown" icon={PieChart}>
            {types.map(t => { const n = count(e => e.type === t); const p = n / total * 100; return (
              <div className="bd" key={t}><span>{t} Events</span><b>{n}</b><span className="bar"><i style={{ width: `${p}%` }} /></span><span className="muted">{p.toFixed(1)}%</span></div>); })}
          </Card>
        </div>
      </div>
    </>
  );
}
