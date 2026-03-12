import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type SiteContent = Tables<"site_content">;

export const useSiteContent = () => {
  const [content, setContent] = useState<Record<string, SiteContent>>({});
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    const { data } = await supabase.from("site_content").select("*");
    if (data) {
      const map: Record<string, SiteContent> = {};
      data.forEach(item => { map[item.key] = item; });
      setContent(map);
    }
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, []);

  const getValue = (key: string, lang: "en" | "ur" = "en"): string => {
    const item = content[key];
    if (!item) return "";
    return lang === "ur" ? item.value_ur : item.value_en;
  };

  const updateContent = async (id: string, updates: Partial<SiteContent>) => {
    const { error } = await supabase.from("site_content").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
    return { error };
  };

  const allContent = Object.values(content);

  return { content, allContent, loading, getValue, updateContent, refetch: fetchContent };
};
