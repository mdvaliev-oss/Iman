import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { T, CHALLENGE_COLORS } from "../theme.js";
import { CHALLENGES } from "../data/challenges.js";
import { supabase } from "../lib/supabase.js";
import Avatar from "../components/Avatar.jsx";
import { Spinner } from "../components/ui.jsx";

export default function Participants() {
  const [people, setPeople] = useState([]);
  const [choicesByUser, setChoicesByUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: profiles }, { data: choices }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at"),
        supabase.from("choices").select("*"),
      ]);
      const byUser = {};
      (choices || []).forEach((c) => {
        byUser[c.user_id] = byUser[c.user_id] || {};
        byUser[c.user_id][c.challenge_key] = c;
      });
      setPeople((profiles || []).filter((p) => p.onboarded));
      setChoicesByUser(byUser);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 style={{ fontFamily: T.display, fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>Участники</h1>
      <p style={{ color: T.muted, fontSize: 14, margin: "0 0 20px" }}>
        Кто что выбрал. Нажми на человека, чтобы увидеть его цели и прогресс.
      </p>

      {people.length === 0 && <p style={{ color: T.muted }}>Пока никто не заполнил профиль.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {people.map((p) => (
          <Link
            key={p.id}
            to={`/u/${p.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 15 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <Avatar name={p.display_name} url={p.avatar_url} size={44} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.display_name}</div>
                  {p.bio && <div style={{ color: T.muted, fontSize: 12.5 }}>{p.bio}</div>}
                </div>
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {CHALLENGES.map((c) => {
                  const val = choicesByUser[p.id]?.[c.key]?.choice_value?.trim();
                  const color = CHALLENGE_COLORS[c.key];
                  return (
                    <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                      <span style={{ width: 7, height: 7, borderRadius: 999, background: color, flexShrink: 0 }} />
                      <span style={{ color: T.faint, minWidth: 78 }}>Пари {c.n} · {c.title}</span>
                      <span style={{ color: val ? T.text : T.faint, fontWeight: val ? 600 : 400 }}>
                        {val || "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
