import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Bell, Cpu, Droplet, History, Home, Info, Settings } from "lucide-react";
import { apiConfigured, fetchLiveStatus } from "./services/api";
import type { ConfigChange, Ctx, DrainEvent, DrainState, Measurement, Page, StatusResponse, Thresholds } from "./types/telemetry";
import { CRIT_DEFAULT, WARN_DEFAULT, makeConnEvents, makeEvents, makeMeasurements, stateFor } from "./data";
import { fmtFull, r1 } from "./format";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/History";
import EventsPage from "./pages/Events";
import DevicePage from "./pages/DeviceStatus";
import SettingsPage from "./pages/ThresholdSettings";

const NAV: { label: Page; icon: typeof Home }[] = [
  { label: "Dashboard", icon: Home },
  { label: "History", icon: History },
  { label: "Events", icon: AlertTriangle },
  { label: "Device Status", icon: Cpu },
  { label: "Threshold Settings", icon: Settings }
];
const DEFAULTS: Thresholds = { warning: WARN_DEFAULT, critical: CRIT_DEFAULT, offlineTimeout: 15, trendEnabled: true };

/** Read thresholds from localStorage, ignoring anything that is not a valid saved configuration. */
function loadThresholds(): Thresholds {
  try {
    const raw = JSON.parse(localStorage.getItem("drainage-thresholds") ?? "null");
    const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : null);
    const warning = num(raw?.warning), critical = num(raw?.critical), offlineTimeout = num(raw?.offlineTimeout);
    if (warning === null || critical === null || critical <= warning) return DEFAULTS;
    return { warning, critical, offlineTimeout: offlineTimeout ?? DEFAULTS.offlineTimeout, trendEnabled: typeof raw?.trendEnabled === "boolean" ? raw.trendEnabled : DEFAULTS.trendEnabled };
  } catch { return DEFAULTS; }
}

export default function App() {
  const [page, setPage] = useState<Page>("Dashboard");
  const [now, setNow] = useState(new Date());
  const [seed] = useState(() => Date.now());
  const [measurements, setMeasurements] = useState<Measurement[]>(() => makeMeasurements(seed));
  const [events] = useState<DrainEvent[]>(() => makeEvents(seed));
  const [connEvents] = useState(() => makeConnEvents(seed));
  const [saved, setSaved] = useState<Thresholds>(loadThresholds);
  const [changes, setChanges] = useState<ConfigChange[]>(() => [
    { id: 1, timestamp: new Date(seed - 2 * 60000).toISOString(), parameter: "Warning Threshold", oldValue: "55 cm", newValue: "60 cm", by: "User" },
    { id: 2, timestamp: new Date(seed - 2 * 60000).toISOString(), parameter: "Critical Threshold", oldValue: "70 cm", newValue: "75 cm", by: "User" },
    { id: 3, timestamp: new Date(seed - 2 * 86400000).toISOString(), parameter: "Offline Timeout", oldValue: "10 s", newValue: "15 s", by: "User" },
    { id: 4, timestamp: new Date(seed - 7 * 86400000).toISOString(), parameter: "Trend Estimation", oldValue: "Disabled", newValue: "Enabled", by: "User" }
  ]);
  const [live, setLive] = useState<StatusResponse | null>(null);
  const [apiNote, setApiNote] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date(seed - 12000));

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  const poll = async () => {
    if (!apiConfigured) return;
    try {
      const status = await fetchLiveStatus();
      if (!mounted.current) return;
      setLive(status); setApiNote(null); setLastRefresh(new Date());
    } catch (e) {
      if (!mounted.current) return;
      setLive(null); setApiNote(e instanceof Error ? e.message : "Backend unreachable");
    }
  };
  useEffect(() => { poll(); if (!apiConfigured) return; const t = setInterval(poll, 5000); return () => clearInterval(t); }, []);

  const refresh = () => {
    if (apiConfigured) { poll(); return; }
    setLastRefresh(new Date());
    setMeasurements(makeMeasurements(Date.now()));
  };

  const isLive = !!live;
  const latest = measurements[measurements.length - 1];
  const prev = measurements[measurements.length - 2];
  const level = isLive ? live!.level_cm : latest.level;
  const warn = isLive ? live!.thresholds?.warning_cm ?? saved.warning : saved.warning;
  const crit = isLive ? live!.thresholds?.critical_cm ?? saved.critical : saved.critical;
  const state: DrainState = isLive ? live!.state : (stateFor(level, warn, crit) as DrainState);
  const online = isLive ? live!.online : true;
  const lastTs = isLive ? live!.last_seen_at : latest.timestamp;
  const delta = !isLive && level !== null && prev?.level != null ? r1(level - prev.level) : null;

  // trend estimate: least-squares slope over the last 6 valid readings; withheld if data are insufficient
  const eta = useMemo(() => {
    if (isLive) { const t = live!.trend?.eta_to_critical_sec; return t ? Math.round(t / 60) : null; }
    if (!saved.trendEnabled || level === null || level >= crit) return null;
    const pts = measurements.filter(m => m.sensorOk && m.level !== null).slice(-6);
    if (pts.length < 5) return null;
    const xs = pts.map((_, i) => i * 5), ys = pts.map(p => p.level as number);
    const mx = xs.reduce((a, b) => a + b) / xs.length, my = ys.reduce((a, b) => a + b) / ys.length;
    const slope = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / xs.reduce((a, x) => a + (x - mx) ** 2, 0);
    return slope > 0.05 ? Math.round((crit - level) / slope) : null;
  }, [measurements, saved.trendEnabled, level, crit, isLive, live]);

  const ctx: Ctx = { level, warn, crit, state, online, lastTs, delta, eta, measurements, events, connEvents, now, saved, setSaved, changes, setChanges, refresh, isLive, setPage, apiNote };

  return (
    <div className="app">
      <a className="skip" href="#main">Skip to main content</a>
      <header className="top">
        <div className="brand"><Droplet size={34} fill="#1f8bff" color="#1f8bff" /><span>Smart Drainage System</span></div>
        <span className={`mode ${isLive ? "live" : ""}`}>{isLive ? "Live" : "Demo / Mock Data"}</span>
        <div className="top-r">
          <span className="onl"><i className={`dot ${online ? "green" : "red"}`} />{online ? "Online" : "Offline"}</span>
          <span className="sep" />
          <span className="upd">Last updated: {fmtFull(lastRefresh)}</span>
          <span className="sep" />
          <button className="icon-btn" aria-label="Notifications"><Bell size={20} /></button>
          <span className="avatar">U</span>
        </div>
      </header>
      <aside className="side">
        <nav aria-label="Main">
          {NAV.map(({ label, icon: Icon }) => (
            <button key={label} className={page === label ? "nav active" : "nav"} onClick={() => setPage(label)} aria-current={page === label ? "page" : undefined}>
              <Icon size={20} fill={page === label && (label === "Dashboard" || label === "Events") ? "currentColor" : "none"} strokeWidth={page === label ? 2.4 : 2} />{label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="main" id="main" tabIndex={-1}>
        {isLive && <div className="notice"><Info size={16} /> Connected to the live status endpoint. History, events and device metrics are still demo data.</div>}
        {apiNote && <div className="notice"><Info size={16} /> Backend unavailable ({apiNote}) — showing clearly labelled demo data.</div>}
        {page === "Dashboard" && <Dashboard {...ctx} />}
        {page === "History" && <HistoryPage {...ctx} />}
        {page === "Events" && <EventsPage {...ctx} />}
        {page === "Device Status" && <DevicePage {...ctx} />}
        {page === "Threshold Settings" && <SettingsPage {...ctx} />}
      </main>
    </div>
  );
}
