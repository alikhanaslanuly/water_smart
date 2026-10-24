import { useState } from "react";
import {
  BarChart3, FileText, Info, RotateCcw, Save, Settings
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ReferenceArea, ReferenceLine, ResponsiveContainer, XAxis, YAxis
} from "recharts";
import type { ConfigChange, Ctx, Measurement, Thresholds } from "../types/telemetry";
import { CRIT_DEFAULT, WARN_DEFAULT } from "../data";
import { Card, Title } from "../ui";
import { fmtShortDT, xTick } from "../format";

function ThresholdField({ id, label, value, unit, hint, err, onChange }: { id: string; label: string; value: string; unit: string; hint: string; err: string | null; onChange: (v: string) => void }) {
  return (
    <div className="sf">
      <label htmlFor={id}>{label}</label>
      <div className={`num ${err ? "err" : ""}`}><input id={id} inputMode="decimal" value={value} onChange={e => onChange(e.target.value)} aria-invalid={!!err} aria-describedby={`${id}-hint`} /><span>{unit}</span></div>
      <p id={`${id}-hint`} className={err ? "hint bad" : "hint"}><Info size={15} />{err ?? hint}</p>
    </div>
  );
}

export default function SettingsPage(c: Ctx) {
  const [draft, setDraft] = useState({ warning: String(c.saved.warning), critical: String(c.saved.critical), timeout: String(c.saved.offlineTimeout), trend: c.saved.trendEnabled as boolean });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const w = Number(draft.warning), k = Number(draft.critical), t = Number(draft.timeout);
  const eW = draft.warning.trim() === "" || !(w > 0) ? "Must be a positive value greater than 0." : null;
  const eK = draft.critical.trim() === "" || !(k > 0) ? "Must be a positive value." : !eW && k <= w ? "Must be greater than the warning threshold." : null;
  const eT = draft.timeout.trim() === "" || !(t > 0) ? "Must be a positive value." : null;
  const valid = !eW && !eK && !eT;
  const previewW = valid ? w : c.saved.warning, previewK = valid ? k : c.saved.critical;
  const inRangeData: Measurement[] = c.measurements;
  const save = () => {
    if (!valid) { setMsg({ ok: false, text: "Fix the highlighted fields before saving." }); return; }
    const next: Thresholds = { warning: w, critical: k, offlineTimeout: t, trendEnabled: draft.trend };
    const now = new Date().toISOString();
    const log: ConfigChange[] = [];
    const add = (parameter: string, o: string, n: string) => o !== n && log.push({ id: Date.now() + log.length, timestamp: now, parameter, oldValue: o, newValue: n, by: "User" });
    add("Warning Threshold", `${c.saved.warning} cm`, `${w} cm`);
    add("Critical Threshold", `${c.saved.critical} cm`, `${k} cm`);
    add("Offline Timeout", `${c.saved.offlineTimeout} s`, `${t} s`);
    add("Trend Estimation", c.saved.trendEnabled ? "Enabled" : "Disabled", draft.trend ? "Enabled" : "Disabled");
    c.setSaved(next);
    try { localStorage.setItem("drainage-thresholds", JSON.stringify(next)); } catch { /* ignore */ }
    c.setChanges((p: ConfigChange[]) => [...log.reverse(), ...p].slice(0, 8));
    setMsg({ ok: true, text: log.length ? "Saved locally (demo mode — not sent to a device)." : "No changes to save." });
  };
  const reset = () => { setDraft({ warning: String(WARN_DEFAULT), critical: String(CRIT_DEFAULT), timeout: "15", trend: true }); setMsg(null); };
  return (
    <>
      <Title sub="Configure water level thresholds and system parameters. These settings are used to monitor water levels and trigger alerts.">Threshold Settings</Title>
      <div className="grid-set">
        <Card title="Threshold Configuration" icon={Settings} className="form">
          <ThresholdField id="th-warning" label="Warning Threshold" value={draft.warning} onChange={v => { setDraft({ ...draft, warning: v }); setMsg(null); }} unit="cm" hint="Must be a positive value greater than 0." err={eW} />
          <ThresholdField id="th-critical" label="Critical Threshold" value={draft.critical} onChange={v => { setDraft({ ...draft, critical: v }); setMsg(null); }} unit="cm" hint="Must be a positive value and greater than the warning threshold." err={eK} />
          <ThresholdField id="th-timeout" label="Offline Timeout" value={draft.timeout} onChange={v => { setDraft({ ...draft, timeout: v }); setMsg(null); }} unit="s" hint="Time in seconds before a device is considered offline. Must be a positive value." err={eT} />
          <div className="sf"><label>Trend Estimation</label>
            <button className="toggle-row" role="switch" aria-checked={draft.trend} onClick={() => setDraft({ ...draft, trend: !draft.trend })}>
              <span className={`tog ${draft.trend ? "on" : ""}`}><i /></span>Enable trend estimation</button>
            <p className="hint ind">Use recent water level data to estimate time to critical level.</p></div>
          {msg && <div className={`msg ${msg.ok ? "ok" : "bad"}`} role="status">{msg.text}</div>}
          <div className="actions">
            <button className="btn primary lg" onClick={save} disabled={!valid}><Save size={18} />Save Changes</button>
            <button className="btn outline lg" onClick={reset}><RotateCcw size={18} />Reset to Default</button>
          </div>
        </Card>
        <div className="stack">
          <Card title="Threshold Preview" icon={BarChart3}>
            <div style={{ height: 330 }}><ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inRangeData.map(m => ({ t: m.timestamp, level: m.level }))} margin={{ top: 8, right: 14, left: 0, bottom: 4 }}>
                <defs><linearGradient id="pv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1f6fff" stopOpacity={0.25} /><stop offset="100%" stopColor="#1f6fff" stopOpacity={0.05} /></linearGradient></defs>
                <CartesianGrid stroke="#e8edf4" />
                <ReferenceArea y1={previewK} y2={100} fill="#ffd9dc" fillOpacity={0.6} />
                <ReferenceArea y1={previewW} y2={previewK} fill="#ffecc4" fillOpacity={0.7} />
                <XAxis dataKey="t" tickFormatter={xTick} tick={{ fontSize: 12, fill: "#5c6b82" }} tickLine={false} minTickGap={50} label={{ value: "Time", position: "insideBottom", offset: -2, fontSize: 12, fill: "#5c6b82" }} height={40} />
                <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fontSize: 12, fill: "#5c6b82" }} tickLine={false} width={46} label={{ value: "Water Level (cm)", angle: -90, position: "insideLeft", fontSize: 12, fill: "#5c6b82", dy: 45 }} />
                <ReferenceLine y={previewK} stroke="#e5354a" strokeDasharray="6 5" label={{ value: `Critical (${previewK} cm)`, position: "insideTopRight", fill: "#e5354a", fontSize: 12 }} />
                <ReferenceLine y={previewW} stroke="#f5a623" strokeDasharray="6 5" label={{ value: `Warning (${previewW} cm)`, position: "insideTopRight", fill: "#e08a00", fontSize: 12 }} />
                <Area type="monotone" dataKey="level" stroke="#1f6fff" strokeWidth={2.2} fill="url(#pv)" dot={false} isAnimationActive={false} />
              </AreaChart></ResponsiveContainer></div>
            <div className="legend big">
              <span><i className="dot blue" /><div>Normal<small>(0 – {previewW} cm)</small></div></span>
              <span><i className="dot orange" /><div>Warning<small>({previewW} – {previewK} cm)</small></div></span>
              <span><i className="dot red" /><div>Critical<small>(&gt; {previewK} cm)</small></div></span>
            </div>
          </Card>
          <Card title="Recent Configuration Changes" icon={FileText} action={<button className="link" onClick={() => c.setPage("Events")}>View All</button>} className="tbl">
            <div className="scroll"><table>
              <caption className="sr-only">Recent configuration changes</caption>
              <thead><tr><th scope="col">Date & Time</th><th scope="col">Parameter</th><th scope="col">Old Value</th><th scope="col">New Value</th><th scope="col">Changed By</th></tr></thead>
              <tbody>{c.changes.map((x: ConfigChange) => (
                <tr key={x.id}><td className="nw">{fmtShortDT(x.timestamp)}</td><td>{x.parameter}</td><td>{x.oldValue}</td><td>{x.newValue}</td><td>{x.by}</td></tr>))}</tbody></table></div>
          </Card>
        </div>
      </div>
    </>
  );
}
