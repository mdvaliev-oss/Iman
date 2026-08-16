import { useState } from "react";
import { Link } from "react-router-dom";
import { T } from "../theme.js";
import { useAuth } from "../lib/auth.jsx";
import AuthShell from "../components/AuthShell.jsx";
import { Button, Field, TextInput, Alert } from "../components/ui.jsx";

export default function Signup() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ code: "", displayName: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Пароль минимум 6 символов");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await signUp({
        code: form.code.trim(),
        email: form.email.trim(),
        password: form.password,
        displayName: form.displayName.trim() || "Участник",
      });
      // если требуется подтверждение email — сессии сразу не будет
      if (!res.session) {
        setInfo("Аккаунт создан. Проверьте почту и подтвердите email, затем войдите.");
        setBusy(false);
      }
      // иначе onAuthStateChange сам переведёт на онбординг
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <h1 style={{ fontSize: 18, margin: "0 0 16px" }}>Регистрация</h1>
      {error && <Alert>{error}</Alert>}
      {info && <Alert tone="accent">{info}</Alert>}
      <form onSubmit={submit}>
        <Field label="Код приглашения" hint="Выдаётся организатором группы">
          <TextInput value={form.code} onChange={set("code")} placeholder="SLOVO-2026" required />
        </Field>
        <Field label="Имя (как показывать)">
          <TextInput value={form.displayName} onChange={set("displayName")} placeholder="Ваше имя" required />
        </Field>
        <Field label="Email">
          <TextInput type="email" value={form.email} onChange={set("email")} autoComplete="email" required />
        </Field>
        <Field label="Пароль" hint="Минимум 6 символов">
          <TextInput type="password" value={form.password} onChange={set("password")} autoComplete="new-password" required />
        </Field>
        <Button type="submit" full disabled={busy}>
          {busy ? "Создаём…" : "Создать аккаунт"}
        </Button>
      </form>
      <p style={{ color: T.muted, fontSize: 13, textAlign: "center", marginTop: 16 }}>
        Уже есть аккаунт?{" "}
        <Link to="/login" style={{ color: T.accent, fontWeight: 600 }}>
          Войти
        </Link>
      </p>
    </AuthShell>
  );
}
