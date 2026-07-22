import { Minus, Plus } from "lucide-react";

export default function CounterRow({ T, name, count, onDelta }) {
  const active = count > 0;
  return (
    <div
      style={{
        background: active ? T.activeRow : "transparent",
        borderRadius: T.radius,
        border: `1px solid ${active ? T.accent2 : T.border}`,
      }}
      className="flex items-center justify-between px-3 py-2 gap-2"
    >
      <span style={{ color: active ? T.text : T.muted, fontSize: 13.5 }}>{name}</span>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onDelta(-1)} style={{ color: T.muted }} className="p-1" aria-label="минус">
          <Minus size={14} />
        </button>
        <span
          style={{ color: T.accent, minWidth: 14, textAlign: "center", fontFamily: T.displayFont }}
          className="text-sm font-bold"
        >
          {count}
        </span>
        <button onClick={() => onDelta(1)} style={{ color: T.accent }} className="p-1" aria-label="плюс">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
