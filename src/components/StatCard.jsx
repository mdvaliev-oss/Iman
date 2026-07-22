export default function StatCard({ T, label, value, color }) {
  return (
    <div
      style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius }}
      className="p-4"
    >
      <div style={{ color: color || T.accent, fontFamily: T.displayFont }} className="text-2xl font-bold">
        {value}
      </div>
      <div style={{ color: T.muted }} className="text-xs mt-1">
        {label}
      </div>
    </div>
  );
}
