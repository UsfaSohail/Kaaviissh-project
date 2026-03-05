import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Check, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const paymentMethods = [
  { name: "Easypaisa", account: "0300-1234567", color: "bg-green-600" },
  { name: "JazzCash", account: "0301-7654321", color: "bg-red-500" },
  { name: "SadaPay", account: "0302-9876543", color: "bg-purple-500" },
];

interface DonateModalProps {
  caseName: string;
  open: boolean;
  onClose: () => void;
}

const DonateModal = ({ caseName, open, onClose }: DonateModalProps) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<typeof paymentMethods[0] | null>(null);
  const [done, setDone] = useState(false);

  const steps = ["Amount", "Payment", "Instructions", "Upload"];

  const canNext = () => {
    if (step === 0) return !!amount && Number(amount) > 0;
    if (step === 1) return !!method;
    return true;
  };

  const handleClose = () => {
    setStep(0);
    setAmount("");
    setMethod(null);
    setDone(false);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card rounded-t-2xl z-10">
            <div>
              <h2 className="text-lg font-bold text-foreground">Donate</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">For:</span>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">{caseName}</span>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>

          <div className="p-5">
            {done ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{t("donate.thanks")}</h3>
                <p className="text-sm text-muted-foreground mb-1">Case: <span className="text-foreground font-medium">{caseName}</span></p>
                <p className="text-sm text-muted-foreground mb-1">Amount: <span className="text-foreground font-medium">Rs. {Number(amount).toLocaleString()}</span></p>
                <p className="text-sm text-muted-foreground">Via: <span className="text-foreground font-medium">{method?.name}</span></p>
                <p className="text-xs text-muted-foreground italic mt-4">{t("donate.thanksMsg")}</p>
                <Button variant="hero" className="mt-6" onClick={handleClose}>Close</Button>
              </motion.div>
            ) : (
              <>
                {/* Step indicators */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}>
                        {i + 1}
                      </div>
                      {i < steps.length - 1 && <div className={`w-5 h-0.5 ${i < step ? "bg-primary" : "bg-secondary"}`} />}
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.15 }}>
                    {step === 0 && (
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-4">{t("donate.amount")}</h3>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 5000" className="w-full px-5 py-4 rounded-xl bg-secondary border border-border text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                        <div className="flex gap-2 mt-4 flex-wrap">
                          {[1000, 2500, 5000, 10000].map((a) => (
                            <button key={a} onClick={() => setAmount(String(a))} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-primary/20 transition-colors">
                              Rs. {a.toLocaleString()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {step === 1 && (
                      <div className="space-y-3">
                        <h3 className="text-base font-semibold text-foreground mb-4">{t("donate.method")}</h3>
                        {paymentMethods.map((m) => (
                          <button key={m.name} onClick={() => setMethod(m)} className={`w-full text-start px-5 py-4 rounded-xl border transition-all flex items-center gap-4 ${method?.name === m.name ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/30"}`}>
                            <div className={`w-3 h-3 rounded-full ${m.color}`} />
                            {m.name}
                          </button>
                        ))}
                      </div>
                    )}
                    {step === 2 && method && (
                      <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-center space-y-4">
                        <h3 className="text-base font-semibold text-foreground">{t("donate.instructions")}</h3>
                        <p className="text-muted-foreground text-sm">Send <span className="text-foreground font-bold">Rs. {Number(amount).toLocaleString()}</span> via <span className="text-foreground font-bold">{method.name}</span></p>
                        <div className="bg-secondary rounded-xl p-4">
                          <p className="text-xs text-muted-foreground mb-1">Account Number</p>
                          <p className="text-xl font-mono text-foreground tracking-wider">{method.account}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Case: <span className="text-primary font-medium">{caseName}</span></p>
                      </div>
                    )}
                    {step === 3 && (
                      <div className="text-center space-y-6">
                        <h3 className="text-base font-semibold text-foreground">{t("donate.upload")}</h3>
                        <div className="border-2 border-dashed border-border rounded-2xl p-10 hover:border-primary/30 transition-colors cursor-pointer">
                          <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
                          <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-between mt-8">
                  <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0} className="text-muted-foreground">
                    <ArrowLeft size={16} /> {t("donate.back")}
                  </Button>
                  {step < 3 ? (
                    <Button variant="hero" onClick={() => setStep(step + 1)} disabled={!canNext()} className="text-sm py-2 px-6">
                      {t("donate.next")} <ArrowRight size={16} />
                    </Button>
                  ) : (
                    <Button variant="hero" onClick={() => setDone(true)} className="text-sm py-2 px-6">
                      {t("donate.submit")}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DonateModal;
