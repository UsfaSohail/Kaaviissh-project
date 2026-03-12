import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Impact = Tables<"impact_counter">;

export const useImpactCounter = () => {
  const [impact, setImpact] = useState<Impact | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchImpact = async () => {
    const { data } = await supabase.from("impact_counter").select("*").limit(1).maybeSingle();
    if (data) setImpact(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchImpact();
    const channel = supabase
      .channel("impact-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "impact_counter" }, () => fetchImpact())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateImpact = async (updates: Partial<Impact>) => {
    if (!impact) return { error: new Error("No impact record") };
    const { error } = await supabase.from("impact_counter").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", impact.id);
    return { error };
  };

  return { impact, loading, updateImpact, refetch: fetchImpact };
};
