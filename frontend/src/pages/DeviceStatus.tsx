import { useMemo, useState } from "react";
import {
  BarChart3, CalendarDays, Check, Clock3, Copy, Cpu, Heart, Info, MapPin, TrendingUp, Wifi, Zap
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ConnEvent, Ctx } from "../types/telemetry";
import { deviceId } from "../services/api";
import { makeDelivery } from "../data";
import { StatusBadge } from "../components/StatusBadge";
import { Card, Kpi, Select, Title } from "../ui";
import { RANGES, fmtDate, fmtFull, fmtHMS, tipProps, xTick } from "../format";

export default function DevicePage(c: Ctx) {
  const delivery = useMemo(() => makeDelivery(c.measurements), [c.measurements]);
  const [range, setRange] = useState("Last 6 hours");
  const [copied, setCopied] = useState(false);
  const t0 = new Date(delivery[0].timestamp).getTime(), t1 = new Date(delivery[delivery.length - 1].timestamp).getTime();
  const secAgo = Math.max(0, Math.round((c.now.getTime() - new Date(c.lastTs).getTime()) / 1000));
  const copy = () => { navigator.clipboard?.writeText(deviceId).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  const offlineSegs = delivery.map((d, i) => ({ d, i })).filter(x => !x.d.online);
  return (
    <>
      <Title right={<Select label="" ariaLabel="Device" value={deviceId} onChange={() => {}} options={[deviceId]} />}>Device Status</Title>
      <Card className="hero">
        <div className="hero-i"><Cpu size={40} /></div>
        <div className="hero-m"><h2>{deviceId}</h2><span>Drainage monitoring device</span><StatusBadge kind={c.online ? "online" : "offline"}>{c.online ? "Online" : "Offline"}</StatusBadge></div>
        <div className="hero-s"><MapPin size={20} /><div><span className="muted">Installation Location</span><b>Main Drainage Channel<br />Site A</b></div></div>
        <div className="hero-s"><CalendarDays size={20} /><div><span className="muted">Last Seen</span><b className="big">{fmtDate(c.lastTs)}<br />{fmtHMS(c.lastTs)}</b></div></div>
      </Card>
      <div className="kpis five">
        <Kpi icon={Wifi} label="Connection Status" value={<>{c.online ? "Online" : "Offline"} <i className={`dot ${c.online ? "green" : "red"}`} /></>} sub={c.online ? "Connected to server" : "No data within timeout"} />
        <Kpi icon={Clock3} label="Last Seen" value={<span className="two">{fmtDate(c.lastTs)}<br />{fmtHMS(c.lastTs)}</span>} sub={`${secAgo} seconds ago`} />
        <Kpi icon={Heart} tone="green" label="Sensor Health" value={<>Healthy <i className="dot green" /></>} sub="All sensors normal" />
        <Kpi icon={BarChart3} label="Delivery Ratio" value="99.6%" sub="Last 6 hours" />
        <Kpi icon={Zap} label="Average Update Delay" value="2.8 s" sub="Last 6 hours" />
      </div>
      <div className="grid-dev">
        <Card title="Connectivity & Message Delivery" icon={TrendingUp} action={<Select label="" ariaLabel="Time range" value={range} onChange={setRange} options={RANGES} />}>
          <div className="legend"><span><i className="dot green" />Online</span><span><i className="dot red" />Offline</span><span><i className="ln" />Message Delivery Rate</span></div>
          <div className="strip-wrap"><span className="strip-l">Status</span>
            <div className="strip">{offlineSegs.map(({ d, i }) => <i key={i} style={{ left: `${(new Date(d.timestamp).getTime() - t0) / (t1 - t0) * 100}%` }} />)}</div></div>
          <div style={{ height: 250 }}><ResponsiveContainer width="100%" height="100%">
            <AreaChart data={delivery} margin={{ top: 6, right: 10, left: 0, bottom: 4 }}>
              <defs><linearGradient id="dl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1f6fff" stopOpacity={0.2} /><stop offset="100%" stopColor="#1f6fff" stopOpacity={0.03} /></linearGradient></defs>
              <CartesianGrid stroke="#e8edf4" />
              <XAxis dataKey="timestamp" tickFormatter={xTick} tick={{ fontSize: 12, fill: "#5c6b82" }} tickLine={false} minTickGap={40} />
              <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fontSize: 12, fill: "#5c6b82" }} tickLine={false} width={44} label={{ value: "Delivery Rate (%)", angle: -90, position: "insideLeft", fontSize: 12, fill: "#5c6b82", dy: 50 }} />
              <Tooltip {...({ ...tipProps, formatter: (v: any) => [`${v}%`, "Delivery"] } as any)} />
              <Area type="monotone" dataKey="rate" stroke="#1f6fff" strokeWidth={2} fill="url(#dl)" dot={false} isAnimationActive={false} />
            </AreaChart></ResponsiveContainer></div>
        </Card>
        <Card title="Device Information" icon={Info}>
          <dl className="info">
            <dt>Device ID</dt><dd>{deviceId} <button className="icon-btn sm" onClick={copy} aria-label="Copy device ID">{copied ? <Check size={15} /> : <Copy size={15} />}</button></dd>
            <dt>Firmware Version</dt><dd>v1.0.3</dd>
            <dt>Last Sequence</dt><dd>{(125482 + (c.measurements.length - 73)).toLocaleString("en-US")}</dd>
            <dt>Last Measurement</dt><dd>{fmtFull(c.lastTs)}</dd>
            <dt>API Status</dt><dd><i className={`dot ${c.isLive ? "green" : "gray"}`} /><span>{c.isLive ? "Reachable" : "Demo mode"}<small>{c.isLive ? "HTTP 200 OK" : "No backend configured"}</small></span></dd>
            <dt>Offline Timeout</dt><dd>{c.saved.offlineTimeout} s</dd>
          </dl>
        </Card>
      </div>
      <Card title="Connectivity Events" icon={Clock3} action={<button className="link" onClick={() => c.setPage("Events")}>View All</button>} className="tbl">
        <div className="scroll"><table>
          <caption className="sr-only">Connectivity events</caption>
          <thead><tr><th scope="col">Time</th><th scope="col">Event</th><th scope="col">Details</th></tr></thead>
          <tbody>{c.connEvents.map((e: ConnEvent) => (
            <tr key={e.id}><td><span className="st"><i className={`dot ${e.online ? "green" : "red"}`} />{fmtFull(e.timestamp)}</span></td>
              <td><StatusBadge kind={e.online ? "online" : "offline"}>{e.online ? "Online" : "Offline"}</StatusBadge></td><td>{e.details}</td></tr>))}</tbody></table></div>
      </Card>
    </>
  );
}
