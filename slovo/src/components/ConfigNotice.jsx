import { T } from "../theme.js";

export default function ConfigNotice() {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.body, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ maxWidth: 520, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 24 }}>
        <div style={{ fontFamily: T.display, color: T.accent, fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Слово</div>
        <h1 style={{ fontSize: 17, margin: "0 0 12px" }}>Нужно подключить базу данных</h1>
        <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>
          Приложение не видит ключей Supabase. Задайте переменные окружения
          <code style={{ color: T.accent }}> VITE_SUPABASE_URL</code> и
          <code style={{ color: T.accent }}> VITE_SUPABASE_ANON_KEY</code> — локально в файле
          <code> .env</code> (по образцу <code>.env.example</code>) или в настройках проекта на Vercel.
        </p>
        <ol style={{ color: T.muted, fontSize: 13.5, lineHeight: 1.7, paddingLeft: 18, margin: 0 }}>
          <li>Создайте бесплатный проект на supabase.com.</li>
          <li>Выполните <code>supabase/schema.sql</code> в SQL-редакторе.</li>
          <li>Скопируйте Project URL и anon public key в переменные окружения.</li>
          <li>Перезапустите приложение.</li>
        </ol>
      </div>
    </div>
  );
}
