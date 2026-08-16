import { T } from "../theme.js";

export default function Avatar({ name = "?", url, size = 40 }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        style={{ width: size, height: size, borderRadius: 999, objectFit: "cover", border: `1px solid ${T.border}` }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: T.surface3,
        color: T.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.4,
        border: `1px solid ${T.border}`,
      }}
    >
      {initials || "?"}
    </div>
  );
}
