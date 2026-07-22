import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_NAMES } from "../lib/dates.js";
import { monthSummary } from "../lib/stats.js";
import StatCard from "../components/StatCard.jsx";

export default function ReflectionTab({ T, days, reflections, setReflection }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const ym = `${year}-${String(month + 1).padStart(2, "0")}`;

  const s = useMemo(() => monthSummary(days, ym), [days, ym]);

  function prev() {
    let m = month - 1, y = year;
    if (m < 0) { m = 11; y--; }
    setMonth(m); setYear(y);
  }
  function next() {
    let m = month + 1, y = year;
    if (m > 11) { m = 0; y++; }
    setMonth(m); setYear(y);
  }

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-5">
        <button onClick={prev} style={{ color: T.muted }} aria-label="предыдущий месяц"><ChevronLeft size={20} /></button>
        <div style={{ fontFamily: T.displayFont, color: T.accent }} className="font-bold">
          {MONTH_NAMES[month]} {year}
        </div>
        <button onClick={next} style={{ color: T.muted }} aria-label="следующий месяц"><ChevronRight size={20} /></button>
      </div>

      {s.daysTracked === 0 ? (
        <p style={{ color: T.muted }} className="text-sm text-center py-8">За этот месяц пока нет записей.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <StatCard T={T} label="Дней отмечено" value={s.daysTracked} />
            <StatCard T={T} label="Благих дел" value={s.good} color={T.good} />
            <StatCard T={T} label="Грехов" value={s.sins} color={T.accent2} />
            <StatCard T={T} label="Баланс" value={s.balance > 0 ? `+${s.balance}` : s.balance} />
          </div>

          <div
            style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius }}
            className="p-4 mb-5 text-sm space-y-1.5"
          >
            {s.best && (
              <div style={{ color: T.muted }}>
                Лучший день: <b style={{ color: T.good }}>{s.best.date}</b> (баланс {s.best.bal > 0 ? `+${s.best.bal}` : s.best.bal})
              </div>
            )}
            {s.worst && s.worst.date !== s.best?.date && (
              <div style={{ color: T.muted }}>
                Труднее всего: <b style={{ color: T.accent2 }}>{s.worst.date}</b> (баланс {s.worst.bal > 0 ? `+${s.worst.bal}` : s.worst.bal})
              </div>
            )}
            {s.topTriggers.length > 0 && (
              <div style={{ color: T.muted }}>
                Частые триггеры:{" "}
                {s.topTriggers.map(([t, n], i) => (
                  <span key={t} style={{ color: T.text }}>
                    {t} ({n}){i < s.topTriggers.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div>
        <div style={{ color: T.muted }} className="text-xs mb-1.5">
          Выводы месяца: за что благодарю, над чем работаю дальше
        </div>
        <textarea
          value={reflections[ym] || ""}
          onChange={(e) => setReflection(ym, e.target.value)}
          placeholder="Главный урок месяца, одна привычка на следующий месяц..."
          style={{ background: T.surface, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
          className="w-full text-sm p-3 resize-none h-32 outline-none"
        />
      </div>
    </div>
  );
}
