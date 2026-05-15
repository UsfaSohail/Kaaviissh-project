import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Volunteer = {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  skills: string | null;
  availability: string | null;
  motivation: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export const useVolunteers = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await (supabase as any)
      .from("volunteer_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setVolunteers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
    const channel = supabase
      .channel("volunteers-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "volunteer_applications" }, () => fetch())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const submit = async (v: Partial<Volunteer>) => {
    const { error } = await (supabase as any).from("volunteer_applications").insert(v);
    return { error };
  };

  const update = async (id: string, updates: Partial<Volunteer>) => {
    const { error } = await (supabase as any).from("volunteer_applications").update(updates).eq("id", id);
    return { error };
  };

  const remove = async (id: string) => {
    const { error } = await (supabase as any).from("volunteer_applications").delete().eq("id", id);
    return { error };
  };

  return { volunteers, loading, submit, update, remove, refetch: fetch };
};
