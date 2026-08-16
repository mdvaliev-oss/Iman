import { useEffect, useState, useCallback } from "react";
import { T } from "../theme.js";
import { supabase } from "../lib/supabase.js";
import PostComposer from "../components/PostComposer.jsx";
import PostCard from "../components/PostCard.jsx";
import { Spinner } from "../components/ui.jsx";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [{ data: ps }, { data: profiles }] = await Promise.all([
      supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("profiles").select("id, display_name, avatar_url"),
    ]);
    setPosts(ps || []);
    setAuthors(Object.fromEntries((profiles || []).map((p) => [p.id, p])));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("posts-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, () => load())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [load]);

  return (
    <div>
      <h1 style={{ fontFamily: T.display, fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>Лента</h1>
      <p style={{ color: T.muted, fontSize: 14, margin: "0 0 18px" }}>
        Отчёты всех участников. Пиши честно — группа рядом.
      </p>

      <div style={{ marginBottom: 20 }}>
        <PostComposer onPosted={load} />
      </div>

      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <p style={{ color: T.muted, fontSize: 14 }}>Пока пусто. Будь первым — напиши отчёт.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} author={authors[post.user_id]} />
          ))}
        </div>
      )}
    </div>
  );
}
