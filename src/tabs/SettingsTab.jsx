import { useRef, useState } from "react";
import { Download, Upload, Trash2, Bell, Sun, Moon, Monitor } from "lucide-react";
import CategoryEditor from "../components/CategoryEditor.jsx";
import { exportBackup, readBackupFile } from "../lib/backup.js";
import { requestNotifyPermission } from "../lib/reminder.js";

function Card({ T, title, icon, children }) {
  const Icon = icon;
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius }} className="p-4">
      <h3 style={{ fontFamily: T.displayFont, color: T.text }} className="text-sm font-bold mb-3 flex items-center gap-2">
        {Icon && <Icon size={15} color={T.accent} />}
        {title}
      </h3>
      {children}
    </div>
  );
}

function Toggle({ T, checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{ background: checked ? T.accent : T.surface2, border: `1px solid ${T.border}` }}
      className="relative w-11 h-6 rounded-full transition-colors shrink-0"
      role="switch"
      aria-checked={checked}
    >
      <span
        style={{ background: T.bg, left: checked ? 22 : 3 }}
        className="absolute top-[3px] w-[18px] h-[18px] rounded-full transition-all"
      />
    </button>
  );
}

export default function SettingsTab({ T, state, actions }) {
  const { settings } = state;
  const fileRef = useRef(null);
  const [msg, setMsg] = useState("");

  const themeOptions = [
    { id: "light", label: "Светлая", icon: Sun },
    { id: "dark", label: "Тёмная", icon: Moon },
    { id: "system", label: "Как в системе", icon: Monitor },
  ];

  async function toggleReminder(val) {
    if (val) {
      const perm = await requestNotifyPermission();
      if (perm !== "granted") {
        setMsg("Уведомления не разрешены в браузере — напоминание не сможет появиться.");
      } else {
        setMsg("");
      }
    }
    actions.setSetting("reminderEnabled", val);
  }

  async function onImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readBackupFile(file);
      if (confirm("Импорт заменит текущие данные. Продолжить?")) {
        actions.importData(data);
        setMsg("Данные восстановлены из бэкапа.");
      }
    } catch (err) {
      setMsg(err.message);
    }
    e.target.value = "";
  }

  return (
    <div className="pb-8 space-y-4">
      {msg && (
        <div style={{ background: T.surface2, color: T.text, border: `1px solid ${T.accent}`, borderRadius: T.radius }} className="p-3 text-xs">
          {msg}
        </div>
      )}

      {/* Тема */}
      <Card T={T} title="Тема оформления">
        <div className="grid grid-cols-3 gap-2">
          {themeOptions.map((o) => {
            const Icon = o.icon;
            const active = settings.themeMode === o.id;
            return (
              <button
                key={o.id}
                onClick={() => actions.setSetting("themeMode", o.id)}
                style={{
                  background: active ? T.accent : T.surface2,
                  color: active ? T.bg : T.muted,
                  border: `1px solid ${active ? T.accent : T.border}`,
                  borderRadius: T.radius,
                }}
                className="flex flex-col items-center gap-1 py-2.5 text-xs"
              >
                <Icon size={16} />
                {o.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Отображение */}
      <Card T={T} title="Отображение">
        <div className="flex items-center justify-between">
          <span style={{ color: T.text }} className="text-sm">Показывать дату по хиджре</span>
          <Toggle T={T} checked={settings.showHijri} onChange={(v) => actions.setSetting("showHijri", v)} />
        </div>
      </Card>

      {/* Напоминание */}
      <Card T={T} title="Вечернее напоминание" icon={Bell}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: T.text }} className="text-sm">Напоминать о мухасабе</span>
          <Toggle T={T} checked={settings.reminderEnabled} onChange={toggleReminder} />
        </div>
        {settings.reminderEnabled && (
          <div className="flex items-center justify-between">
            <span style={{ color: T.muted }} className="text-xs">Время</span>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => actions.setSetting("reminderTime", e.target.value)}
              style={{ background: T.surface2, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
              className="text-sm px-2 py-1 outline-none"
            />
          </div>
        )}
        <p style={{ color: T.muted }} className="text-[11px] mt-2 leading-relaxed">
          Напоминание приходит, пока приложение установлено и открывалось в течение дня. Для надёжной работы добавьте Iman на экран «Домой».
        </p>
      </Card>

      {/* PIN */}
      <Card T={T} title="PIN-код">
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: T.text }} className="text-sm">Защитить вход PIN-кодом</span>
          <Toggle
            T={T}
            checked={settings.pinEnabled}
            onChange={(v) => {
              if (!v) actions.setSetting("pin", "");
              actions.setSetting("pinEnabled", v);
            }}
          />
        </div>
        {settings.pinEnabled && (
          <input
            type="password"
            inputMode="numeric"
            value={settings.pin}
            onChange={(e) => actions.setSetting("pin", e.target.value)}
            placeholder="Задайте PIN (например 4 цифры)"
            style={{ background: T.surface2, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
            className="w-full text-sm px-3 py-2 outline-none"
          />
        )}
        <p style={{ color: T.muted }} className="text-[11px] mt-2">
          PIN хранится только на этом устройстве и защищает от случайного открытия, а не от взлома.
        </p>
      </Card>

      {/* Категории */}
      <CategoryEditor T={T} kind="sins" groups={state.categories.sins} onChange={(g) => actions.setCategories("sins", g)} />
      <CategoryEditor T={T} kind="good" groups={state.categories.good} onChange={(g) => actions.setCategories("good", g)} />

      {/* Бэкап */}
      <Card T={T} title="Резервная копия">
        <p style={{ color: T.muted }} className="text-xs mb-3 leading-relaxed">
          Данные хранятся только на этом устройстве. Сохраните бэкап, чтобы перенести их на другой телефон или не потерять при очистке браузера.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => exportBackup(state)}
            style={{ background: T.accent, color: T.bg, borderRadius: T.radius }}
            className="flex-1 py-2 text-sm font-bold flex items-center justify-center gap-1.5"
          >
            <Download size={15} /> Экспорт
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            style={{ background: T.surface2, color: T.text, border: `1px solid ${T.border}`, borderRadius: T.radius }}
            className="flex-1 py-2 text-sm font-bold flex items-center justify-center gap-1.5"
          >
            <Upload size={15} /> Импорт
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={onImportFile} className="hidden" />
        </div>
      </Card>

      {/* Опасная зона */}
      <Card T={T} title="Очистка данных">
        <button
          onClick={() => {
            if (confirm("Удалить ВСЕ данные без возможности восстановления? Сначала лучше сделать экспорт.")) {
              actions.clearAll();
              setMsg("Все данные удалены.");
            }
          }}
          style={{ background: "transparent", color: T.accent2, border: `1px solid ${T.accent2}`, borderRadius: T.radius }}
          className="w-full py-2 text-sm font-bold flex items-center justify-center gap-1.5"
        >
          <Trash2 size={15} /> Удалить все данные
        </button>
      </Card>

      {/* О приложении */}
      <Card T={T} title="О приложении">
        <p style={{ color: T.muted }} className="text-xs leading-relaxed">
          Iman — приватный трекер мухасабы. Все данные (грехи, благие дела, зикр, цели, заметки) хранятся только на вашем устройстве и никуда не отправляются.
          Приложение работает офлайн и устанавливается на телефон: откройте меню браузера и выберите «Добавить на экран Домой».
        </p>
      </Card>
    </div>
  );
}
