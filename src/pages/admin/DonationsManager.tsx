import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDonations } from "@/hooks/useDonations";
import { Check, Download, Eye } from "lucide-react";
import { toast } from "sonner";

const DonationsManager = () => {
  const { donations, loading, updateDonation, exportCSV } = useDonations();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewScreenshot, setViewScreenshot] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === donations.length) setSelected(new Set());
    else setSelected(new Set(donations.map(d => d.id)));
  };

  const exportSelected = () => {
    const filtered = selected.size > 0 ? donations.filter(d => selected.has(d.id)) : donations;
    const headers = ["ID", "Donor", "Email", "Amount", "Type", "Method", "Status", "Date"];
    const rows = filtered.map(d => [d.id, d.donor_name, d.donor_email, d.amount, d.type, d.payment_method, d.status, d.created_at]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "donations.csv"; a.click();
  };

  const verify = async (id: string) => {
    const { error } = await updateDonation(id, { status: "verified" });
    if (!error) toast.success("Donation verified");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Donations Manager</h2>
        <Button variant="outline" onClick={exportSelected} className="gap-2">
          <Download size={16} /> Export {selected.size > 0 ? `(${selected.size})` : "All"} CSV
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50">
            <th className="p-3 w-10">
              <input type="checkbox" checked={selected.size === donations.length && donations.length > 0} onChange={toggleAll} className="accent-primary" />
            </th>
            <th className="text-start p-3 text-muted-foreground font-medium">Donor</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Amount</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Type</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Method</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Status</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Date</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {donations.map(d => (
              <tr key={d.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="p-3">
                  <input type="checkbox" checked={selected.has(d.id)} onChange={() => toggleSelect(d.id)} className="accent-primary" />
                </td>
                <td className="p-3 text-foreground">{d.donor_name || "Anonymous"}</td>
                <td className="p-3 text-foreground font-medium">Rs. {Number(d.amount).toLocaleString()}</td>
                <td className="p-3 text-muted-foreground">{d.type}</td>
                <td className="p-3 text-muted-foreground">{d.payment_method || "—"}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${d.status === "verified" ? "bg-primary/20 text-primary" : "bg-yellow-500/20 text-yellow-400"}`}>{d.status}</span></td>
                <td className="p-3 text-muted-foreground text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
                <td className="p-3 flex gap-2">
                  {d.screenshot_url && (
                    <button onClick={() => setViewScreenshot(d.screenshot_url)} className="text-muted-foreground hover:text-foreground" title="View Screenshot">
                      <Eye size={16} />
                    </button>
                  )}
                  {d.status === "pending" && (
                    <button onClick={() => verify(d.id)} className="text-primary hover:text-primary/80" title="Verify">
                      <Check size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {donations.length === 0 && <p className="p-6 text-center text-muted-foreground">No donations yet.</p>}
      </div>

      {/* Screenshot viewer modal */}
      {viewScreenshot && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setViewScreenshot(null)}>
          <div className="max-w-2xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <img src={viewScreenshot} alt="Payment Screenshot" className="rounded-xl border border-border" />
            <div className="text-center mt-4">
              <Button variant="ghost" onClick={() => setViewScreenshot(null)} className="text-muted-foreground">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsManager;
