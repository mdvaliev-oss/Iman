export default function GroupBlock({ T, title, children }) {
  return (
    <div>
      <div style={{ color: T.muted }} className="text-[11px] uppercase tracking-wide mb-1.5">
        {title}
      </div>
      <div className="grid sm:grid-cols-2 gap-1.5">{children}</div>
    </div>
  );
}
