import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type BlogPost = Tables<"blog_posts">;

export const useBlogs = (publishedOnly = true) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (publishedOnly) query = query.eq("is_published", true);
    const { data } = await query;
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    const channel = supabase
      .channel("blogs-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "blog_posts" }, () => fetchPosts())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const addPost = async (p: Partial<BlogPost>) => {
    const { error } = await supabase.from("blog_posts").insert({ title_en: p.title_en || "", ...p });
    return { error };
  };

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    const { error } = await supabase.from("blog_posts").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
    return { error };
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    return { error };
  };

  return { posts, loading, addPost, updatePost, deletePost, refetch: fetchPosts };
};
