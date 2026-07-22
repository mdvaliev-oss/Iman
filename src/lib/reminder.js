/* Локальные напоминания о вечерней мухасабе.
   Без сервера пушей: пока приложение открыто (или во вкладке в фоне),
   раз в минуту проверяем время и показываем уведомление один раз в день. */

export async function requestNotifyPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

function fireNotification() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    new Notification("Время мухасабы", {
      body: "Подведи итог дня: что удалось, над чем поработать завтра.",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: "iman-muhasaba-daily",
    });
  } catch {
    /* некоторые браузеры требуют service worker для Notification — тихо пропускаем */
  }
}

const LAST_KEY = "iman-muhasaba:lastReminder";

/** Запускает поминутную проверку. Возвращает функцию остановки. */
export function startReminderLoop(getConfig) {
  const check = () => {
    const { enabled, time } = getConfig();
    if (!enabled || !time) return;
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    if (hhmm !== time) return;
    const todayKey = now.toISOString().slice(0, 10);
    if (localStorage.getItem(LAST_KEY) === todayKey) return; // уже показывали сегодня
    localStorage.setItem(LAST_KEY, todayKey);
    fireNotification();
  };
  const id = setInterval(check, 60 * 1000);
  check();
  return () => clearInterval(id);
}
