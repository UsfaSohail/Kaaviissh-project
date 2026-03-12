import { Button } from "@/components/ui/button";
import { useDonations } from "@/hooks/useDonations";
import { Check, Download } from "lucide-react";
import { toast } from "sonner";

const DonationsManager = () => {
  const { donations, loading, updateDonation, exportCSV } = useDonations();

  const verify = async (id: string) => {
    const { error } = await updateDonation(id, { status: "verified" });
    if (!error) toast.success("Donation verified");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Donations Manager</h2>
        <Button variant="outline" onClick={exportCSV} className="gap-2"><Download size={16} /> Export CSV</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50">
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
                <td className="p-3 text-foreground">{d.donor_name || "Anonymous"}</td>
                <td className="p-3 text-foreground font-medium">Rs. {Number(d.amount).toLocaleString()}</td>
                <td className="p-3 text-muted-foreground">{d.type}</td>
                <td className="p-3 text-muted-foreground">{d.payment_method || "—"}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${d.status === "verified" ? "bg-primary/20 text-primary" : "bg-yellow-500/20 text-yellow-400"}`}>{d.status}</span></td>
                <td className="p-3 text-muted-foreground text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  {d.status === "pending" && (
                    <button onClick={() => verify(d.id)} className="text-primary hover:text-primary/80"><Check size={16} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {donations.length === 0 && <p className="p-6 text-center text-muted-foreground">No donations yet.</p>}
      </div>
    </div>
  );
};

export default DonationsManager;
