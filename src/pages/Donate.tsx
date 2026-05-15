import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, Upload } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useDonations } from "@/hooks/useDonations";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const donationTypes = [
  { key: "Ration", labelKey: "donate.typeRation" },
  { key: "Zakat", labelKey: "donate.typeZakat" },
  { key: "Case Specific", labelKey: "donate.typeCaseSpecific" },
  { key: "Custom", labelKey: "donate.typeCustom" },
];

const Donate = () => {
  const [searchParams] = useSearchParams();
  const preType = searchParams.get("type") || "";
  const preAmount = searchParams.get("amount") || "";

  const initialStep = preType ? 1 : 0;

  const [step, setStep] = useState(initialStep);
  const [type, setType] = useState(preType);
  const [amount, setAmount] = useState(preAmount);
  const [method, setMethod] = useState<any>(null);
  const [done, setDone] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState("");
  const [uploading, setUploading] = useState(false);

  const { t } = useLanguage();
  const { methods } = usePaymentMethods(true);
  const { submitDonation } = useDonations();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-500 mb-4">You must sign in to donate.</p>
        <Link to="/login">
          <Button variant="hero">Sign In</Button>
        </Link>
      </div>
    );
  }

  const steps = ["Type", "Amount", "Payment", "Instructions", "Upload"];

  const canNext = () => {
    if (step === 0) return !!type;
    if (step === 1) return !!amount && Number(amount) > 0;
    if (step === 2) return !!method;
    return true;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to donate");
      return;
    }

    if (!screenshotFile) {
      setScreenshotError("Please upload your payment screenshot to proceed.");
      return;
    }

    setScreenshotError("");
    setUploading(true);

    let screenshotUrl = "";
    const ext = screenshotFile.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("donation-screenshots")
      .upload(path, screenshotFile);

    if (!uploadError) {
      const { data } = supabase.storage.from("donation-screenshots").getPublicUrl(path);
      screenshotUrl = data?.publicUrl || "";
    }

    await submitDonation({
      amount: Number(amount),
      type,
      payment_method: method?.method_name,
      donor_name: donorName || null,
      donor_email: donorEmail || null,
      screenshot_url: screenshotUrl || null,
      user_id: user?.id || null,
    });

    setUploading(false);
    setDone(true);
    toast.success(t("donate.thanks"));
  };

  const downloadReceipt = () => {
    if (!user) return;

    const formattedAmount = Number(amount).toLocaleString("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    });

    const receiptData = `
Donation Receipt
---------------------
Donor: ${donorName || user.email}
Email: ${donorEmail || user.email}
Type: ${type}
Amount: ${formattedAmount}
Payment Method: ${method?.method_name || "-"}
Date: ${new Date().toLocaleString("en-PK")}
`;

    const blob = new Blob([receiptData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `donation_receipt_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (done) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">{t("donate.thanks")}</h2>
          <p className="text-muted-foreground italic mb-6">{t("donate.thanksMsg")}</p>
          <Button variant="hero" onClick={downloadReceipt}>
            Download Receipt
          </Button>
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{i + 1}</div>
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
                  <button key={dt.key} onClick={() => setType(dt.key)} className={`w-full text-start px-5 py-4 rounded-xl border transition-all ${type === dt.key ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/30"}`}>
                    {t(dt.labelKey)}
                  </button>
                ))}
              </div>
            )}
            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">{t("donate.amount")}</h2>
                <input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 5000" className="w-full px-5 py-4 rounded-xl bg-card border border-border text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                <div className="flex gap-2 mt-4 flex-wrap">
                  {[1000, 2500, 5000, 10000].map((a) => (
                    <button key={a} onClick={() => setAmount(String(a))} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-primary/20 transition-colors">Rs. {a.toLocaleString()}</button>
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  <input placeholder={t("donate.donorName")} value={donorName} onChange={e => setDonorName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input placeholder={t("donate.donorEmail")} value={donorEmail} onChange={e => setDonorEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground mb-4">{t("donate.method")}</h2>
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
            {step === 3 && method && (
              <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
                <h2 className="text-lg font-semibold text-foreground">{t("donate.instructions")}</h2>
                <p className="text-muted-foreground text-sm">
                  {t("donate.sendVia", { amount: `Rs. ${Number(amount).toLocaleString()}`, method: method.method_name })}
                </p>
                <div className="bg-secondary rounded-xl p-4 space-y-2">
                  <div><p className="text-xs text-muted-foreground">{t("donate.accountTitle")}</p><p className="text-foreground font-medium">{method.account_title}</p></div>
                  {method.phone_number && <div><p className="text-xs text-muted-foreground">{t("donate.accountNumber")}</p><p className="text-lg font-mono text-foreground tracking-wider">{method.phone_number}</p></div>}
                  {method.iban && <div><p className="text-xs text-muted-foreground">{t("donate.iban")}</p><p className="text-xs font-mono text-foreground">{method.iban}</p></div>}
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="text-center space-y-6">
                <h2 className="text-lg font-semibold text-foreground">{t("donate.upload")}</h2>
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

        <div className="flex justify-between mt-10">
          <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0 || (preType && step === 1)} className="text-muted-foreground">
            <ArrowLeft size={16} /> {t("donate.back")}
          </Button>
          {step < 4 ? (
            <Button variant="hero" onClick={() => setStep(step + 1)} disabled={!canNext()} className="text-sm py-2 px-6">
              {t("donate.next")} <ArrowRight size={16} />
            </Button>
          ) : (
            <Button variant="hero" onClick={handleSubmit} disabled={uploading} className="text-sm py-2 px-6">
              {uploading ? t("common.loading") : t("donate.submit")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donate;
