import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { T, CHALLENGE_COLORS } from "../theme.js";
import { CHALLENGES } from "../data/challenges.js";
import { supabase } from "../lib/supabase.js";
import { useAuth } from "../lib/auth.jsx";
import { computeStreak } from "../lib/streak.js";
import Avatar from "../components/Avatar.jsx";
import StreakBadge from "../components/StreakBadge.jsx";
import PostCard from "../components/PostCard.jsx";
import { Spinner } from "../components/ui.jsx";

export default function ProfileView() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [choices, setChoices] = useState({});
  const [checkins, setCheckins] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const [{ data: p }, { data: ch }, { data: ci }, { data: ps }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
        supabase.from("choices").select("*").eq("user_id", id),
        supabase.from("checkins").select("challenge_key, day").eq("user_id", id),
        supabase.from("posts").select("*").eq("user_id", id).order("created_at", { ascending: false }),
      ]);
      setProfile(p || null);
      setChoices(Object.fromEntries((ch || []).map((r) => [r.challenge_key, r])));
      setCheckins(ci || []);
      setPosts(ps || []);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <Spinner />;
  if (!profile) return <p style={{ color: T.muted }}>Профиль не найден.</p>;

  const daysFor = (key) => checkins.filter((c) => c.challenge_key === key).map((c) => c.day);
  const isMe = user?.id === id;

  return (
    <div>
      <Link to="/people" style={{ color: T.muted, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <ArrowLeft size={15} /> К участникам
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <Avatar name={profile.display_name} url={profile.avatar_url} size={64} />
        <div>
          <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 800 }}>
            {profile.display_name} {isMe && <span style={{ color: T.faint, fontSize: 13, fontFamily: T.body }}>(это вы)</span>}
          </div>
          {profile.bio && <div style={{ color: T.muted, fontSize: 13.5, marginTop: 2 }}>{profile.bio}</div>}
        </div>
      </div>

      <div style={{ display: "grid", gap: 12, marginBottom: 26 }}>
        {CHALLENGES.map((c) => {
          const color = CHALLENGE_COLORS[c.key];
          const Icon = c.icon;
          const choice = choices[c.key];
          const val = choice?.choice_value?.trim();
          return (
            <div key={c.key} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${color}`, borderRadius: T.radius, padding: 15 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}22`, color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} />
                </div>
                <div style={{ color: T.faint, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>ПАРИ {c.n} · {c.title.toUpperCase()}</div>
                <div style={{ marginLeft: "auto" }}>
                  <StreakBadge {...computeStreak(daysFor(c.key))} />
                </div>
              </div>
              <div style={{ color: val ? T.text : T.faint, fontSize: 15, fontWeight: 600 }}>{val || "Выбор не задан"}</div>
              {choice?.goal && <div style={{ color: T.muted, fontSize: 13, marginTop: 3 }}>{choice.goal}</div>}
            </div>
          );
        })}
      </div>

      <h2 style={{ fontFamily: T.display, fontSize: 18, fontWeight: 700, margin: "0 0 12px" }}>Отчёты</h2>
      {posts.length === 0 ? (
        <p style={{ color: T.muted, fontSize: 14 }}>Пока нет отчётов.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} author={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
