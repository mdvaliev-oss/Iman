import { useState } from "react";
import { Link } from "react-router-dom";
import { T } from "../theme.js";
import { useAuth } from "../lib/auth.jsx";
import AuthShell from "../components/AuthShell.jsx";
import { Button, Field, TextInput, Alert } from "../components/ui.jsx";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn({ email: email.trim(), password });
    } catch (err) {
      setError(err.message === "Invalid login credentials" ? "Неверный email или пароль" : err.message);
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <h1 style={{ fontSize: 18, margin: "0 0 16px" }}>Вход</h1>
      {error && <Alert>{error}</Alert>}
      <form onSubmit={submit}>
        <Field label="Email">
          <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </Field>
        <Field label="Пароль">
          <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </Field>
        <Button type="submit" full disabled={busy}>
          {busy ? "Входим…" : "Войти"}
        </Button>
      </form>
      <p style={{ color: T.muted, fontSize: 13, textAlign: "center", marginTop: 16 }}>
        Впервые здесь?{" "}
        <Link to="/signup" style={{ color: T.accent, fontWeight: 600 }}>
          Зарегистрироваться по коду
        </Link>
      </p>
    </AuthShell>
  );
}
