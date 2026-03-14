import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, LogIn } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ApplyForHelp = () => {
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [docError, setDocError] = useState("");
  const { t } = useLanguage();
  const { user } = useAuth();
  const { submitApplication } = useApplications();
  const [form, setForm] = useState({ name: "", cnic: "", phone: "", address: "", city: "", income: "", details: "" });
  const [docFile, setDocFile] = useState<File | null>(null);

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (!docFile) {
      setDocError("Please upload your supporting documents to proceed.");
      return;
    }
    setDocError("");
    setUploading(true);
    let documentsUrl = "";
    const ext = docFile.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("application-documents").upload(path, docFile);
    if (!error) {
      const { data } = supabase.storage.from("application-documents").getPublicUrl(path);
      documentsUrl = data.publicUrl;
    }
    const { error: submitError } = await submitApplication({
      user_id: user.id,
      full_name: form.name,
      cnic: form.cnic || null,
      phone: form.phone || null,
      address: form.address || null,
      city: form.city || null,
      income_details: form.income || null,
      documents_url: documentsUrl || null,
    });
    setUploading(false);
    if (!submitError) {
      setSubmitted(true);
      toast.success(t("apply.submitted"));
    }
  };

  const InputField = ({ label, field, placeholder, type = "text" }: { label: string; field: string; placeholder: string; type?: string }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <input type={type} value={(form as any)[field]} onChange={(e) => update(field, e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
    </div>
  );

  if (submitted) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"><Check size={32} className="text-primary" /></div>
          <h2 className="text-2xl font-bold text-foreground mb-3">{t("apply.submitted")}</h2>
          <p className="text-muted-foreground">{t("apply.submittedMsg")}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 relative">
      <div className="container mx-auto max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">{t("apply.title")}</h1>
          <p className="text-muted-foreground">{t("apply.subtitle")}</p>
        </motion.div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <InputField label={t("apply.fullName")} field="name" placeholder="Muhammad Ali" />
          <InputField label={t("apply.cnic")} field="cnic" placeholder="12345-1234567-1" />
          <InputField label={t("apply.phone")} field="phone" placeholder="0300-1234567" />
          <InputField label={t("apply.address")} field="address" placeholder="House #, Street, Area" />
          <InputField label={t("apply.city")} field="city" placeholder="Lahore" />
          <InputField label={t("apply.income")} field="income" placeholder="0" type="number" />
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("apply.details")}</label>
            <textarea value={form.details} onChange={(e) => update("details", e.target.value)} placeholder={t("apply.detailsPlaceholder")} rows={4} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none" />
          </div>
          <label className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary/30 transition-colors block ${docError ? "border-destructive" : "border-border"}`}>
            <p className="text-sm text-muted-foreground">{docFile ? docFile.name : t("apply.uploadDocs")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("apply.uploadHint")}</p>
            <input type="file" className="hidden" onChange={e => { setDocFile(e.target.files?.[0] || null); setDocError(""); }} />
          </label>
          {docError && <p className="text-sm text-destructive">{docError}</p>}
          <p className="text-xs text-destructive font-medium">* Document upload is required to submit your application.</p>
          <Button variant="hero" className="w-full mt-4" onClick={handleSubmit} disabled={!form.name || uploading}>
            {uploading ? t("common.loading") : t("apply.submit")}
          </Button>
        </div>
      </div>

      {/* Login prompt overlay */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-border rounded-2xl p-8 max-w-sm text-center">
            <LogIn size={32} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Account Required</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Please create an account or sign in to submit your application.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/login" state={{ returnTo: "/apply" }}>
                <Button variant="hero">Sign In</Button>
              </Link>
              <Link to="/login?signup=true" state={{ returnTo: "/apply" }}>
                <Button variant="heroOutline">Create Account</Button>
              </Link>
            </div>
            <button onClick={() => setShowLoginPrompt(false)} className="mt-4 text-xs text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ApplyForHelp;
