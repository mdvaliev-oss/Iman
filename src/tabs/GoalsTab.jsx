export default function GoalsTab({ T, goals, setGoals }) {
  function update(i, field, val) {
    setGoals((prev) => prev.map((g, idx) => (idx === i ? { ...g, [field]: val } : g)));
  }
  const statuses = ["не начато", "в процессе", "выполнено"];

  return (
    <div className="pb-8 space-y-3">
      {goals.map((g, i) => (
        <div
          key={g.sphere}
          style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius }}
          className="p-4"
        >
          <div className="flex items-center justify-between mb-2 gap-2">
            <span style={{ fontFamily: T.displayFont, color: T.accent }} className="text-sm font-bold">{g.sphere}</span>
            <select
              value={g.status}
              onChange={(e) => update(i, "status", e.target.value)}
              style={{ background: T.surface2, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
              className="text-xs px-2 py-1"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <input
            value={g.goal}
            onChange={(e) => update(i, "goal", e.target.value)}
            placeholder="Цель на год..."
            style={{ background: T.surface2, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
            className="w-full text-sm px-3 py-2 mb-2 outline-none"
          />
          <input
            value={g.step}
            onChange={(e) => update(i, "step", e.target.value)}
            placeholder="Мини-шаг на неделю..."
            style={{ background: T.surface2, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
            className="w-full text-sm px-3 py-2 outline-none"
          />
        </div>
      ))}
    </div>
  );
}
