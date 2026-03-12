import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Case = Tables<"cases">;

export const useCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    const { data } = await supabase.from("cases").select("*").order("created_at", { ascending: false });
    if (data) setCases(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
    const channel = supabase
      .channel("cases-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "cases" }, () => fetchCases())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const addCase = async (c: Omit<Case, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("cases").insert(c);
    return { error };
  };

  const updateCase = async (id: string, updates: Partial<Case>) => {
    const { error } = await supabase.from("cases").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
    return { error };
  };

  const deleteCase = async (id: string) => {
    const { error } = await supabase.from("cases").delete().eq("id", id);
    return { error };
  };

  return { cases, loading, addCase, updateCase, deleteCase, refetch: fetchCases };
};
