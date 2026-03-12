import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type PaymentMethod = Tables<"payment_methods">;

export const usePaymentMethods = (activeOnly = false) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMethods = async () => {
    let query = supabase.from("payment_methods").select("*").order("created_at");
    if (activeOnly) query = query.eq("is_active", true);
    const { data } = await query;
    if (data) setMethods(data);
    setLoading(false);
  };

  useEffect(() => { fetchMethods(); }, []);

  const updateMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    const { error } = await supabase.from("payment_methods").update(updates).eq("id", id);
    return { error };
  };

  return { methods, loading, updateMethod, refetch: fetchMethods };
};
