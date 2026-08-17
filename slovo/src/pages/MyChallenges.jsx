import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { T } from "../theme.js";
import { CHALLENGES } from "../data/challenges.js";
import { supabase } from "../lib/supabase.js";
import { useAuth } from "../lib/auth.jsx";
import { todayStr } from "../lib/dates.js";
import { computeStreak } from "../lib/streak.js";
import ChallengeCard from "../components/ChallengeCard.jsx";
import PostComposer from "../components/PostComposer.jsx";
import { Spinner } from "../components/ui.jsx";

export default function MyChallenges() {
  const { user, profile } = useAuth();
  const [choices, setChoices] = useState({});
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState(null);
  const [composerFor, setComposerFor] = useState(undefined); // undefined = закрыт

  const load = useCallback(async () => {
    const [{ data: ch }, { data: ci }] = await Promise.all([
      supabase.from("choices").select("*").eq("user_id", user.id),
      supabase.from("checkins").select("challenge_key, day").eq("user_id", user.id),
    ]);
    setChoices(Object.fromEntries((ch || []).map((r) => [r.challenge_key, r])));
    setCheckins(ci || []);
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    load();
  }, [load]);

  const daysFor = (key) => checkins.filter((c) => c.challenge_key === key).map((c) => c.day);

  async function toggleCheckin(key) {
    setBusyKey(key);
    const today = todayStr();
    const already = daysFor(key).includes(today);
    try {
      if (already) {
        await supabase.from("checkins").delete().match({ user_id: user.id, challenge_key: key, day: today });
        setCheckins((cs) => cs.filter((c) => !(c.challenge_key === key && c.day === today)));
      } else {
        await supabase.from("checkins").insert({ user_id: user.id, challenge_key: key, day: today });
        setCheckins((cs) => [...cs, { challenge_key: key, day: today }]);
      }
    } finally {
      setBusyKey(null);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 style={{ fontFamily: T.display, fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>
        Привет, {profile?.display_name?.split(" ")[0] || "друг"}
      </h1>
      <p style={{ color: T.muted, fontSize: 14, margin: "0 0 20px" }}>
        Отметь сегодняшний шаг по каждому пари. Держи слово.
      </p>

      {composerFor !== undefined && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ color: T.muted, fontSize: 13, fontWeight: 600 }}>Новый отчёт</div>
            <button onClick={() => setComposerFor(undefined)} style={{ background: "none", border: "none", color: T.faint, cursor: "pointer" }}>
              <X size={18} />
            </button>
          </div>
          <PostComposer
            defaultChallenge={composerFor}
            onPosted={() => setComposerFor(undefined)}
          />
        </div>
      )}

      <div style={{ display: "grid", gap: 14 }}>
        {CHALLENGES.map((c) => (
          <ChallengeCard
            key={c.key}
            challenge={c}
            choice={choices[c.key]}
            streak={computeStreak(daysFor(c.key))}
            checkedToday={daysFor(c.key).includes(todayStr())}
            busy={busyKey === c.key}
            onCheckin={() => toggleCheckin(c.key)}
            onWriteReport={() => setComposerFor(c.key)}
          />
        ))}
      </div>
    </div>
  );
}
