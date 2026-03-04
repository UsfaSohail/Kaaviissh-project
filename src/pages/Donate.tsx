import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const donationTypes = ["Ration", "Zakat", "Case Specific", "Custom Amount"];
const paymentMethods = [
  { name: "Easypaisa", account: "0300-1234567", color: "bg-green-600" },
  { name: "JazzCash", account: "0301-7654321", color: "bg-red-500" },
  { name: "SadaPay", account: "0302-9876543", color: "bg-purple-500" },
];

const steps = ["Type", "Amount", "Payment", "Instructions", "Upload"];

const Donate = () => {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<typeof paymentMethods[0] | null>(null);
  const [done, setDone] = useState(false);
  const { t } = useLanguage();

  const canNext = () => {
    if (step === 0) return !!type;
    if (step === 1) return !!amount && Number(amount) > 0;
    if (step === 2) return !!method;
    return true;
  };

  if (done) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">{t("donate.thanks")}</h2>
          <p className="text-muted-foreground italic">{t("donate.thanksMsg")}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-lg">
        <h1 className="text-3xl font-bold text-foreground text-center mb-2">{t("donate.title")}</h1>
        <p className="text-center text-muted-foreground mb-10">{t("donate.subtitle")}</p>

        <div className="flex items-center justify-center gap-1 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-6 h-0.5 ${i < step ? "bg-primary" : "bg-secondary"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {step === 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground mb-4">{t("donate.choosetype")}</h2>
                {donationTypes.map((dt) => (
                  <button key={dt} onClick={() => setType(dt)} className={`w-full text-start px-5 py-4 rounded-xl border transition-all ${type === dt ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/30"}`}>
                    {dt}
                  </button>
                ))}
              </div>
            )}
            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">{t("donate.amount")}</h2>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 5000" className="w-full px-5 py-4 rounded-xl bg-card border border-border text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                <div className="flex gap-2 mt-4 flex-wrap">
                  {[1000, 2500, 5000, 10000].map((a) => (
                    <button key={a} onClick={() => setAmount(String(a))} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-primary/20 transition-colors">
                      Rs. {a.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground mb-4">{t("donate.method")}</h2>
                {paymentMethods.map((m) => (
                  <button key={m.name} onClick={() => setMethod(m)} className={`w-full text-start px-5 py-4 rounded-xl border transition-all flex items-center gap-4 ${method?.name === m.name ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/30"}`}>
                    <div className={`w-3 h-3 rounded-full ${m.color}`} />
                    {m.name}
                  </button>
                ))}
              </div>
            )}
            {step === 3 && method && (
              <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
                <h2 className="text-lg font-semibold text-foreground">{t("donate.instructions")}</h2>
                <p className="text-muted-foreground text-sm">Send <span className="text-foreground font-bold">Rs. {Number(amount).toLocaleString()}</span> via <span className="text-foreground font-bold">{method.name}</span></p>
                <div className="bg-secondary rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Account Number</p>
                  <p className="text-xl font-mono text-foreground tracking-wider">{method.account}</p>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="text-center space-y-6">
                <h2 className="text-lg font-semibold text-foreground">{t("donate.upload")}</h2>
                <div className="border-2 border-dashed border-border rounded-2xl p-10 hover:border-primary/30 transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-10">
          <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0} className="text-muted-foreground">
            <ArrowLeft size={16} /> {t("donate.back")}
          </Button>
          {step < 4 ? (
            <Button variant="hero" onClick={() => setStep(step + 1)} disabled={!canNext()} className="text-sm py-2 px-6">
              {t("donate.next")} <ArrowRight size={16} />
            </Button>
          ) : (
            <Button variant="hero" onClick={() => setDone(true)} className="text-sm py-2 px-6">
              {t("donate.submit")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donate;
