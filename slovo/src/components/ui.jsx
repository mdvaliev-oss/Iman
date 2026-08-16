import { T } from "../theme.js";

export function Button({ variant = "primary", full, style, children, ...rest }) {
  const base = {
    borderRadius: T.radiusSm,
    fontWeight: 700,
    fontSize: 14,
    padding: "11px 16px",
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "opacity .15s, background .15s",
    width: full ? "100%" : undefined,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };
  const variants = {
    primary: { background: T.accent, color: "#1a1200" },
    ghost: { background: "transparent", color: T.text, border: `1px solid ${T.border}` },
    subtle: { background: T.surface2, color: T.text, border: `1px solid ${T.border}` },
    danger: { background: "transparent", color: T.danger, border: `1px solid ${T.danger}` },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {children}
    </button>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      {label && (
        <div style={{ color: T.muted, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      )}
      {children}
      {hint && <div style={{ color: T.faint, fontSize: 11, marginTop: 5 }}>{hint}</div>}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  background: T.surface2,
  color: T.text,
  border: `1px solid ${T.border}`,
  borderRadius: T.radiusSm,
  padding: "11px 13px",
  fontSize: 14,
  outline: "none",
};

export function TextInput(props) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />;
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      style={{ ...inputStyle, resize: "vertical", minHeight: 84, ...(props.style || {}) }}
    />
  );
}

export function Card({ style, children, ...rest }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Spinner({ label = "Загрузка…" }) {
  return (
    <div style={{ color: T.muted, textAlign: "center", padding: 40, fontSize: 14 }}>{label}</div>
  );
}

export function Alert({ tone = "danger", children }) {
  const color = tone === "danger" ? T.danger : T.accent;
  return (
    <div
      style={{
        background: `${color}18`,
        border: `1px solid ${color}66`,
        color: T.text,
        borderRadius: T.radiusSm,
        padding: "10px 12px",
        fontSize: 13,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}
