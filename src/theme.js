import { CalendarDays, BarChart3, Flame, Target, Settings, Leaf, Repeat, NotebookPen } from "lucide-react";

/* Единственная тема — «Минимал», в двух вариантах: светлый и тёмный.
   Форма, шрифты, иконки и подписи общие; отличаются только цвета. */

const SHARED = {
  id: "minimal",
  name: "Iman",
  displayFont: "'Helvetica Neue', Arial, sans-serif",
  bodyFont: "'Helvetica Neue', Arial, sans-serif",
  radius: "12px",
  letterSpacing: "0",
  upper: false,
  subtitle: "Спокойный личный трекер мухасабы",
  signature: Leaf,
  tabIcons: {
    today: CalendarDays,
    calendar: CalendarDays,
    dashboard: BarChart3,
    streaks: Flame,
    tasbih: Repeat,
    reflection: NotebookPen,
    goals: Target,
    settings: Settings,
  },
  labels: {
    today: "Сегодня",
    calendar: "Календарь",
    dashboard: "Итоги",
    streaks: "Серии",
    tasbih: "Зикр",
    reflection: "Рефлексия",
    goals: "Цели",
    settings: "Настройки",
  },
};

const LIGHT = {
  ...SHARED,
  mode: "light",
  bg: "#faf8f4",
  surface: "#ffffff",
  surface2: "#f2efe8",
  border: "#e3ddd0",
  text: "#2b2a26",
  muted: "#8c887c",
  accent: "#5f8c6b",
  accent2: "#b56b4a",
  good: "#5f8c6b",
  activeRow: "#eef3ee",
};

const DARK = {
  ...SHARED,
  mode: "dark",
  bg: "#14171a",
  surface: "#1c2024",
  surface2: "#242a30",
  border: "#333b43",
  text: "#e9e6df",
  muted: "#8f97a1",
  accent: "#7fb08c",
  accent2: "#d18a63",
  good: "#7fb08c",
  activeRow: "#22302a",
};

export const THEME_VARIANTS = { light: LIGHT, dark: DARK };

/** Возвращает объект темы по режиму: "light" | "dark" | "system". */
export function resolveTheme(mode) {
  if (mode === "system") {
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? DARK : LIGHT;
  }
  return mode === "dark" ? DARK : LIGHT;
}
