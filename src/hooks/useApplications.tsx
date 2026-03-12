import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Application = Tables<"applications">;

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
    if (data) setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
    const channel = supabase
      .channel("applications-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => fetchApplications())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const submitApplication = async (a: Partial<Application>) => {
    const { error } = await supabase.from("applications").insert({ full_name: a.full_name || "", user_id: a.user_id || "", ...a });
    return { error };
  };

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    const { error } = await supabase.from("applications").update(updates).eq("id", id);
    return { error };
  };

  const exportCSV = () => {
    const headers = ["ID", "Name", "CNIC", "Phone", "City", "Status", "Date"];
    const rows = applications.map(a => [a.id, a.full_name, a.cnic, a.phone, a.city, a.status, a.created_at]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url; el.download = "applications.csv"; el.click();
  };

  return { applications, loading, submitApplication, updateApplication, exportCSV, refetch: fetchApplications };
};
