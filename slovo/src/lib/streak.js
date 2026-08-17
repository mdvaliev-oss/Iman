import { fmt, addDays } from "./dates.js";

/** Из списка дат чек-инов ('YYYY-MM-DD') считает текущую и рекордную серии. */
export function computeStreak(dayList) {
  const set = new Set(dayList);
  if (set.size === 0) return { current: 0, best: 0 };

  // текущая серия: считаем назад от сегодня; если сегодня ещё нет — от вчера
  const today = new Date();
  let start = set.has(fmt(today)) ? today : addDays(today, -1);
  let current = 0;
  if (set.has(fmt(start))) {
    let d = start;
    while (set.has(fmt(d))) {
      current++;
      d = addDays(d, -1);
    }
  }

  // рекорд: самая длинная непрерывная цепочка среди всех дат
  const sorted = [...set].sort();
  let best = 1,
    run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T00:00:00");
    const cur = new Date(sorted[i] + "T00:00:00");
    const diff = Math.round((cur - prev) / 86400000);
    if (diff === 1) run++;
    else run = 1;
    best = Math.max(best, run);
  }

  return { current, best };
}
