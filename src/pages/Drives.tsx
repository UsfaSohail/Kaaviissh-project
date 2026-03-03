import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";

type CaseStatus = "all" | "open" | "in-progress" | "completed";

const cases = [
  { id: 1, title: "Ration Drive – Lahore", description: "Monthly ration distribution for 200 families in underserved areas of Lahore.", location: "Lahore", target: 500000, raised: 500000, status: "completed" as const },
  { id: 2, title: "Winter Relief – Quetta", description: "Warm clothing and blankets for families facing harsh winter conditions.", location: "Quetta", target: 300000, raised: 165000, status: "in-progress" as const },
  { id: 3, title: "Flood Relief – Sindh", description: "Emergency food and medical supplies for flood-affected communities.", location: "Sindh", target: 800000, raised: 0, status: "open" as const },
  { id: 4, title: "Ramadan Food Packs", description: "Special Ramadan food packages for families during the holy month.", location: "Karachi", target: 400000, raised: 400000, status: "completed" as const },
  { id: 5, title: "Education Support – KPK", description: "School supplies and uniforms for children in remote KPK villages.", location: "Peshawar", target: 250000, raised: 87500, status: "in-progress" as const },
  { id: 6, title: "Clean Water – Thar", description: "Installing water filtration plants in drought-stricken areas of Tharparkar.", location: "Thar", target: 600000, raised: 0, status: "open" as const },
];

const statusConfig = {
  completed: { label: "Completed", color: "bg-primary text-primary-foreground" },
  "in-progress": { label: "In Progress", color: "bg-yellow-500/20 text-yellow-400" },
  open: { label: "Open", color: "bg-blue-500/20 text-blue-400" },
};

const filters: { label: string; value: CaseStatus }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

const Drives = () => {
  const [filter, setFilter] = useState<CaseStatus>("all");
  const filtered = filter === "all" ? cases : cases.filter((c) => c.status === filter);

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Drives & Cases</h1>
          <p className="text-muted-foreground text-lg">Support ongoing missions or contribute to a specific cause.</p>
        </motion.div>

        {/* Filters */}
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

        {/* Grid */}
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
                className="bg-card rounded-2xl border border-border p-6 relative overflow-hidden group hover:border-primary/30 transition-colors"
              >
                <span className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium ${cfg.color}`}>
                  {cfg.label}
                </span>

                <h3 className="text-lg font-semibold text-foreground mb-2 pr-24">{c.title}</h3>
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
                        c.status === "completed"
                          ? "bg-primary"
                          : c.status === "in-progress"
                          ? "bg-yellow-400"
                          : "bg-blue-400 bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <Link to="/donate">
                  <Button variant="hero" size="sm" className="w-full text-sm py-2 px-4">
                    <Heart size={14} /> Donate Now
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Drives;
