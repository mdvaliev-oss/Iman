import { ChevronLeft, ChevronRight } from "lucide-react";
import { fmt, MONTH_NAMES, WEEKDAYS } from "../lib/dates.js";
import { dayBalance } from "../lib/stats.js";

export default function CalendarTab({ T, days, calMonth, calYear, setCalMonth, setCalYear, onSelect }) {
  const first = new Date(calYear, calMonth, 1);
  const startOffset = (first.getDay() + 6) % 7; // понедельник = 0
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function colorFor(d) {
    if (d === null) return "transparent";
    const key = fmt(new Date(calYear, calMonth, d));
    const bal = dayBalance(days, key);
    if (bal === null) return T.surface2;
    if (bal > 1) return T.good;
    if (bal === 1 || bal === 0) return T.surface2;
    return T.accent2;
  }

  function prev() {
    let m = calMonth - 1, y = calYear;
    if (m < 0) { m = 11; y--; }
    setCalMonth(m); setCalYear(y);
  }
  function next() {
    let m = calMonth + 1, y = calYear;
    if (m > 11) { m = 0; y++; }
    setCalMonth(m); setCalYear(y);
  }

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-5">
        <button onClick={prev} style={{ color: T.muted }} aria-label="предыдущий месяц"><ChevronLeft size={20} /></button>
        <div style={{ fontFamily: T.displayFont, color: T.accent, letterSpacing: T.letterSpacing }} className="font-bold">
          {MONTH_NAMES[calMonth]} {calYear}
        </div>
        <button onClick={next} style={{ color: T.muted }} aria-label="следующий месяц"><ChevronRight size={20} /></button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} style={{ color: T.muted }} className="text-center text-[11px]">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => (
          <button
            key={i}
            disabled={d === null}
            onClick={() => d && onSelect(fmt(new Date(calYear, calMonth, d)))}
            style={{
              background: colorFor(d),
              borderRadius: T.radius,
              border: `1px solid ${T.border}`,
              aspectRatio: "1",
              color: d ? T.bg : "transparent",
              fontWeight: 600,
              fontSize: 12,
            }}
            className="flex items-center justify-center"
          >
            {d || ""}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-5 text-xs" style={{ color: T.muted }}>
        <div className="flex items-center gap-1.5"><span style={{ width: 10, height: 10, background: T.good, borderRadius: 3 }} /> хороший баланс</div>
        <div className="flex items-center gap-1.5"><span style={{ width: 10, height: 10, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 3 }} /> нейтрально</div>
        <div className="flex items-center gap-1.5"><span style={{ width: 10, height: 10, background: T.accent2, borderRadius: 3 }} /> были грехи</div>
      </div>
    </div>
  );
}
