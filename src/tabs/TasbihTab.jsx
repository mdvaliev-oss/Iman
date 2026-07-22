import { useState } from "react";
import { RotateCcw, Minus } from "lucide-react";
import { DHIKR_PRESETS } from "../data/catalog.js";
import { TODAY_STR } from "../lib/dates.js";

export default function TasbihTab({ T, date, dhikr, addDhikr, resetDhikr }) {
  const [activeId, setActiveId] = useState(DHIKR_PRESETS[0].id);
  const preset = DHIKR_PRESETS.find((p) => p.id === activeId) || DHIKR_PRESETS[0];
  const count = dhikr[activeId] || 0;
  const reached = count > 0 && count % preset.target === 0;

  function tap() {
    if (navigator.vibrate) navigator.vibrate((count + 1) % preset.target === 0 ? 60 : 12);
    addDhikr(date, activeId, 1);
  }

  const progress = (count % preset.target) / preset.target;
  const rounds = Math.floor(count / preset.target);

  return (
    <div className="pb-8">
      {date !== TODAY_STR && (
        <p style={{ color: T.muted }} className="text-xs italic mb-3 text-center">
          Счёт за {date}. Вернитесь на «Сегодня», чтобы считать за текущий день.
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 justify-center mb-6">
        {DHIKR_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            style={{
              borderRadius: T.radius,
              border: `1px solid ${activeId === p.id ? T.accent : T.border}`,
              color: activeId === p.id ? T.bg : T.muted,
              background: activeId === p.id ? T.accent : "transparent",
            }}
            className="text-xs px-3 py-1.5"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={tap}
          style={{
            background: reached ? T.accent : T.surface,
            border: `3px solid ${T.accent}`,
            color: reached ? T.bg : T.text,
            fontFamily: T.displayFont,
            width: 220,
            height: 220,
            borderRadius: 999,
            boxShadow: `0 0 0 8px ${T.surface2}`,
          }}
          className="flex flex-col items-center justify-center select-none active:scale-95 transition-transform"
        >
          <span className="text-6xl font-bold">{count % preset.target}</span>
          <span style={{ color: reached ? T.bg : T.muted }} className="text-xs mt-1">
            из {preset.target}
          </span>
        </button>

        {/* прогресс-кольцо (полоса) */}
        <div style={{ background: T.surface2, borderRadius: 999 }} className="w-56 h-2 mt-6 overflow-hidden">
          <div style={{ background: T.accent, width: `${progress * 100}%`, height: "100%", transition: "width 0.15s" }} />
        </div>

        <div style={{ color: T.muted }} className="text-xs mt-3">
          Всего сегодня: <b style={{ color: T.text }}>{count}</b>
          {rounds > 0 && <> · кругов: <b style={{ color: T.text }}>{rounds}</b></>}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={() => addDhikr(date, activeId, -1)}
            style={{ background: T.surface2, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
            className="px-4 py-2 text-sm flex items-center gap-1.5"
          >
            <Minus size={14} /> Убрать
          </button>
          <button
            onClick={() => resetDhikr(date, activeId)}
            style={{ background: T.surface2, color: T.accent2, border: `1px solid ${T.border}`, borderRadius: T.radius }}
            className="px-4 py-2 text-sm flex items-center gap-1.5"
          >
            <RotateCcw size={14} /> Сбросить
          </button>
        </div>
      </div>
    </div>
  );
}
