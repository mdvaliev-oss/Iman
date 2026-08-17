import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isConfigured } from "./supabase.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadProfile = useCallback(async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    setProfile(data || null);
  }, []);

  useEffect(() => {
    if (!isConfigured) return;
    const uid = session?.user?.id;
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    loadProfile(uid).finally(() => setLoading(false));
  }, [session?.user?.id, loadProfile]);

  const signIn = useCallback(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async ({ code, email, password, displayName }) => {
    // сначала проверяем инвайт-код через защищённую RPC
    const { data: ok, error: rpcErr } = await supabase.rpc("redeem_invite", { code });
    if (rpcErr) throw new Error("Не удалось проверить код приглашения");
    if (!ok) throw new Error("Неверный или неактивный код приглашения");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) throw error;
    // если подтверждение email выключено — сессия появится сразу
    return data;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(() => {
    if (session?.user?.id) return loadProfile(session.user.id);
  }, [session?.user?.id, loadProfile]);

  const value = {
    isConfigured,
    session,
    user: session?.user || null,
    profile,
    loading,
    onboarded: !!profile?.onboarded,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth должен использоваться внутри AuthProvider");
  return ctx;
}
