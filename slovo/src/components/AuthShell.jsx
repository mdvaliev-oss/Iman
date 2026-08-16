import { T } from "../theme.js";

export default function AuthShell({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(120% 80% at 50% -10%, ${T.surface2}, ${T.bg} 60%)`,
        color: T.text,
        fontFamily: T.body,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontFamily: T.display, color: T.accent, fontSize: 34, fontWeight: 800, letterSpacing: "0.02em" }}>
            Слово
          </div>
          <p style={{ color: T.muted, fontSize: 14, marginTop: 6, lineHeight: 1.5 }}>
            Держи слово, данное себе. Вместе — легче.
          </p>
        </div>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 22 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
