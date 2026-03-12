import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type RationItem = Tables<"ration_bag_items">;

export const useRationBagItems = () => {
  const [items, setItems] = useState<RationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const { data } = await supabase.from("ration_bag_items").select("*").order("created_at");
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const addItem = async (item: Partial<RationItem>) => {
    const { error } = await supabase.from("ration_bag_items").insert({ item_name_en: item.item_name_en || "", ...item });
    return { error };
  };

  const updateItem = async (id: string, updates: Partial<RationItem>) => {
    const { error } = await supabase.from("ration_bag_items").update(updates).eq("id", id);
    return { error };
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("ration_bag_items").delete().eq("id", id);
    return { error };
  };

  return { items, loading, addItem, updateItem, deleteItem, refetch: fetchItems };
};
