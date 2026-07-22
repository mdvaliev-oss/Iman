import { useMemo } from "react";
import Section from "../components/Section.jsx";
import StreakRow from "../components/StreakRow.jsx";
import { getStreak, everHad } from "../lib/stats.js";
import { flatItems } from "../data/catalog.js";

export default function StreaksTab({ T, days, categories }) {
  const sinFlat = useMemo(() => flatItems(categories.sins), [categories.sins]);
  const goodFlat = useMemo(() => flatItems(categories.good), [categories.good]);

  // показываем только пункты, которые пользователь хотя бы раз отмечал —
  // иначе один отмеченный грех «зажигал» серии у всех остальных
  const sinStreaks = useMemo(
    () =>
      sinFlat
        .filter((name) => everHad(days, name, "sins"))
        .map((name) => ({ name, ...getStreak(days, name, "sins", false) }))
        .sort((a, b) => b.current - a.current)
        .slice(0, 8),
    [days, sinFlat]
  );

  const goodStreaks = useMemo(
    () =>
      goodFlat
        .filter((name) => everHad(days, name, "good"))
        .map((name) => ({ name, ...getStreak(days, name, "good", true) }))
        .sort((a, b) => b.current - a.current)
        .slice(0, 8),
    [days, goodFlat]
  );

  const empty = (text) => (
    <p style={{ color: T.muted }} className="text-sm py-2">
      {text}
    </p>
  );

  return (
    <div className="pb-8">
      <Section T={T} title="Дней подряд без греха">
        {sinStreaks.length ? (
          <div className="space-y-2">
            {sinStreaks.map((s) => (
              <StreakRow key={s.name} T={T} {...s} positive={false} />
            ))}
          </div>
        ) : (
          empty("Пока нет отмеченных грехов. Здесь появится счётчик дней с последнего раза — по каждому пункту, который вы отметите.")
        )}
      </Section>

      <Section T={T} title="Дней подряд с благим делом">
        {goodStreaks.length ? (
          <div className="space-y-2">
            {goodStreaks.map((s) => (
              <StreakRow key={s.name} T={T} {...s} positive={true} />
            ))}
          </div>
        ) : (
          empty("Пока нет отмеченных благих дел. Отметьте что-то на вкладке «Сегодня» — и здесь начнёт расти серия.")
        )}
      </Section>
    </div>
  );
}
