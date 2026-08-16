import { useState, useRef } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { T, CHALLENGE_COLORS } from "../theme.js";
import { CHALLENGES } from "../data/challenges.js";
import { supabase } from "../lib/supabase.js";
import { useAuth } from "../lib/auth.jsx";
import { Button, TextArea, Alert } from "./ui.jsx";

export default function PostComposer({ defaultChallenge = null, onPosted }) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [challengeKey, setChallengeKey] = useState(defaultChallenge);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  function pickFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }
  function clearFile() {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submit() {
    if (!body.trim() && !file) {
      setError("Напишите пару слов или прикрепите фото");
      return;
    }
    setBusy(true);
    setError("");
    try {
      let image_url = null;
      if (file) {
        const path = `${user.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from("post-images").upload(path, file);
        if (upErr) throw upErr;
        image_url = supabase.storage.from("post-images").getPublicUrl(path).data.publicUrl;
      }
      const { error: insErr } = await supabase.from("posts").insert({
        user_id: user.id,
        challenge_key: challengeKey,
        body: body.trim(),
        image_url,
      });
      if (insErr) throw insErr;
      setBody("");
      clearFile();
      onPosted?.();
    } catch (e) {
      setError(e.message || "Не удалось опубликовать");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 15 }}>
      {error && <Alert>{error}</Alert>}
      <TextArea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Что сделал сегодня по своему пари? Коротко и честно…"
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0" }}>
        {CHALLENGES.map((c) => {
          const active = challengeKey === c.key;
          const color = CHALLENGE_COLORS[c.key];
          return (
            <button
              key={c.key}
              onClick={() => setChallengeKey(active ? null : c.key)}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "5px 11px",
                borderRadius: 999,
                cursor: "pointer",
                color: active ? "#12100c" : T.muted,
                background: active ? color : "transparent",
                border: `1px solid ${active ? color : T.border}`,
              }}
            >
              Пари {c.n} · {c.title}
            </button>
          );
        })}
      </div>

      {preview && (
        <div style={{ position: "relative", marginBottom: 10 }}>
          <img src={preview} alt="" style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.border}` }} />
          <button
            onClick={clearFile}
            style={{
              position: "absolute", top: 8, right: 8, background: "#000a", color: "#fff",
              border: "none", borderRadius: 999, width: 28, height: 28, cursor: "pointer",
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            borderRadius: T.radiusSm, padding: "10px 13px", cursor: "pointer",
            border: `1px solid ${T.border}`, background: T.surface2, color: T.muted,
            display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600,
          }}
        >
          <ImagePlus size={16} /> Фото
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} style={{ display: "none" }} />
        <Button onClick={submit} disabled={busy} style={{ marginLeft: "auto" }}>
          <Send size={15} /> {busy ? "Публикую…" : "Опубликовать"}
        </Button>
      </div>
    </div>
  );
}
