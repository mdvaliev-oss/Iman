import { Link } from "react-router-dom";
import { T, CHALLENGE_COLORS } from "../theme.js";
import { CHALLENGE_BY_KEY } from "../data/challenges.js";
import { timeAgo } from "../lib/dates.js";
import Avatar from "./Avatar.jsx";

export default function PostCard({ post, author }) {
  const ch = post.challenge_key ? CHALLENGE_BY_KEY[post.challenge_key] : null;
  const color = ch ? CHALLENGE_COLORS[ch.key] : T.border;

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 15 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Link to={`/u/${post.user_id}`}>
          <Avatar name={author?.display_name} url={author?.avatar_url} size={36} />
        </Link>
        <div style={{ minWidth: 0 }}>
          <Link to={`/u/${post.user_id}`} style={{ color: T.text, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            {author?.display_name || "Участник"}
          </Link>
          <div style={{ color: T.faint, fontSize: 12 }}>{timeAgo(post.created_at)}</div>
        </div>
        {ch && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              fontWeight: 700,
              color,
              background: `${color}1e`,
              border: `1px solid ${color}55`,
              borderRadius: 999,
              padding: "3px 9px",
            }}
          >
            Пари {ch.n} · {ch.title}
          </span>
        )}
      </div>

      {post.body && (
        <div style={{ color: T.text, fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{post.body}</div>
      )}
      {post.image_url && (
        <img
          src={post.image_url}
          alt=""
          style={{ width: "100%", borderRadius: T.radiusSm, marginTop: 10, border: `1px solid ${T.border}` }}
        />
      )}
    </div>
  );
}
