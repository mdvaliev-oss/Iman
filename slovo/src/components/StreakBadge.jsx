import { Flame } from "lucide-react";
import { T } from "../theme.js";

export default function StreakBadge({ current = 0, best = 0, size = 13 }) {
  const active = current > 0;
  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: 5, color: active ? T.good : T.faint, fontSize: size, fontWeight: 700 }}
      title={`Рекорд: ${best}`}
    >
      <Flame size={size + 1} />
      {current}
      {best > 0 && <span style={{ color: T.faint, fontWeight: 500, fontSize: size - 1 }}>· рек. {best}</span>}
    </span>
  );
}
