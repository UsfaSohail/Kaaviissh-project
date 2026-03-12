import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Donation = Tables<"donations">;

export const useDonations = (userOnly = false) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    const { data } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
    if (data) setDonations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDonations();
    const channel = supabase
      .channel("donations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, () => fetchDonations())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const submitDonation = async (d: Partial<Donation>) => {
    const { error } = await supabase.from("donations").insert({ amount: d.amount || 0, ...d });
    return { error };
  };

  const updateDonation = async (id: string, updates: Partial<Donation>) => {
    const { error } = await supabase.from("donations").update(updates).eq("id", id);
    return { error };
  };

  const exportCSV = () => {
    const headers = ["ID", "Donor", "Email", "Amount", "Type", "Method", "Status", "Date"];
    const rows = donations.map(d => [d.id, d.donor_name, d.donor_email, d.amount, d.type, d.payment_method, d.status, d.created_at]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "donations.csv"; a.click();
  };

  return { donations, loading, submitDonation, updateDonation, exportCSV, refetch: fetchDonations };
};
