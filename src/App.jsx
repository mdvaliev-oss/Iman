import { useEffect, useMemo, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useLocalStore } from "./hooks/useLocalStore.js";
import { resolveTheme } from "./theme.js";
import { TODAY_STR, hijriFor } from "./lib/dates.js";
import { startReminderLoop } from "./lib/reminder.js";

import PinLock from "./components/PinLock.jsx";
import TodayTab from "./tabs/TodayTab.jsx";
import CalendarTab from "./tabs/CalendarTab.jsx";
import DashboardTab from "./tabs/DashboardTab.jsx";
import StreaksTab from "./tabs/StreaksTab.jsx";
import TasbihTab from "./tabs/TasbihTab.jsx";
import ReflectionTab from "./tabs/ReflectionTab.jsx";
import GoalsTab from "./tabs/GoalsTab.jsx";
import SettingsTab from "./tabs/SettingsTab.jsx";

const TABS = ["today", "calendar", "dashboard", "streaks", "tasbih", "reflection", "goals", "settings"];

export default function App() {
  const { state, actions } = useLocalStore();
  const { settings } = state;

  // тема с реакцией на системную схему
  const [systemTick, setSystemTick] = useState(0);
  useEffect(() => {
    if (settings.themeMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystemTick((n) => n + 1);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [settings.themeMode]);

  const T = useMemo(() => resolveTheme(settings.themeMode), [settings.themeMode, systemTick]);

  // цвет строки статуса под текущую тему
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", T.bg);
  }, [T]);

  const [selectedDate, setSelectedDate] = useState(TODAY_STR);
  const [activeTab, setActiveTab] = useState("today");
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [unlocked, setUnlocked] = useState(false);

  // цикл напоминаний
  useEffect(() => {
    const stop = startReminderLoop(() => ({
      enabled: state.settings.reminderEnabled,
      time: state.settings.reminderTime,
    }));
    return stop;
  }, [state.settings.reminderEnabled, state.settings.reminderTime]);

  const entry = state.days[selectedDate] || { sins: {}, good: {}, trigger: "", note: "" };

  const Signature = T.signature;
  const Icon = T.tabIcons;

  const needPin = settings.pinEnabled && settings.pin && !unlocked;
  if (needPin) {
    return <PinLock T={T} expected={settings.pin} onUnlock={() => setUnlocked(true)} />;
  }

  const hijri = settings.showHijri ? hijriFor(selectedDate) : null;

  return (
    <div
      style={{ background: T.bg, color: T.text, fontFamily: T.bodyFont, minHeight: "100vh", transition: "background 0.3s, color 0.3s" }}
      className="w-full min-h-screen safe-bottom"
    >
      {/* header */}
      <div style={{ borderBottom: `1px solid ${T.border}` }} className="px-4 sm:px-8 pt-6 pb-4 safe-top">
        <div className="flex items-start justify-between gap-3 max-w-5xl mx-auto">
          <div>
            <div className="flex items-center gap-2">
              <Signature size={20} color={T.accent} />
              <h1
                style={{ fontFamily: T.displayFont, color: T.accent, letterSpacing: T.letterSpacing }}
                className="text-xl sm:text-2xl font-bold"
              >
                {T.name}
              </h1>
            </div>
            <p style={{ color: T.muted }} className="text-xs sm:text-sm mt-1">{T.subtitle}</p>
          </div>

          <button
            onClick={() => actions.setSetting("themeMode", T.mode === "dark" ? "light" : "dark")}
            title="Сменить тему"
            aria-label="Сменить тему"
            style={{ background: T.surface2, color: T.accent, border: `1px solid ${T.border}`, borderRadius: 999 }}
            className="w-9 h-9 flex items-center justify-center shrink-0"
          >
            {T.mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* tabs */}
        <div className="max-w-5xl mx-auto mt-5 flex gap-1.5 overflow-x-auto no-scrollbar">
          {TABS.map((tabId) => {
            const TabIcon = Icon[tabId];
            const activeStyle =
              activeTab === tabId
                ? { background: T.accent, color: T.bg }
                : { background: T.surface2, color: T.muted };
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                style={{ ...activeStyle, borderRadius: T.radius, fontFamily: T.displayFont, letterSpacing: T.letterSpacing }}
                className="px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <TabIcon size={14} />
                {T.labels[tabId]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 mt-6">
        {activeTab === "today" && (
          <TodayTab
            T={T}
            date={selectedDate}
            setDate={setSelectedDate}
            entry={entry}
            hijri={hijri}
            categories={state.categories}
            updateCount={actions.updateCount}
            setTrigger={actions.setTrigger}
            setNote={actions.setNote}
          />
        )}
        {activeTab === "calendar" && (
          <CalendarTab
            T={T}
            days={state.days}
            calMonth={calMonth}
            calYear={calYear}
            setCalMonth={setCalMonth}
            setCalYear={setCalYear}
            onSelect={(d) => {
              setSelectedDate(d);
              setActiveTab("today");
            }}
          />
        )}
        {activeTab === "dashboard" && <DashboardTab T={T} days={state.days} />}
        {activeTab === "streaks" && <StreaksTab T={T} days={state.days} categories={state.categories} />}
        {activeTab === "tasbih" && (
          <TasbihTab
            T={T}
            date={selectedDate}
            dhikr={state.dhikr[selectedDate] || {}}
            addDhikr={actions.addDhikr}
            resetDhikr={actions.resetDhikr}
          />
        )}
        {activeTab === "reflection" && (
          <ReflectionTab T={T} days={state.days} reflections={state.reflections} setReflection={actions.setReflection} />
        )}
        {activeTab === "goals" && <GoalsTab T={T} goals={state.goals} setGoals={actions.setGoals} />}
        {activeTab === "settings" && <SettingsTab T={T} state={state} actions={actions} />}
      </div>
    </div>
  );
}
