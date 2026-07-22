export const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

/** Дата -> "YYYY-MM-DD" (локальная, без сдвига часового пояса). */
export function fmt(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d, n) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export const TODAY = new Date();
export const TODAY_STR = fmt(TODAY);

/** Дата по хиджре для строки "YYYY-MM-DD". Возвращает { text } или null. */
export function hijriFor(dateStr) {
  try {
    const d = new Date(dateStr + "T12:00:00");
    const text = new Intl.DateTimeFormat("ru-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
    return text.replace(" г. хиджры", "").replace(" г.", "") + " хиджры";
  } catch {
    return null;
  }
}
