import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { T } from "./theme.js";
import { useAuth } from "./lib/auth.jsx";
import ConfigNotice from "./components/ConfigNotice.jsx";
import NavBar from "./components/NavBar.jsx";
import { Spinner } from "./components/ui.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import MyChallenges from "./pages/MyChallenges.jsx";
import Participants from "./pages/Participants.jsx";
import ProfileView from "./pages/ProfileView.jsx";
import Feed from "./pages/Feed.jsx";

function Shell({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.body }} className="safe-bottom">
      <NavBar />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 40px" }}>{children}</main>
    </div>
  );
}

export default function App() {
  const { isConfigured, loading, user, onboarded } = useAuth();
  const location = useLocation();

  if (!isConfigured) return <ConfigNotice />;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.body }}>
        <Spinner />
      </div>
    );
  }

  // не вошёл
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace state={{ from: location }} />} />
      </Routes>
    );
  }

  // вошёл, но не прошёл онбординг
  if (!onboarded) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  // полноценный доступ
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<MyChallenges />} />
        <Route path="/people" element={<Participants />} />
        <Route path="/u/:id" element={<ProfileView />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}
