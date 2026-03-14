import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminProfile = () => {
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    // EMAIL CHANGE
    if (email !== user?.email) {
      if (!oldPassword) {
        toast.error("Enter current password to change email.");
        setLoading(false);
        return;
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: oldPassword,
      });

      if (loginError) {
        toast.error("Incorrect current password.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ email });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Verification email sent to new address.");
    }

    // PASSWORD CHANGE
    if (newPassword) {
      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Password updated successfully.");
    }

    setLoading(false);
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-bold text-foreground">Admin</h2>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-5"
      >
        {/* Email */}
        <div>
          <label className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
            <Mail size={16} /> Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {/* Old Password */}
        <div>
          <label className="text-sm text-muted-foreground mb-1">
            Current Password (required for email change)
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
            <Lock size={16} /> New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <Button
          variant="hero"
          onClick={handleSave}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </motion.div>
    </div>
  );
};

export default AdminProfile;