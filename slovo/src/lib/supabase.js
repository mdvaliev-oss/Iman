import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Настроено ли подключение к Supabase (ключи заданы и не плейсхолдеры). */
export const isConfigured = Boolean(url && key && !url.includes("YOUR-") && !key.includes("YOUR-"));

export const supabase = isConfigured ? createClient(url, key) : null;
