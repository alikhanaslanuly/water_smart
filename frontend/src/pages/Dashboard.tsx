import { useMemo, useState } from "react";
import { Clock3, Droplet, AlertTriangle, FileText, TrendingUp, Wifi } from "lucide-react";
import type { Ctx, DrainEvent, Measurement } from "../types/telemetry";
import { Banner, Dot } from "../components/StatusBadge";
import { LevelChart } from "../components/LevelChart";
import { Card, DateStamp, Kpi, Select, Title } from "../ui";
import { RANGES, fmtDate, fmtHMS, fmtShortDT, rangeHours } from "../format";

export default function Dashboard(c: Ctx) {
  const [range, setRange] = useState("Last 6 hours");
  const h = rangeHours(range);
  const data = useMemo(
    () => c.measurements.filter((m: Measurement) => new Date(m.timestamp).getTime() >= new Date(c.lastTs).getTime() - h * 3600000),
    [c.measurements, c.lastTs, h]
  );
  const recent = c.events.slice(0, 4);
  return (
    <>
      <Title right={<DateStamp now={c.now} />}>Dashboard</Title>
      <Banner state={c.state} online={c.online} />
      <div className="kpis five">
        <Kpi icon={Droplet} label={c.online ? "Current Water Level" : "Last Known Water Level"} value={<>{c.level ?? "—"}<small> cm</small></>}
          sub={c.delta !== null && <b className="delta">{c.delta >= 0 ? "↑ +" : "↓ "}{c.delta} cm</b>} extra={c.delta !== null && <div className="kpi-s">from last reading</div>} />
        <Kpi icon={Clock3} label="Last Measurement Time" value={<span className="two">{fmtDate(c.lastTs)}<br />{fmtHMS(c.lastTs)}</span>} />
        <Kpi icon={Wifi} label="Device Status" value={<>{c.online ? "Online" : "Offline"} <i className={`dot ${c.online ? "green" : "red"}`} /></>} sub={c.online ? "Normal operation" : "No data within timeout"} />
        <Kpi icon={AlertTriangle} tone="orange" label="Warning Threshold" value={<>{c.warn} cm</>} />
        <Kpi icon={AlertTriangle} tone="red" label="Critical Threshold" value={<>{c.crit} cm</>} />
      </div>
      <div className="grid-dash">
        <Card title="Water Level History" icon={TrendingUp} action={<Select label="" ariaLabel="Time range" value={range} onChange={setRange} options={RANGES} />}>
          <LevelChart data={data} warn={c.warn} crit={c.crit} height={440} />
        </Card>
        <div className="stack">
          <Card title="Estimated time to critical" icon={Clock3}>
            {c.eta !== null
              ? <div className="eta">{c.eta}<small> min</small></div>
              : <div className="eta na">Forecast unavailable</div>}
            <p className="muted">Based on recent water level trend.<br />Estimate is shown only when recent data are sufficient.</p>
          </Card>
          <Card title="Recent Events" icon={FileText} action={<button className="link" onClick={() => c.setPage("Events")}>View All</button>}>
            <ul className="recent">
              {recent.map((e: DrainEvent) => (
                <li key={e.id}><Dot s={e.severity} /><div><span className="muted">{fmtShortDT(e.timestamp)}</span><p>{e.description}</p></div></li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
