import { Check, PenLine } from "lucide-react";
import { T, CHALLENGE_COLORS } from "../theme.js";
import StreakBadge from "./StreakBadge.jsx";

export default function ChallengeCard({ challenge, choice, streak, checkedToday, onCheckin, onWriteReport, busy }) {
  const color = CHALLENGE_COLORS[challenge.key];
  const Icon = challenge.icon;
  const value = choice?.choice_value?.trim();

  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: T.radius,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 34, height: 34, borderRadius: 9, background: `${color}22`, color,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon size={18} />
        </div>
        <div>
          <div style={{ color: T.faint, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
            ПАРИ {challenge.n}
          </div>
          <div style={{ fontFamily: T.display, color: T.text, fontSize: 18, fontWeight: 700 }}>
            {challenge.title}
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <StreakBadge current={streak?.current || 0} best={streak?.best || 0} />
        </div>
      </div>

      <div style={{ color: value ? T.text : T.faint, fontSize: 15, fontWeight: 600, marginBottom: value ? 2 : 0 }}>
        {value || "Выбор не задан"}
      </div>
      {choice?.goal && (
        <div style={{ color: T.muted, fontSize: 13, marginBottom: 12 }}>{choice.goal}</div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={onCheckin}
          disabled={busy}
          style={{
            flex: 1,
            borderRadius: T.radiusSm,
            padding: "10px 12px",
            fontSize: 13,
            fontWeight: 700,
            cursor: busy ? "default" : "pointer",
            border: `1px solid ${checkedToday ? T.good : T.border}`,
            background: checkedToday ? `${T.good}22` : T.surface2,
            color: checkedToday ? T.good : T.text,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
          }}
        >
          <Check size={15} />
          {checkedToday ? "Отмечено сегодня" : "Отметить сегодня"}
        </button>
        <button
          onClick={onWriteReport}
          title="Написать отчёт"
          style={{
            borderRadius: T.radiusSm,
            padding: "10px 13px",
            cursor: "pointer",
            border: `1px solid ${T.border}`,
            background: T.surface2,
            color: T.muted,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <PenLine size={15} />
        </button>
      </div>
    </div>
  );
}
