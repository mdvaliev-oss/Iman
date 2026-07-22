/* Экспорт/импорт всех данных пользователя одним JSON-файлом. */

export function exportBackup(state) {
  const payload = {
    app: "iman-muhasaba",
    version: 1,
    exportedAt: new Date().toISOString(),
    data: state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `iman-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Читает файл, валидирует и возвращает объект state. Бросает исключение при ошибке. */
export function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const data = parsed && parsed.data ? parsed.data : parsed;
        if (!data || typeof data !== "object" || !("days" in data)) {
          throw new Error("Файл не похож на бэкап Iman");
        }
        resolve(data);
      } catch (e) {
        reject(new Error("Некорректный файл: " + e.message));
      }
    };
    reader.readAsText(file);
  });
}
