import { useMemo } from "react";
import Section from "../components/Section.jsx";
import StreakRow from "../components/StreakRow.jsx";
import { everHad } from "../lib/stats.js";
import { flatItems } from "../data/catalog.js";

export default function StreaksTab({ T, days, categories }) {
  const sinFlat = useMemo(() => flatItems(categories.sins), [categories.sins]);
  const goodFlat = useMemo(() => flatItems(categories.good), [categories.good]);

  // показываем только пункты, которые пользователь хотя бы раз отмечал
  const sinItems = useMemo(
    () => sinFlat.filter((name) => everHad(days, name, "sins")).sort((a, b) => a.localeCompare(b, "ru")),
    [days, sinFlat]
  );
  const goodItems = useMemo(
    () => goodFlat.filter((name) => everHad(days, name, "good")).sort((a, b) => a.localeCompare(b, "ru")),
    [days, goodFlat]
  );

  const empty = (text) => (
    <p style={{ color: T.muted }} className="text-sm py-2">
      {text}
    </p>
  );

  return (
    <div className="pb-8">
      <Section T={T} title="Грехи">
        {sinItems.length ? (
          <div className="space-y-2">
            {sinItems.map((name) => (
              <StreakRow key={name} T={T} name={name} color={T.bad} />
            ))}
          </div>
        ) : (
          empty("Пока нет отмеченных грехов. Отметьте что-то на вкладке «Сегодня» — и пункт появится здесь.")
        )}
      </Section>

      <Section T={T} title="Благие дела">
        {goodItems.length ? (
          <div className="space-y-2">
            {goodItems.map((name) => (
              <StreakRow key={name} T={T} name={name} color={T.good} />
            ))}
          </div>
        ) : (
          empty("Пока нет отмеченных благих дел. Отметьте что-то на вкладке «Сегодня» — и пункт появится здесь.")
        )}
      </Section>
    </div>
  );
}
