import { useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, LogIn, FileText, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useApplications } from "@/hooks/useApplications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Memoized InputField
const InputField = memo(({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
  <div>
    <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
    />
  </div>
));

const ApplyForHelp = () => {
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [docError, setDocError] = useState("");

  const { t } = useLanguage();
  const { user } = useAuth();
  const { submitApplication } = useApplications();

  const [form, setForm] = useState({
    name: "",
    cnic: "",
    phone: "",
    address: "",
    city: "",
    income: "",
    details: ""
  });

  const [docFiles, setDocFiles] = useState([]);

  const update = useCallback((key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

const handleCnicChange = (value) => {
  // Remove all non-digits
  let digits = value.replace(/\D/g, "").slice(0, 13); // max 13 digits
  let formatted = "";
  if (digits.length <= 5) {
    formatted = digits;
  } else if (digits.length <= 12) {
    formatted = digits.slice(0, 5) + "-" + digits.slice(5);
  } else {
    formatted = digits.slice(0, 5) + "-" + digits.slice(5, 12) + "-" + digits.slice(12);
  }
  update("cnic", formatted);
};

// Phone input formatter: 0300-1234567
const handlePhoneChange = (value) => {
  let digits = value.replace(/\D/g, "").slice(0, 11); // max 11 digits
  if (digits.length > 4) {
    digits = digits.slice(0, 4) + "-" + digits.slice(4);
  }
  update("phone", digits);
};

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setDocFiles(prev => [...prev, ...files]);
    setDocError("");
  };

  const removeFile = (index) => {
    setDocFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (docFiles.length === 0) {
      setDocError("Please upload at least one document.");
      return;
    }

    setUploading(true);

    const uploadedPaths = [];
    for (let file of docFiles) {
      const path = `${user.id}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from("application-documents")
        .upload(path, file);
      if (error) {
        toast.error("Upload failed");
        setUploading(false);
        return;
      }
      uploadedPaths.push(path);
    }

    const { error: submitError } = await submitApplication({
      user_id: user.id,
      full_name: form.name,
      cnic: form.cnic || null,
      phone: form.phone || null,
      address: form.address || null,
      city: form.city || null,
      income_details: form.income || null,
      document_urls: uploadedPaths
    });

    setUploading(false);
    if (!submitError) {
      setSubmitted(true);
      toast.success(t("apply.submitted"));
    }
  };

  if (submitted) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-primary" />
          </div>
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
          <InputField label={t("apply.fullName")} value={form.name} onChange={val => update("name", val)} placeholder="Muhammad Ali" />
          <InputField label={t("apply.cnic")} value={form.cnic} onChange={handleCnicChange} placeholder="12345-1234567-1" />
          <InputField label={t("apply.phone")} value={form.phone} onChange={handlePhoneChange} placeholder="0300-1234567" />
          <InputField label={t("apply.address")} value={form.address} onChange={val => update("address", val)} placeholder="House #, Street, Area" />
          <InputField label={t("apply.city")} value={form.city} onChange={val => update("city", val)} placeholder="Lahore" />
          <InputField label={t("apply.income")} value={form.income} onChange={val => update("income", val)} placeholder="0" type="number" />

          <label className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer block ${docError ? "border-destructive" : "border-border"}`}>
            <p className="text-sm text-muted-foreground">Upload Documents</p>
            <input type="file" multiple className="hidden" onChange={handleFiles} />
          </label>

          {docFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {docFiles.map((file, index) => {
                const isImage = file.type.startsWith("image/");
                return (
                  <div key={index} className="relative">
                    {isImage ? (
                      <img src={URL.createObjectURL(file)} className="w-16 h-16 object-cover rounded border" />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-secondary rounded border">
                        <FileText size={20} />
                      </div>
                    )}
                    <button onClick={() => removeFile(index)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1">
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {docError && <p className="text-sm text-destructive">{docError}</p>}

          <Button variant="hero" className="w-full mt-4" onClick={handleSubmit} disabled={!form.name || uploading}>
            {uploading ? "Uploading..." : t("apply.submit")}
          </Button>
        </div>
      </div>

      {showLoginPrompt && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-sm text-center">
            <LogIn size={32} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Account Required</h3>
            <div className="flex gap-3 justify-center">
              <Link to="/login"><Button>Sign In</Button></Link>
              <Link to="/login?signup=true"><Button>Create</Button></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyForHelp;