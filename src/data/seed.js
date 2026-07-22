import { fmt, addDays, TODAY } from "../lib/dates.js";
import { DEFAULT_SIN_GROUPS, DEFAULT_GOOD_GROUPS, TRIGGERS, flatItems } from "./catalog.js";

const SIN_FLAT = flatItems(DEFAULT_SIN_GROUPS);
const GOOD_FLAT = flatItems(DEFAULT_GOOD_GROUPS);

/** Демо-данные за последние 45 дней (детерминированный ГПСЧ). */
export function seedData() {
  const data = {};
  let seed = 42;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  for (let i = 45; i >= 1; i--) {
    const key = fmt(addDays(TODAY, -i));
    const entry = { sins: {}, good: {}, trigger: "", note: "" };

    if (rnd() < 0.55) {
      const pick = SIN_FLAT[Math.floor(rnd() * SIN_FLAT.length)];
      entry.sins[pick] = 1 + (rnd() < 0.2 ? 1 : 0);
      entry.trigger = TRIGGERS[Math.floor(rnd() * TRIGGERS.length)];
    }

    const goodCount = 1 + Math.floor(rnd() * 4);
    for (let g = 0; g < goodCount; g++) {
      const pick = GOOD_FLAT[Math.floor(rnd() * GOOD_FLAT.length)];
      entry.good[pick] = (entry.good[pick] || 0) + 1;
    }
    if (rnd() < 0.72) entry.good["Все намазы вовремя"] = 1;

    data[key] = entry;
  }
  return data;
}
