import { useState } from "react";
import { X, Plus, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { DEFAULT_SIN_GROUPS, DEFAULT_GOOD_GROUPS } from "../data/catalog.js";

/* Редактор пользовательских списков грехов/благих дел.
   groups = [{ group, items: [] }], onChange(newGroups). */
export default function CategoryEditor({ T, kind, groups, onChange }) {
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [newGroup, setNewGroup] = useState("");

  const defaults = kind === "sins" ? DEFAULT_SIN_GROUPS : DEFAULT_GOOD_GROUPS;
  const title = kind === "sins" ? "Грехи" : "Благие дела";

  function renameGroup(gi, value) {
    onChange(groups.map((g, i) => (i === gi ? { ...g, group: value } : g)));
  }
  function removeGroup(gi) {
    onChange(groups.filter((_, i) => i !== gi));
  }
  function addItem(gi) {
    const val = (newItem[gi] || "").trim();
    if (!val) return;
    onChange(groups.map((g, i) => (i === gi ? { ...g, items: [...g.items, val] } : g)));
    setNewItem((s) => ({ ...s, [gi]: "" }));
  }
  function removeItem(gi, ii) {
    onChange(groups.map((g, i) => (i === gi ? { ...g, items: g.items.filter((_, j) => j !== ii) } : g)));
  }
  function addGroup() {
    const val = newGroup.trim();
    if (!val) return;
    onChange([...groups, { group: val, items: [] }]);
    setNewGroup("");
  }
  function resetToDefault() {
    if (confirm(`Вернуть стандартные категории «${title}»? Ваши изменения списка будут потеряны (отметки в днях останутся).`)) {
      onChange(defaults);
    }
  }

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius }} className="p-4">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between">
        <h3 style={{ fontFamily: T.displayFont, color: T.text }} className="text-sm font-bold">
          Категории: {title}
        </h3>
        <span style={{ color: T.muted }}>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          {groups.map((g, gi) => (
            <div key={gi} style={{ borderColor: T.border }} className="border-b pb-3 last:border-b-0">
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={g.group}
                  onChange={(e) => renameGroup(gi, e.target.value)}
                  style={{ background: T.surface2, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
                  className="flex-1 text-xs font-semibold px-2 py-1.5 outline-none"
                />
                <button onClick={() => removeGroup(gi)} style={{ color: T.accent2 }} className="p-1" aria-label="удалить группу">
                  <X size={15} />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {g.items.map((it, ii) => (
                  <span
                    key={ii}
                    style={{ background: T.surface2, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
                    className="text-xs pl-2.5 pr-1 py-1 flex items-center gap-1"
                  >
                    {it}
                    <button onClick={() => removeItem(gi, ii)} style={{ color: T.muted }} className="p-0.5" aria-label="удалить">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-1.5">
                <input
                  value={newItem[gi] || ""}
                  onChange={(e) => setNewItem((s) => ({ ...s, [gi]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && addItem(gi)}
                  placeholder="Добавить пункт..."
                  style={{ background: T.surface2, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
                  className="flex-1 text-xs px-2 py-1.5 outline-none"
                />
                <button
                  onClick={() => addItem(gi)}
                  style={{ background: T.accent, color: T.bg, borderRadius: T.radius }}
                  className="px-2.5 flex items-center"
                  aria-label="добавить пункт"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex gap-1.5">
            <input
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGroup()}
              placeholder="Новая группа..."
              style={{ background: T.surface2, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
              className="flex-1 text-xs px-2 py-1.5 outline-none"
            />
            <button
              onClick={addGroup}
              style={{ background: T.accent, color: T.bg, borderRadius: T.radius }}
              className="px-3 text-xs font-bold flex items-center gap-1"
            >
              <Plus size={13} /> Группа
            </button>
          </div>

          <button
            onClick={resetToDefault}
            style={{ color: T.muted }}
            className="text-xs flex items-center gap-1.5"
          >
            <RotateCcw size={12} /> Вернуть стандартный список
          </button>
        </div>
      )}
    </div>
  );
}
