import { NavLink, useNavigate } from "react-router-dom";
import { Flag, Users, MessageSquareText, LogOut } from "lucide-react";
import { T } from "../theme.js";
import { useAuth } from "../lib/auth.jsx";
import Avatar from "./Avatar.jsx";

const links = [
  { to: "/", label: "Мои пари", icon: Flag, end: true },
  { to: "/people", label: "Участники", icon: Users },
  { to: "/feed", label: "Лента", icon: MessageSquareText },
];

export default function NavBar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: `${T.bg}ee`,
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{ maxWidth: 720, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}
      >
        <div style={{ fontFamily: T.display, color: T.accent, fontWeight: 800, fontSize: 20, letterSpacing: "0.02em" }}>
          Слово
        </div>

        <nav style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 11px",
                borderRadius: T.radiusSm,
                fontSize: 13,
                fontWeight: 600,
                color: isActive ? "#1a1200" : T.muted,
                background: isActive ? T.accent : "transparent",
              })}
            >
              <Icon size={15} />
              <span style={{ display: "none" }} className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => navigate(`/u/${profile?.id}`)}
          title="Мой профиль"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <Avatar name={profile?.display_name} url={profile?.avatar_url} size={30} />
        </button>
        <button
          onClick={signOut}
          title="Выйти"
          style={{ background: "none", border: "none", color: T.faint, cursor: "pointer", padding: 4 }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
