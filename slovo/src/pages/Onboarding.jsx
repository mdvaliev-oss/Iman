import { useState } from "react";
import { T, CHALLENGE_COLORS } from "../theme.js";
import { CHALLENGES } from "../data/challenges.js";
import { supabase } from "../lib/supabase.js";
import { useAuth } from "../lib/auth.jsx";
import Avatar from "../components/Avatar.jsx";
import { Button, Field, TextInput, TextArea, Alert } from "../components/ui.jsx";

export default function Onboarding() {
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [choices, setChoices] = useState(
    Object.fromEntries(CHALLENGES.map((c) => [c.key, { choice_value: "", goal: "" }]))
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const setChoice = (key, field) => (e) =>
    setChoices((c) => ({ ...c, [key]: { ...c[key], [field]: e.target.value } }));

  function pickAvatar(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  }

  async function save() {
    if (!name.trim()) {
      setError("Укажите имя");
      return;
    }
    setBusy(true);
    setError("");
    try {
      let avatar_url = profile?.avatar_url || null;
      if (avatarFile) {
        const path = `${user.id}/${Date.now()}-${avatarFile.name.replace(/[^\w.-]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
        if (upErr) throw upErr;
        avatar_url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      }

      const rows = CHALLENGES.map((c) => ({
        user_id: user.id,
        challenge_key: c.key,
        choice_value: choices[c.key].choice_value.trim(),
        goal: choices[c.key].goal.trim(),
        updated_at: new Date().toISOString(),
      }));
      const { error: chErr } = await supabase.from("choices").upsert(rows, { onConflict: "user_id,challenge_key" });
      if (chErr) throw chErr;

      const { error: pErr } = await supabase
        .from("profiles")
        .update({ display_name: name.trim(), bio: bio.trim(), avatar_url, onboarded: true })
        .eq("id", user.id);
      if (pErr) throw pErr;

      await refreshProfile();
    } catch (e) {
      setError(e.message || "Не удалось сохранить");
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.body }} className="safe-bottom">
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 16px 48px" }}>
        <div style={{ fontFamily: T.display, color: T.accent, fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
          Заключи свои пари
        </div>
        <p style={{ color: T.muted, fontSize: 14, marginBottom: 22, lineHeight: 1.55 }}>
          Заполни профиль и по каждому из трёх пари выбери, за что берёшься. Это твоё слово — его увидят остальные.
        </p>

        {error && <Alert>{error}</Alert>}

        {/* Профиль */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 18, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <label style={{ cursor: "pointer" }} title="Загрузить фото">
              <Avatar name={name || "?"} url={avatarPreview} size={60} />
              <input type="file" accept="image/*" onChange={pickAvatar} style={{ display: "none" }} />
            </label>
            <div style={{ color: T.muted, fontSize: 12.5 }}>Нажми на кружок, чтобы добавить фото</div>
          </div>
          <Field label="Имя">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Как тебя показывать" />
          </Field>
          <Field label="О себе (необязательно)">
            <TextArea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Пара слов о себе" style={{ minHeight: 60 }} />
          </Field>
        </div>

        {/* Три пари */}
        {CHALLENGES.map((c) => {
          const color = CHALLENGE_COLORS[c.key];
          const Icon = c.icon;
          return (
            <div
              key={c.key}
              style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${color}`, borderRadius: T.radius, padding: 18, marginBottom: 14 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}22`, color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} />
                </div>
                <div>
                  <div style={{ color: T.faint, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>ПАРИ {c.n}</div>
                  <div style={{ fontFamily: T.display, fontSize: 17, fontWeight: 700 }}>{c.title}</div>
                </div>
              </div>
              <p style={{ color: T.muted, fontSize: 12.5, marginBottom: 12, lineHeight: 1.5 }}>{c.tagline}</p>
              <Field label={c.choiceLabel}>
                <TextInput value={choices[c.key].choice_value} onChange={setChoice(c.key, "choice_value")} placeholder={c.choicePlaceholder} />
              </Field>
              <Field label="Твоя цель">
                <TextArea value={choices[c.key].goal} onChange={setChoice(c.key, "goal")} placeholder={c.goalPlaceholder} style={{ minHeight: 60 }} />
              </Field>
            </div>
          );
        })}

        <Button full disabled={busy} onClick={save} style={{ marginTop: 6 }}>
          {busy ? "Сохраняем…" : "Дать слово и начать"}
        </Button>
      </div>
    </div>
  );
}
