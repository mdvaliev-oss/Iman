import { fmt, addDays, TODAY, MONTH_NAMES } from "./dates.js";

const sum = (obj) => Object.values(obj || {}).reduce((a, b) => a + b, 0);

/** Баланс дня = благие дела − грехи. null, если записи нет. */
export function dayBalance(days, dateStr) {
  const e = days[dateStr];
  if (!e) return null;
  return sum(e.good) - sum(e.sins);
}

/** Агрегация по месяцам для графика. */
export function monthlyAgg(days) {
  const map = {};
  Object.entries(days).forEach(([date, e]) => {
    const key = date.slice(0, 7);
    if (!map[key]) map[key] = { sins: 0, good: 0 };
    map[key].sins += sum(e.sins);
    map[key].good += sum(e.good);
  });
  return Object.entries(map)
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map(([key, v]) => ({
      month: MONTH_NAMES[parseInt(key.slice(5, 7), 10) - 1].slice(0, 3),
      Грехи: v.sins,
      "Благие дела": v.good,
    }));
}

/** Общие итоги за всё время. */
export function totals(days) {
  let sins = 0, good = 0, namazDays = 0, dayCount = 0;
  Object.values(days).forEach((e) => {
    sins += sum(e.sins);
    good += sum(e.good);
    if (Object.keys(e.sins || {}).length || Object.keys(e.good || {}).length) dayCount++;
    if ((e.good || {})["Все намазы вовремя"] > 0) namazDays++;
  });
  return { sins, good, balance: good - sins, namazDays, dayCount };
}

/** Отмечался ли пункт хотя бы раз за всё время (в этой корзине). */
export function everHad(days, name, bucket) {
  return Object.values(days).some((e) => (e?.[bucket]?.[name] || 0) > 0);
}

/** День считается «отмеченным», если в нём есть хотя бы одна запись грехов/благих дел. */
const isTracked = (e) =>
  !!e && (Object.keys(e.sins || {}).length > 0 || Object.keys(e.good || {}).length > 0);

/** Текущая и рекордная серия дней для конкретной отметки.
   Считаем только по реально отмеченным дням — пустые дни не идут в зачёт,
   иначе на чистых данных «дней без греха» ошибочно равнялось бы всему окну. */
export function getStreak(days, name, bucket, wantPresent) {
  const tracked = [];
  for (let i = 60; i >= 0; i--) {
    const key = fmt(addDays(TODAY, -i));
    if (isTracked(days[key])) tracked.push(key);
  }

  const isOk = (key) => {
    const c = days[key]?.[bucket]?.[name] || 0;
    return wantPresent ? c > 0 : c === 0;
  };

  // текущая серия — непрерывный «хвост» отмеченных дней до последнего
  let current = 0;
  for (let i = tracked.length - 1; i >= 0; i--) {
    if (isOk(tracked[i])) current++;
    else break;
  }

  // рекорд — самый длинный отрезок среди отмеченных дней
  let best = 0, run = 0;
  for (let i = 0; i < tracked.length; i++) {
    if (isOk(tracked[i])) {
      run++;
      best = Math.max(best, run);
    } else run = 0;
  }
  return { current, best };
}

/** Сводка за конкретный месяц (YYYY-MM) для вкладки рефлексии. */
export function monthSummary(days, ym) {
  const entries = Object.entries(days).filter(([d]) => d.startsWith(ym));
  let sins = 0, good = 0;
  const triggerCount = {};
  let best = null, worst = null;

  entries.forEach(([date, e]) => {
    const s = sum(e.sins);
    const g = sum(e.good);
    sins += s;
    good += g;
    if (e.trigger) triggerCount[e.trigger] = (triggerCount[e.trigger] || 0) + 1;
    const bal = g - s;
    if (best === null || bal > best.bal) best = { date, bal };
    if (worst === null || bal < worst.bal) worst = { date, bal };
  });

  const topTriggers = Object.entries(triggerCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return {
    daysTracked: entries.length,
    sins,
    good,
    balance: good - sins,
    best,
    worst,
    topTriggers,
  };
}
