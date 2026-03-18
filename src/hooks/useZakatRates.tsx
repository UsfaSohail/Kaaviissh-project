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

  const refreshRates = async () => {
    try {
      // Call the Supabase Edge Function to fetch fresh rates
      const { data, error } = await supabase.functions.invoke('fetch-gold-silver-rates');
      
      if (error) {
        console.error('Error calling fetch-gold-silver-rates:', error);
        return { error };
      }
      
      if (data?.success) {
        // Refetch rates from database after update
        await fetchRates();
        return { success: true };
      }
      
      return { error: new Error('Failed to fetch rates') };
    } catch (error) {
      console.error('Error refreshing rates:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchRates();
    
    // Refresh rates immediately on mount if they're old or don't exist
    const initializeRates = async () => {
      if (!rates) {
        // If no rates exist, try to fetch fresh ones
        await refreshRates();
      } else {
        const lastUpdated = new Date(rates.last_updated);
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        
        if (lastUpdated < twoHoursAgo && !rates.is_admin_override) {
          console.log('Rates are stale, refreshing...');
          await refreshRates();
        }
      }
    };
    
    initializeRates();
    
    // Check and refresh rates every 30 minutes
    const interval = setInterval(async () => {
      if (rates) {
        const lastUpdated = new Date(rates.last_updated);
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        
        if (lastUpdated < thirtyMinutesAgo && !rates.is_admin_override) {
          console.log('Rates are 30+ minutes old, refreshing...');
          await refreshRates();
        }
      }
    }, 30 * 60 * 1000); // Check every 30 minutes
    
    return () => clearInterval(interval);
  }, [rates]);

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

  return { rates, loading, updateRates, refreshRates, refetch: fetchRates };
};
