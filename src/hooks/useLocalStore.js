import { useCallback, useEffect, useState } from "react";
import { seedData } from "../data/seed.js";
import { DEFAULT_SIN_GROUPS, DEFAULT_GOOD_GROUPS } from "../data/catalog.js";
import { GOAL_SPHERES } from "../data/catalog.js";

const STORAGE_KEY = "iman-muhasaba:v1";

const emptyDay = () => ({ sins: {}, good: {}, trigger: "", note: "" });

function defaultState(withSeed) {
  return {
    days: withSeed ? seedData() : {},
    goals: GOAL_SPHERES.map((s) => ({ sphere: s, goal: "", step: "", status: "не начато" })),
    reflections: {},
    dhikr: {},
    categories: {
      sins: DEFAULT_SIN_GROUPS,
      good: DEFAULT_GOOD_GROUPS,
    },
    settings: {
      themeMode: "system", // light | dark | system
      reminderEnabled: false,
      reminderTime: "21:00",
      pinEnabled: false,
      pin: "",
      showHijri: true,
    },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState(false); // первый запуск — чистый старт, без демо
    const parsed = JSON.parse(raw);
    // мягкая миграция: дозаполняем отсутствующие поля дефолтами
    const base = defaultState(false);
    return {
      ...base,
      ...parsed,
      categories: { ...base.categories, ...(parsed.categories || {}) },
      settings: { ...base.settings, ...(parsed.settings || {}) },
    };
  } catch {
    return defaultState(false);
  }
}

export function useLocalStore() {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* переполнение хранилища игнорируем */
    }
  }, [state]);

  const updateCount = useCallback((date, bucket, name, delta) => {
    setState((prev) => {
      const cur = prev.days[date] || emptyDay();
      const nextBucket = { ...cur[bucket] };
      const val = Math.max(0, (nextBucket[name] || 0) + delta);
      if (val === 0) delete nextBucket[name];
      else nextBucket[name] = val;
      return { ...prev, days: { ...prev.days, [date]: { ...cur, [bucket]: nextBucket } } };
    });
  }, []);

  const setTrigger = useCallback((date, val) => {
    setState((prev) => {
      const cur = prev.days[date] || emptyDay();
      return { ...prev, days: { ...prev.days, [date]: { ...cur, trigger: val } } };
    });
  }, []);

  const setNote = useCallback((date, val) => {
    setState((prev) => {
      const cur = prev.days[date] || emptyDay();
      return { ...prev, days: { ...prev.days, [date]: { ...cur, note: val } } };
    });
  }, []);

  const setGoals = useCallback((updater) => {
    setState((prev) => ({
      ...prev,
      goals: typeof updater === "function" ? updater(prev.goals) : updater,
    }));
  }, []);

  const setReflection = useCallback((ym, text) => {
    setState((prev) => ({ ...prev, reflections: { ...prev.reflections, [ym]: text } }));
  }, []);

  const addDhikr = useCallback((date, id, delta) => {
    setState((prev) => {
      const day = { ...(prev.dhikr[date] || {}) };
      day[id] = Math.max(0, (day[id] || 0) + delta);
      return { ...prev, dhikr: { ...prev.dhikr, [date]: day } };
    });
  }, []);

  const resetDhikr = useCallback((date, id) => {
    setState((prev) => {
      const day = { ...(prev.dhikr[date] || {}) };
      day[id] = 0;
      return { ...prev, dhikr: { ...prev.dhikr, [date]: day } };
    });
  }, []);

  const setCategories = useCallback((kind, groups) => {
    setState((prev) => ({ ...prev, categories: { ...prev.categories, [kind]: groups } }));
  }, []);

  const setSetting = useCallback((key, val) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, [key]: val } }));
  }, []);

  const importData = useCallback((incoming) => {
    const base = defaultState(false);
    setState({
      ...base,
      ...incoming,
      categories: { ...base.categories, ...(incoming.categories || {}) },
      settings: { ...base.settings, ...(incoming.settings || {}) },
    });
  }, []);

  const clearAll = useCallback(() => setState(defaultState(false)), []);

  return {
    state,
    actions: {
      updateCount,
      setTrigger,
      setNote,
      setGoals,
      setReflection,
      addDhikr,
      resetDhikr,
      setCategories,
      setSetting,
      importData,
      clearAll,
    },
  };
}
