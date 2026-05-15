import { useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, LogIn, HandHeart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useVolunteers } from "@/hooks/useVolunteers";
import { toast } from "sonner";

const InputField = memo(
  ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    textarea,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    textarea?: boolean;
  }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      )}
    </div>
  )
);
InputField.displayName = "VolunteerInput";

const Volunteer = () => {
  const { user } = useAuth();
  const { submit } = useVolunteers();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: user?.email || "",
    phone: "",
    city: "",
    skills: "",
    availability: "",
    motivation: "",
  });

  const update = useCallback((k: string, v: string) => setForm((p) => ({ ...p, [k]: v })), []);

  const handleSubmit = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (!form.full_name || !form.email) {
      toast.error("Please fill required fields");
      return;
    }
    setLoading(true);
    const { error } = await submit({ ...form, user_id: user.id });
    setLoading(false);
    if (error) {
      toast.error("Submission failed");
    } else {
      setSubmitted(true);
      toast.success("Application submitted!");
    }
  };

  if (submitted) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Thank you!</h2>
          <p className="text-muted-foreground">
            Your volunteer application has been received. We will reach out to shortlisted applicants soon.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 relative">
      <div className="container mx-auto max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <HandHeart size={14} /> Join Us
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Apply as a Volunteer</h1>
          <p className="text-muted-foreground">Help us serve the community. Tell us a bit about yourself.</p>
        </motion.div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-lg">
          <InputField label="Full Name" value={form.full_name} onChange={(v) => update("full_name", v)} placeholder="Your full name" />
          <InputField label="Email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@example.com" type="email" />
          <InputField label="Phone Number" value={form.phone} onChange={(v) => update("phone", v)} placeholder="0300-1234567" />
          <InputField label="City" value={form.city} onChange={(v) => update("city", v)} placeholder="Lahore" />
          <InputField label="Skills" value={form.skills} onChange={(v) => update("skills", v)} placeholder="e.g. Teaching, Design, Logistics" textarea />
          <InputField
            label="Availability"
            value={form.availability}
            onChange={(v) => update("availability", v)}
            placeholder="e.g. Weekends, 5 hours/week"
          />
          <InputField
            label="Why do you want to volunteer?"
            value={form.motivation}
            onChange={(v) => update("motivation", v)}
            placeholder="Share your motivation..."
            textarea
          />

          <Button variant="hero" className="w-full mt-2" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>

      {showLoginPrompt && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-sm text-center">
            <LogIn size={32} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Account Required</h3>
            <p className="text-sm text-muted-foreground mb-4">Please sign in to apply as a volunteer.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
              <Link to="/login?signup=true">
                <Button variant="outline">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteer;
