import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { fmtHM, fmtTopDate } from "./format";

export function Card({ title, icon: Icon, action, children, className = "" }: { title?: string; icon?: typeof Home; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card ${className}`}>
      {title && <header className="card-h"><h3>{Icon && <Icon size={19} />}{title}</h3>{action}</header>}
      {children}
    </section>
  );
}
export function Kpi({ icon: Icon, label, value, sub, tone = "blue", extra }: { icon: typeof Home; label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: string; extra?: React.ReactNode }) {
  return (
    <div className="card kpi">
      <Icon size={26} className={`kpi-i ${tone}`} />
      <div className="kpi-b">
        <div className="kpi-l">{label}</div>
        <div className="kpi-v">{value}</div>
        {sub && <div className="kpi-s">{sub}</div>}
        {extra}
      </div>
    </div>
  );
}
export function Select({ label, icon: Icon, value, onChange, options, ariaLabel }: { label: string; icon?: typeof Home; value: string; onChange: (v: string) => void; options: string[]; ariaLabel?: string }) {
  return (
    <label className="field">
      <span className="field-l">{Icon && <Icon size={15} />}{label}</span>
      <span className="sel">
        <select value={value} aria-label={label ? undefined : ariaLabel} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select>
        <ChevronDown size={16} />
      </span>
    </label>
  );
}
export function Title({ children, right, sub }: { children: React.ReactNode; right?: React.ReactNode; sub?: string }) {
  return <div className="title"><div><h1>{children}</h1>{sub && <p>{sub}</p>}</div>{right}</div>;
}
export const DateStamp = ({ now }: { now: Date }) => <div className="datestamp"><CalendarDays size={20} /><span>{fmtTopDate(now)}<br />{fmtHM(now)}</span></div>;
export function Pager({ pg, pages, setPg, total }: { pg: number; pages: number; setPg: (n: number) => void; total: number }) {
  return (
    <div className="pager" role="navigation" aria-label="Pagination"><span className="muted">Showing {total} records</span>
      <button className="pg" disabled={pg === 0} onClick={() => setPg(pg - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
      {Array.from({ length: pages }, (_, i) => <button key={i} className={`pg ${i === pg ? "on" : ""}`} onClick={() => setPg(i)} aria-label={`Page ${i + 1}`} aria-current={i === pg ? "page" : undefined}>{i + 1}</button>)}
      <button className="pg" disabled={pg >= pages - 1} onClick={() => setPg(pg + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
    </div>
  );
}
