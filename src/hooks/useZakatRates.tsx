import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type ZakatRate = Tables<"zakat_rates">;

export const useZakatRates = () => {
  const [rates, setRates] = useState<ZakatRate | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    const { data } = await supabase.from("zakat_rates").select("*").order("last_updated", { ascending: false }).limit(1).maybeSingle();
    if (data) setRates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const updateRates = async (gold: number, silver: number) => {
    if (!rates) return { error: new Error("No rates record") };
    const { error } = await supabase.from("zakat_rates").update({
      gold_rate_per_gram: gold,
      silver_rate_per_gram: silver,
      is_admin_override: true,
      last_updated: new Date().toISOString(),
    }).eq("id", rates.id);
    return { error };
  };

  return { rates, loading, updateRates, refetch: fetchRates };
};
