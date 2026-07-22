import { ChevronLeft, ChevronRight } from "lucide-react";
import { fmt, addDays, TODAY_STR } from "../lib/dates.js";
import { TRIGGERS } from "../data/catalog.js";
import CounterRow from "../components/CounterRow.jsx";
import Section from "../components/Section.jsx";
import GroupBlock from "../components/GroupBlock.jsx";
import DuaCard from "../components/DuaCard.jsx";

export default function TodayTab({ T, date, setDate, entry, hijri, categories, updateCount, setTrigger, setNote }) {
  const sinsTotal = Object.values(entry.sins || {}).reduce((a, b) => a + b, 0);
  const goodTotal = Object.values(entry.good || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setDate(fmt(addDays(new Date(date), -1)))} style={{ color: T.muted }} aria-label="предыдущий день">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <div style={{ fontFamily: T.displayFont, color: T.accent }} className="text-lg font-bold">{date}</div>
          {hijri && <div style={{ color: T.muted }} className="text-[11px] mt-0.5">{hijri}</div>}
          {date === TODAY_STR && <div style={{ color: T.good }} className="text-xs mt-0.5">сегодня</div>}
        </div>
        <button onClick={() => setDate(fmt(addDays(new Date(date), 1)))} style={{ color: T.muted }} aria-label="следующий день">
          <ChevronRight size={20} />
        </button>
      </div>

      <DuaCard T={T} date={date} />

      <p style={{ color: T.muted, borderColor: T.border }} className="text-xs italic mb-6 border-l-2 pl-3">
        Не нужно подробностей — только категория и, если хочется, короткая заметка. Это дневник для роста, а не архив ошибок.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div style={{ background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}` }} className="p-4 text-center">
          <div style={{ color: T.accent2 }} className="text-2xl font-bold">{sinsTotal}</div>
          <div style={{ color: T.muted }} className="text-xs mt-1">отметок грехов</div>
        </div>
        <div style={{ background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}` }} className="p-4 text-center">
          <div style={{ color: T.good }} className="text-2xl font-bold">{goodTotal}</div>
          <div style={{ color: T.muted }} className="text-xs mt-1">благих дел</div>
        </div>
      </div>

      <Section T={T} title="Грехи">
        {categories.sins.map((g) => (
          <GroupBlock T={T} key={g.group} title={g.group}>
            {g.items.map((name) => (
              <CounterRow
                key={name}
                T={T}
                name={name}
                count={entry.sins?.[name] || 0}
                onDelta={(d) => updateCount(date, "sins", name, d)}
              />
            ))}
          </GroupBlock>
        ))}

        {sinsTotal > 0 && (
          <div className="mt-3">
            <div style={{ color: T.muted }} className="text-xs mb-1.5">Главный триггер сегодня</div>
            <div className="flex flex-wrap gap-1.5">
              {TRIGGERS.map((tr) => (
                <button
                  key={tr}
                  onClick={() => setTrigger(date, entry.trigger === tr ? "" : tr)}
                  style={{
                    borderRadius: T.radius,
                    border: `1px solid ${entry.trigger === tr ? T.accent : T.border}`,
                    color: entry.trigger === tr ? T.accent : T.muted,
                    background: entry.trigger === tr ? T.surface2 : "transparent",
                  }}
                  className="text-xs px-2.5 py-1"
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>
        )}
      </Section>

      <Section T={T} title="Благие дела">
        {categories.good.map((g) => (
          <GroupBlock T={T} key={g.group} title={g.group}>
            {g.items.map((name) => (
              <CounterRow
                key={name}
                T={T}
                name={name}
                count={entry.good?.[name] || 0}
                onDelta={(d) => updateCount(date, "good", name, d)}
              />
            ))}
          </GroupBlock>
        ))}
      </Section>

      <div className="mt-2">
        <div style={{ color: T.muted }} className="text-xs mb-1.5">Короткая заметка (необязательно)</div>
        <textarea
          value={entry.note || ""}
          onChange={(e) => setNote(date, e.target.value)}
          placeholder="Пара слов о дне..."
          style={{ background: T.surface, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
          className="w-full text-sm p-3 resize-none h-20 outline-none"
        />
      </div>
    </div>
  );
}
