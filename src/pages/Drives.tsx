import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import DonateModal from "@/components/DonateModal";

type CaseStatus = "all" | "open" | "in-progress" | "completed";

const cases = [
  {
    id: 1,
    title: "Ramadan Drive",
    description: "Distribute cash envelopes of Rs. 5k–6k to 12+ families for customized needs.",
    location: "Lahore",
    target: 70000,
    raised: 20000,
    status: "open" as const,
  },
  {
    id: 2,
    title: "Medical: DVT Surgery",
    description: "Life-saving surgery for a young mother of two diagnosed with Deep Vein Thrombosis.",
    location: "Lahore",
    target: 27000,
    raised: 0,
    status: "open" as const,
  },
  {
    id: 3,
    title: "ICU Support",
    description: "Assistance for hospital expenditures for a man previously in critical condition.",
    location: "Lahore",
    target: 50000,
    raised: 50000,
    status: "completed" as const,
  },
  {
    id: 4,
    title: "Ration & Rent",
    description: "Supporting a family with an unemployed head for rent, food, and baby milk.",
    location: "Lahore",
    target: 35000,
    raised: 0,
    status: "open" as const,
  },
  {
    id: 5,
    title: "Stray Cat Welfare",
    description: "Community-led initiative for feeding and medical care of local stray cats.",
    location: "Lahore",
    target: 15000,
    raised: 2500,
    status: "in-progress" as const,
  },
  {
    id: 6,
    title: "Bulk Ration Bags",
    description: "Distribution of comprehensive ration bags valued at Rs. 10,000 each.",
    location: "Lahore",
    target: 100000,
    raised: 0,
    status: "open" as const,
  },
];

const statusConfig = {
  completed: { label: "Completed", color: "bg-primary text-primary-foreground" },
  "in-progress": { label: "In Progress", color: "bg-yellow-500/20 text-yellow-400" },
  open: { label: "Open", color: "bg-blue-500/20 text-blue-400" },
};

const Drives = () => {
  const [filter, setFilter] = useState<CaseStatus>("all");
  const [donateCase, setDonateCase] = useState<string | null>(null);
  const { t } = useLanguage();
  const filtered = filter === "all" ? cases : cases.filter((c) => c.status === filter);

  const filters: { label: string; value: CaseStatus }[] = [
    { label: t("drives.all"), value: "all" },
    { label: t("drives.open"), value: "open" },
    { label: t("drives.inprogress"), value: "in-progress" },
    { label: t("drives.completed"), value: "completed" },
  ];

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">{t("drives.title")}</h1>
          <p className="text-muted-foreground text-lg">{t("drives.subtitle")}</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c, i) => {
            const progress = Math.round((c.raised / c.target) * 100);
            const cfg = statusConfig[c.status];
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-border p-6 relative overflow-hidden group
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)]
                  hover:border-l-4 hover:border-l-primary hover:border-t-border hover:border-r-border hover:border-b-border"
              >
                <span className={`absolute top-4 end-4 text-xs px-3 py-1 rounded-full font-medium transition-transform duration-300 group-hover:scale-110 ${cfg.color}`}>
                  {cfg.label}
                </span>

                <h3 className="text-lg font-semibold text-foreground mb-2 pe-24">{c.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{c.description}</p>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <MapPin size={12} className="text-primary" />
                  {c.location}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Rs. {c.raised.toLocaleString()}</span>
                    <span>Rs. {c.target.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        c.status === "completed" ? "bg-primary" : c.status === "in-progress" ? "bg-yellow-400" : "bg-blue-400"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="sm"
                  className={`w-full text-sm py-2 px-4 ${c.status === "completed" ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => c.status !== "completed" && setDonateCase(c.title)}
                  disabled={c.status === "completed"}
                  style={c.status === "completed" ? { cursor: "not-allowed" } : {}}
                >
                  <Heart size={14} /> {t("drives.donatenow")}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <DonateModal
        caseName={donateCase || ""}
        open={!!donateCase}
        onClose={() => setDonateCase(null)}
      />
    </div>
  );
};

export default Drives;
