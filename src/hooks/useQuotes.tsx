import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Quote = Tables<"quotes">;

export const useQuotes = (activeOnly = true) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    let query = supabase.from("quotes").select("*").order("created_at", { ascending: false });
    if (activeOnly) query = query.eq("is_active", true);
    const { data } = await query;
    if (data) setQuotes(data);
    setLoading(false);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const addQuote = async (q: Partial<Quote>) => {
    const { error } = await supabase.from("quotes").insert({ text_en: q.text_en || "", ...q });
    return { error };
  };

  const updateQuote = async (id: string, updates: Partial<Quote>) => {
    const { error } = await supabase.from("quotes").update(updates).eq("id", id);
    return { error };
  };

  const deleteQuote = async (id: string) => {
    const { error } = await supabase.from("quotes").delete().eq("id", id);
    return { error };
  };

  return { quotes, loading, addQuote, updateQuote, deleteQuote, refetch: fetchQuotes };
};
