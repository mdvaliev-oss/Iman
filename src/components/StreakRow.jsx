import { Flame } from "lucide-react";

export default function StreakRow({ T, name, current, best, positive }) {
  return (
    <div
      style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius }}
      className="flex items-center justify-between px-3 py-2.5"
    >
      <span style={{ color: T.text }} className="text-sm">{name}</span>
      <div className="flex items-center gap-3">
        <div style={{ color: positive ? T.good : T.accent }} className="text-sm font-bold flex items-center gap-1">
          <Flame size={13} /> {current}
        </div>
        <span style={{ color: T.muted }} className="text-[11px]">рекорд {best}</span>
      </div>
    </div>
  );
}
