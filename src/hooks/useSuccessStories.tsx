import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SuccessStory = {
  id: string;
  title_en: string;
  title_ur: string;
  description_en: string;
  description_ur: string;
  image_url: string | null;
  completion_date: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export const useSuccessStories = (publishedOnly: boolean = false) => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    let q = (supabase as any).from("success_stories").select("*").order("completion_date", { ascending: false, nullsFirst: false });
    if (publishedOnly) q = q.eq("is_published", true);
    const { data } = await q;
    if (data) setStories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
    const channel = supabase
      .channel("stories-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "success_stories" }, () => fetch())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [publishedOnly]);

  const create = async (s: Partial<SuccessStory>) => {
    const { error } = await (supabase as any).from("success_stories").insert(s);
    return { error };
  };
  const update = async (id: string, updates: Partial<SuccessStory>) => {
    const { error } = await (supabase as any).from("success_stories").update(updates).eq("id", id);
    return { error };
  };
  const remove = async (id: string) => {
    const { error } = await (supabase as any).from("success_stories").delete().eq("id", id);
    return { error };
  };

  return { stories, loading, create, update, remove, refetch: fetch };
};
