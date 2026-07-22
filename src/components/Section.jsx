export default function Section({ T, title, children }) {
  return (
    <div className="mb-7">
      <h2
        style={{
          fontFamily: T.displayFont,
          color: T.text,
          letterSpacing: T.letterSpacing,
          textTransform: T.upper ? "uppercase" : "none",
        }}
        className="text-sm font-bold mb-3 flex items-center gap-2"
      >
        <span style={{ width: 6, height: 6, background: T.accent, borderRadius: 999 }} />
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
