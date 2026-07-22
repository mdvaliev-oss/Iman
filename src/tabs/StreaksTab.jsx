import { useMemo } from "react";
import Section from "../components/Section.jsx";
import StreakRow from "../components/StreakRow.jsx";
import { getStreak } from "../lib/stats.js";
import { flatItems } from "../data/catalog.js";

export default function StreaksTab({ T, days, categories }) {
  const sinFlat = useMemo(() => flatItems(categories.sins), [categories.sins]);
  const goodFlat = useMemo(() => flatItems(categories.good), [categories.good]);

  const sinStreaks = useMemo(
    () =>
      sinFlat
        .map((name) => ({ name, ...getStreak(days, name, "sins", false) }))
        .sort((a, b) => b.current - a.current)
        .slice(0, 8),
    [days, sinFlat]
  );

  const goodStreaks = useMemo(
    () =>
      goodFlat
        .map((name) => ({ name, ...getStreak(days, name, "good", true) }))
        .sort((a, b) => b.current - a.current)
        .slice(0, 8),
    [days, goodFlat]
  );

  return (
    <div className="pb-8">
      <Section T={T} title="Дней подряд без греха">
        <div className="space-y-2">
          {sinStreaks.map((s) => (
            <StreakRow key={s.name} T={T} {...s} positive={false} />
          ))}
        </div>
      </Section>

      <Section T={T} title="Дней подряд с благим делом">
        <div className="space-y-2">
          {goodStreaks.map((s) => (
            <StreakRow key={s.name} T={T} {...s} positive={true} />
          ))}
        </div>
      </Section>
    </div>
  );
}
