import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useImpactCounter } from "@/hooks/useImpactCounter";
import { toast } from "sonner";

const ImpactCounterEditor = () => {
  const { impact, loading, updateImpact } = useImpactCounter();
  const [form, setForm] = useState({ families_helped: 0, ration_bags_distributed: 0, zakat_collected: 0, total_donations: 0, volunteers_count: 0 });

  useEffect(() => {
    if (impact) setForm({
      families_helped: impact.families_helped,
      ration_bags_distributed: impact.ration_bags_distributed,
      zakat_collected: Number(impact.zakat_collected),
      total_donations: Number(impact.total_donations),
      volunteers_count: impact.volunteers_count,
    });
  }, [impact]);

  const handleSave = async () => {
    const { error } = await updateImpact(form);
    if (!error) toast.success("Impact counter updated");
  };

  const fields = [
    { label: "Families Helped", key: "families_helped" },
    { label: "Ration Bags Distributed", key: "ration_bags_distributed" },
    { label: "Zakat Collected (PKR)", key: "zakat_collected" },
    { label: "Total Donations (PKR)", key: "total_donations" },
    { label: "Volunteers", key: "volunteers_count" },
  ] as const;

  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-2xl font-bold text-foreground">Impact Counter</h2>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
            <input type="number" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
          </div>
        ))}
        <Button onClick={handleSave} className="w-full">Save Changes</Button>
      </div>
    </div>
  );
};

export default ImpactCounterEditor;
