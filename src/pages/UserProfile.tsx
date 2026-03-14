import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, History, FileText, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

type Donation = {
  id: string;
  amount: number;
  type: string;
  status: string;
  payment_method: string | null;
  created_at: string;
};

type Application = {
  id: string;
  full_name: string;
  status: string;
  created_at: string;
  city: string | null;
};

const UserProfile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState<"donations" | "applications">("donations");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [donRes, appRes] = await Promise.all([
        supabase.from("donations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("applications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (donRes.data) setDonations(donRes.data as Donation[]);
      if (appRes.data) setApplications(appRes.data as Application[]);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User size={48} className="text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Profile</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your profile.</p>
          <Link to="/login"><Button variant="hero">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{user.user_metadata?.name || "User"}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-8">
          <button onClick={() => setTab("donations")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${tab === "donations" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border hover:text-foreground"}`}>
            <History size={14} /> My Donations
          </button>
          <button onClick={() => setTab("applications")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${tab === "applications" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border hover:text-foreground"}`}>
            <FileText size={14} /> My Applications
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div>
        ) : tab === "donations" ? (
          <div className="space-y-3">
            {donations.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No donations yet.</p>
            ) : donations.map(d => (
              <div key={d.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Rs. {Number(d.amount).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{d.type} • {d.payment_method || "—"} • {new Date(d.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${d.status === "verified" ? "bg-primary/20 text-primary" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No applications yet.</p>
            ) : applications.map(a => (
              <div key={a.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">{a.full_name}</p>
                  <p className="text-xs text-muted-foreground">{a.city || "—"} • {new Date(a.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${a.status === "Approved" ? "bg-primary/20 text-primary" : a.status === "Rejected" ? "bg-destructive/20 text-destructive" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
