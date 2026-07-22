import { BookOpen } from "lucide-react";
import { duaForDate } from "../data/duas.js";

export default function DuaCard({ T, date }) {
  const dua = duaForDate(date);
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${T.accent}`,
        borderRadius: T.radius,
      }}
      className="p-4 mb-6"
    >
      <div style={{ color: T.accent }} className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide mb-2">
        <BookOpen size={13} /> Дуа дня
      </div>
      <p
        dir="rtl"
        lang="ar"
        style={{ color: T.text, lineHeight: 1.9 }}
        className="text-xl sm:text-2xl text-right mb-2"
      >
        {dua.ar}
      </p>
      <p style={{ color: T.muted }} className="text-xs italic mb-1">{dua.tr}</p>
      <p style={{ color: T.text }} className="text-sm">{dua.ru}</p>
      <p style={{ color: T.muted }} className="text-[11px] mt-1.5">{dua.src}</p>
    </div>
  );
}
