import { useState, useMemo, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calculator, TrendingDown, TrendingUp, ShieldCheck, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useZakatRates } from "@/hooks/useZakatRates";

// Memoized InputField to prevent unnecessary re-renders
const InputField = memo(({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
    <input
      type="number"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0"
      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
    />
  </div>
));

const ZakatCalculator = () => {
  const { t } = useLanguage();
  const { rates, loading, refreshRates } = useZakatRates();
  const [refreshing, setRefreshing] = useState(false);

  const goldRate = rates ? Number(rates.gold_rate_per_gram) : 0;
  const silverRate = rates ? Number(rates.silver_rate_per_gram) : 0;
  const nisabSilver = 612.36;
  const nisabValue = nisabSilver * silverRate;
  const lastUpdated = rates?.last_updated ? new Date(rates.last_updated).toLocaleDateString() : "";

  const [assets, setAssets] = useState({ cash: "", loans: "", investments: "", trade: "" });
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [liabilities, setLiabilities] = useState({ borrowed: "", bills: "", dues: "" });

  const handleRefreshRates = async () => {
    setRefreshing(true);
    await refreshRates();
    setRefreshing(false);
  };

  // useMemo for calculated values
  const totalAssets = useMemo(() => {
    const a = Object.values(assets).reduce((s, v) => s + (Number(v) || 0), 0);
    return a + (Number(gold) || 0) * goldRate + (Number(silver) || 0) * silverRate;
  }, [assets, gold, silver, goldRate, silverRate]);

  const totalLiabilities = useMemo(
    () => Object.values(liabilities).reduce((s, v) => s + (Number(v) || 0), 0),
    [liabilities]
  );

  const netWorth = totalAssets - totalLiabilities;
  const zakatPayable = netWorth > nisabValue ? netWorth * 0.025 : 0;
  const aboveNisab = netWorth >= nisabValue;

  // useCallback handlers for inputs to prevent recreation
  const updateAssets = useCallback((key: string, value: string) => {
    setAssets(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateLiabilities = useCallback((key: string, value: string) => {
    setLiabilities(prev => ({ ...prev, [key]: value }));
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">{t("zakat.title")}</h1>
          <p className="text-muted-foreground">{t("zakat.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <p className="text-xs text-muted-foreground mb-1">{t("zakat.goldRate")}</p>
            <p className="text-xl font-bold text-foreground">Rs. {goldRate.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <p className="text-xs text-muted-foreground mb-1">{t("zakat.silverRate")}</p>
            <p className="text-xl font-bold text-foreground">Rs. {silverRate.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 mb-8">
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/20">
            <ShieldCheck size={16} className="text-primary flex-shrink-0" />
            <p className="text-xs text-primary font-medium">{t("zakat.ratesVerified")}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Last Updated: {lastUpdated}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefreshRates} 
              disabled={refreshing}
              className="h-6 px-2 text-xs"
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Updating..." : "Refresh"}
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> {t("zakat.assets")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label={t("zakat.cash")} value={assets.cash} onChange={v => updateAssets("cash", v)} />
            <InputField label={t("zakat.loans")} value={assets.loans} onChange={v => updateAssets("loans", v)} />
            <InputField label={t("zakat.investments")} value={assets.investments} onChange={v => updateAssets("investments", v)} />
            <InputField label={t("zakat.trade")} value={assets.trade} onChange={v => updateAssets("trade", v)} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calculator size={18} className="text-primary" /> {t("zakat.goldsilver")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <InputField label={t("zakat.goldGrams")} value={gold} onChange={setGold} />
              {Number(gold) > 0 && <p className="text-xs text-primary mt-1">= Rs. {((Number(gold) || 0) * goldRate).toLocaleString()}</p>}
            </div>
            <div>
              <InputField label={t("zakat.silverGrams")} value={silver} onChange={setSilver} />
              {Number(silver) > 0 && <p className="text-xs text-primary mt-1">= Rs. {((Number(silver) || 0) * silverRate).toLocaleString()}</p>}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingDown size={18} className="text-destructive" /> {t("zakat.liabilities")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label={t("zakat.borrowed")} value={liabilities.borrowed} onChange={v => updateLiabilities("borrowed", v)} />
            <InputField label={t("zakat.bills")} value={liabilities.bills} onChange={v => updateLiabilities("bills", v)} />
            <InputField label={t("zakat.dues")} value={liabilities.dues} onChange={v => updateLiabilities("dues", v)} />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border-2 border-primary/30 rounded-2xl p-8 text-center">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t("zakat.networth")}</p>
              <p className="text-2xl font-bold text-foreground">Rs. {Math.max(0, netWorth).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t("zakat.payable")}</p>
              <p className="text-2xl font-bold text-primary">Rs. {zakatPayable.toLocaleString()}</p>
            </div>
          </div>
          <p className={`text-sm font-medium mb-6 ${aboveNisab ? "text-primary" : "text-muted-foreground"}`}>
            {aboveNisab ? t("zakat.above") : t("zakat.below")}
          </p>
          <p className="text-xs text-muted-foreground italic mb-6">
            {t("zakat.nisabNote", { grams: nisabSilver.toString(), value: nisabValue.toLocaleString() })}
          </p>
          {zakatPayable > 0 && <Link to="/donate"><Button variant="hero">{t("zakat.donatezakat")}</Button></Link>}
        </motion.div>
      </div>
    </div>
  );
};

export default ZakatCalculator;