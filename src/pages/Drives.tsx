import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCases } from "@/hooks/useCases";
import { useAuth } from "@/hooks/useAuth";
import DonateModal from "@/components/DonateModal";
import { toast } from "sonner";

type CaseStatus = "all" | "Open" | "In Progress" | "Completed";

const statusConfig: Record<string, { color: string }> = {
  Completed: { color: "bg-primary/20 text-primary" },
  "In Progress": { color: "bg-yellow-500/20 text-yellow-400" },
  Open: { color: "bg-blue-500/20 text-blue-400" },
};

const Drives = () => {
  const [filter, setFilter] = useState<CaseStatus>("all");
  const [donateCaseId, setDonateCaseId] = useState<string | null>(null);
  const [donateCaseName, setDonateCaseName] = useState("");
  const { t, lang } = useLanguage();
  const { cases, loading } = useCases();
  const { user } = useAuth();
  const navigate = useNavigate();

  const filtered = filter === "all" ? cases : cases.filter((c) => c.status === filter);

  const filters: { label: string; value: CaseStatus }[] = [
    { label: t("drives.all"), value: "all" },
    { label: t("drives.open"), value: "Open" },
    { label: t("drives.inprogress"), value: "In Progress" },
    { label: t("drives.completed"), value: "Completed" },
  ];

  const openDonate = (c: any) => {
    if (!user) {
      toast.error("Please sign in to donate.");
      navigate("/login");
      return;
    }
    const title = lang === "ur" && c.title_ur ? c.title_ur : c.title_en;
    setDonateCaseId(c.id);
    setDonateCaseName(title);
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">{t("drives.title")}</h1>
          <p className="text-muted-foreground text-lg">{t("drives.subtitle")}</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {filters.map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === f.value ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">{t("common.loading")}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">{t("drives.noCases")}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c, i) => {
              const progress = Number(c.target_amount) > 0 ? Math.min(100, Math.round((Number(c.raised_amount) / Number(c.target_amount)) * 100)) : 0;
              const cfg = statusConfig[c.status] || statusConfig.Open;
              const title = lang === "ur" && c.title_ur ? c.title_ur : c.title_en;
              const desc = lang === "ur" && c.description_ur ? c.description_ur : c.description_en;
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-2xl border border-border p-6 relative overflow-hidden group transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)] hover:border-l-4 hover:border-l-primary">
                  {c.image_url && <img src={c.image_url} alt={title} className="w-full h-40 object-cover rounded-xl mb-4" />}
                  <span className={`absolute top-4 end-4 text-xs px-3 py-1 rounded-full font-medium ${cfg.color}`}>{c.status}</span>
                  <h3 className="text-lg font-semibold text-foreground mb-2 pe-24">{title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{desc}</p>
                  {c.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                      <MapPin size={12} className="text-primary" /> {c.location}
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Rs. {Number(c.raised_amount).toLocaleString()}</span>
                      <span>Rs. {Number(c.target_amount).toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${c.status === "Completed" ? "bg-primary" : c.status === "In Progress" ? "bg-yellow-400" : "bg-blue-400"}`} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <Button variant="hero" size="sm" className={`w-full text-sm py-2 px-4 ${c.status === "Completed" ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => c.status !== "Completed" && openDonate(c)} disabled={c.status === "Completed"}>
                    <Heart size={14} /> {t("drives.donatenow")}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <DonateModal caseId={donateCaseId || undefined} caseName={donateCaseName} open={!!donateCaseId} onClose={() => { setDonateCaseId(null); setDonateCaseName(""); }} />
    </div>
  );
};

export default Drives;
