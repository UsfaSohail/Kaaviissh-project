import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useZakatRates } from "@/hooks/useZakatRates";
import { toast } from "sonner";

const ZakatRatesManager = () => {
  const { rates, loading, updateRates } = useZakatRates();
  const [gold, setGold] = useState(0);
  const [silver, setSilver] = useState(0);

  useEffect(() => {
    if (rates) {
      setGold(Number(rates.gold_rate_per_gram));
      setSilver(Number(rates.silver_rate_per_gram));
    }
  }, [rates]);

  const handleSave = async () => {
    const { error } = await updateRates(gold, silver);
    if (!error) toast.success("Zakat rates updated");
  };

  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-2xl font-bold text-foreground">Zakat Rates</h2>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        {rates && (
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(rates.last_updated).toLocaleString()}
            {rates.is_admin_override && " (Admin override)"}
          </p>
        )}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Gold Rate / gram (PKR)</label>
          <input type="number" value={gold} onChange={e => setGold(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Silver Rate / gram (PKR)</label>
          <input type="number" value={silver} onChange={e => setSilver(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
        </div>
        <Button onClick={handleSave} className="w-full">Save Override</Button>
      </div>
    </div>
  );
};

export default ZakatRatesManager;
