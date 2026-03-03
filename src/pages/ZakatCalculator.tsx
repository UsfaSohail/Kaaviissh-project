import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calculator, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const ZakatCalculator = () => {
  // Simulated rates (would be fetched from API)
  const goldRate = 21500; // PKR per gram
  const silverRate = 265; // PKR per gram
  const nisabSilver = 612.36; // grams
  const nisabValue = nisabSilver * silverRate;

  const [assets, setAssets] = useState({ cash: "", loans: "", investments: "", trade: "" });
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [liabilities, setLiabilities] = useState({ borrowed: "", bills: "", dues: "" });

  const totalAssets = useMemo(() => {
    const a = Object.values(assets).reduce((s, v) => s + (Number(v) || 0), 0);
    const g = (Number(gold) || 0) * goldRate;
    const sv = (Number(silver) || 0) * silverRate;
    return a + g + sv;
  }, [assets, gold, silver]);

  const totalLiabilities = useMemo(() =>
    Object.values(liabilities).reduce((s, v) => s + (Number(v) || 0), 0)
  , [liabilities]);

  const netWorth = totalAssets - totalLiabilities;
  const zakatPayable = netWorth > nisabValue ? netWorth * 0.025 : 0;
  const aboveNisab = netWorth >= nisabValue;

  const InputField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
      />
    </div>
  );

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">Zakat Calculator</h1>
          <p className="text-muted-foreground">Calculate your Zakat obligation with live gold & silver rates.</p>
        </motion.div>

        {/* Rates */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <p className="text-xs text-muted-foreground mb-1">Gold Rate / gram</p>
            <p className="text-xl font-bold text-foreground">Rs. {goldRate.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <p className="text-xs text-muted-foreground mb-1">Silver Rate / gram</p>
            <p className="text-xl font-bold text-foreground">Rs. {silverRate.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mb-8">Updated on: March 3, 2026</p>

        {/* Assets */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> Assets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Cash in Hand / Bank (PKR)" value={assets.cash} onChange={(v) => setAssets({ ...assets, cash: v })} />
            <InputField label="Loans Given (PKR)" value={assets.loans} onChange={(v) => setAssets({ ...assets, loans: v })} />
            <InputField label="Investments (PKR)" value={assets.investments} onChange={(v) => setAssets({ ...assets, investments: v })} />
            <InputField label="Trade Goods (PKR)" value={assets.trade} onChange={(v) => setAssets({ ...assets, trade: v })} />
          </div>
        </div>

        {/* Gold & Silver */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calculator size={18} className="text-primary" /> Gold & Silver
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <InputField label="Gold (grams)" value={gold} onChange={setGold} />
              {Number(gold) > 0 && (
                <p className="text-xs text-primary mt-1">= Rs. {((Number(gold) || 0) * goldRate).toLocaleString()}</p>
              )}
            </div>
            <div>
              <InputField label="Silver (grams)" value={silver} onChange={setSilver} />
              {Number(silver) > 0 && (
                <p className="text-xs text-primary mt-1">= Rs. {((Number(silver) || 0) * silverRate).toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingDown size={18} className="text-destructive" /> Liabilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="Borrowed Money" value={liabilities.borrowed} onChange={(v) => setLiabilities({ ...liabilities, borrowed: v })} />
            <InputField label="Pending Bills" value={liabilities.bills} onChange={(v) => setLiabilities({ ...liabilities, bills: v })} />
            <InputField label="Immediate Dues" value={liabilities.dues} onChange={(v) => setLiabilities({ ...liabilities, dues: v })} />
          </div>
        </div>

        {/* Result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border-2 border-primary/30 rounded-2xl p-8 text-center"
        >
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Net Worth</p>
              <p className="text-2xl font-bold text-foreground">Rs. {Math.max(0, netWorth).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Zakat Payable (2.5%)</p>
              <p className="text-2xl font-bold text-primary">Rs. {zakatPayable.toLocaleString()}</p>
            </div>
          </div>

          <p className={`text-sm font-medium mb-6 ${aboveNisab ? "text-primary" : "text-muted-foreground"}`}>
            {aboveNisab
              ? "✅ You are above the Nisab threshold. Zakat is obligatory."
              : "You are below the Nisab threshold. Zakat is not obligatory."}
          </p>

          <p className="text-xs text-muted-foreground italic mb-6">
            Nisab based on {nisabSilver}g Silver = Rs. {nisabValue.toLocaleString()}
          </p>

          {zakatPayable > 0 && (
            <>
              <p className="text-sm text-muted-foreground italic mb-4">"May your Zakat purify your wealth."</p>
              <Link to="/donate">
                <Button variant="hero">Donate Your Zakat</Button>
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ZakatCalculator;
