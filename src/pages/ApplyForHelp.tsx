import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const ApplyForHelp = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", cnic: "", phone: "", address: "", city: "", income: "", details: "",
  });

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const InputField = ({ label, field, placeholder, type = "text" }: { label: string; field: string; placeholder: string; type?: string }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <input
        type={type}
        value={(form as any)[field]}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
      />
    </div>
  );

  if (submitted) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Application Submitted</h2>
          <p className="text-muted-foreground">Your application has been received. Our team will review it and get back to you shortly, InshAllah.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">Apply for Help</h1>
          <p className="text-muted-foreground">If you or your family need assistance, please fill out this form. Login is required.</p>
        </motion.div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <InputField label="Full Name" field="name" placeholder="Muhammad Ali" />
          <InputField label="CNIC Number" field="cnic" placeholder="12345-1234567-1" />
          <InputField label="Phone Number" field="phone" placeholder="0300-1234567" />
          <InputField label="Address" field="address" placeholder="House #, Street, Area" />
          <InputField label="City" field="city" placeholder="Lahore" />
          <InputField label="Monthly Income (PKR)" field="income" placeholder="0" type="number" />
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Additional Details</label>
            <textarea
              value={form.details}
              onChange={(e) => update("details", e.target.value)}
              placeholder="Describe your situation briefly..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            />
          </div>

          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/30 transition-colors">
            <p className="text-sm text-muted-foreground">Upload supporting documents (CNIC, utility bills, etc.)</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG — Max 5MB</p>
          </div>

          <Button variant="hero" className="w-full mt-4" onClick={() => setSubmitted(true)}>
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplyForHelp;
