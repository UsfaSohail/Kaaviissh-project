import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Check, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useDonations } from "@/hooks/useDonations";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DonateModalProps {
  caseName: string;
  caseId?: string;
  open: boolean;
  onClose: () => void;
}

const DonateModal = ({ caseName, caseId, open, onClose }: DonateModalProps) => {
  const { t } = useLanguage();
  const { methods } = usePaymentMethods(true);
  const { submitDonation } = useDonations();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<any>(null);
  const [done, setDone] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState("");
  const [uploading, setUploading] = useState(false);

  const steps = ["Amount", "Payment", "Instructions", "Upload"];

  const canNext = () => {
    if (step === 0) return !!amount && Number(amount) > 0;
    if (step === 1) return !!method;
    return true;
  };

  const handleClose = () => {
    setStep(0); setAmount(""); setMethod(null); setDone(false); setScreenshotFile(null); setScreenshotError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!screenshotFile) {
      setScreenshotError("Please upload your payment screenshot to proceed.");
      return;
    }
    setScreenshotError("");
    setUploading(true);
    let screenshotUrl = "";
    const ext = screenshotFile.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("donation-screenshots").upload(path, screenshotFile);
    if (!error) {
      const { data } = supabase.storage.from("donation-screenshots").getPublicUrl(path);
      screenshotUrl = data.publicUrl;
    }
    await submitDonation({
      amount: Number(amount),
      type: "Case Specific",
      payment_method: method?.method_name,
      screenshot_url: screenshotUrl || null,
      user_id: user?.id || null,
      case_id: caseId || null,
    });

    // Update case raised_amount
    if (caseId) {
      const { data: caseData } = await supabase.from("cases").select("raised_amount").eq("id", caseId).maybeSingle();
      if (caseData) {
        const newAmount = Number(caseData.raised_amount) + Number(amount);
        await supabase.from("cases").update({ raised_amount: newAmount, updated_at: new Date().toISOString() }).eq("id", caseId);
      }
    }

    setUploading(false);
    setDone(true);
    toast.success(t("donate.thanks"));
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={handleClose}>
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card rounded-t-2xl z-10">
            <div>
              <h2 className="text-lg font-bold text-foreground">{t("donate.title")}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{t("donate.forCase")}:</span>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">{caseName}</span>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"><X size={20} /></button>
          </div>

          <div className="p-5">
            {done ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"><Check size={32} className="text-primary" /></div>
                <h3 className="text-xl font-bold text-foreground mb-2">{t("donate.thanks")}</h3>
                <p className="text-xs text-muted-foreground italic mt-4">{t("donate.thanksMsg")}</p>
                <Button variant="hero" className="mt-6" onClick={handleClose}>{t("donate.close")}</Button>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1 mb-6">
                  {steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{i + 1}</div>
                      {i < steps.length - 1 && <div className={`w-5 h-0.5 ${i < step ? "bg-primary" : "bg-secondary"}`} />}
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.15 }}>
                    {step === 0 && (
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-4">{t("donate.amount")}</h3>
                        <input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 5000" className="w-full px-5 py-4 rounded-xl bg-secondary border border-border text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                        <div className="flex gap-2 mt-4 flex-wrap">
                          {[1000, 2500, 5000, 10000].map((a) => (
                            <button key={a} onClick={() => setAmount(String(a))} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-primary/20 transition-colors">Rs. {a.toLocaleString()}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {step === 1 && (
                      <div className="space-y-3">
                        <h3 className="text-base font-semibold text-foreground mb-4">{t("donate.method")}</h3>
                        {methods.map((m) => (
                          <button key={m.id} onClick={() => setMethod(m)} className={`w-full text-start px-5 py-4 rounded-xl border transition-all flex items-center gap-4 ${method?.id === m.id ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/30"}`}>
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <div>
                              <p className="font-medium">{m.method_name}</p>
                              <p className="text-xs text-muted-foreground">{m.account_title}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {step === 2 && method && (
                      <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-center space-y-4">
                        <h3 className="text-base font-semibold text-foreground">{t("donate.instructions")}</h3>
                        <p className="text-muted-foreground text-sm">{t("donate.sendVia", { amount: `Rs. ${Number(amount).toLocaleString()}`, method: method.method_name })}</p>
                        <div className="bg-secondary rounded-xl p-4 space-y-2">
                          <div><p className="text-xs text-muted-foreground">{t("donate.accountTitle")}</p><p className="text-foreground font-medium">{method.account_title}</p></div>
                          {method.phone_number && <div><p className="text-xs text-muted-foreground">{t("donate.accountNumber")}</p><p className="text-lg font-mono text-foreground tracking-wider">{method.phone_number}</p></div>}
                          {method.iban && <div><p className="text-xs text-muted-foreground">{t("donate.iban")}</p><p className="text-xs font-mono text-foreground">{method.iban}</p></div>}
                        </div>
                      </div>
                    )}
                    {step === 3 && (
                      <div className="text-center space-y-6">
                        <h3 className="text-base font-semibold text-foreground">{t("donate.upload")}</h3>
                        <label className={`border-2 border-dashed rounded-2xl p-10 hover:border-primary/30 transition-colors cursor-pointer block ${screenshotError ? "border-destructive" : "border-border"}`}>
                          <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
                          <p className="text-sm text-muted-foreground">{screenshotFile ? screenshotFile.name : t("donate.uploadHint")}</p>
                          <input type="file" accept="image/*" className="hidden" onChange={e => { setScreenshotFile(e.target.files?.[0] || null); setScreenshotError(""); }} />
                        </label>
                        {screenshotError && <p className="text-sm text-destructive">{screenshotError}</p>}
                        <p className="text-xs text-destructive font-medium">* Screenshot is required to submit your donation.</p>
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
                    <Button variant="hero" onClick={handleSubmit} disabled={uploading} className="text-sm py-2 px-6">
                      {uploading ? t("common.loading") : t("donate.submit")}
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
