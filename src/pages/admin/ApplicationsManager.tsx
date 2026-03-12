import { Button } from "@/components/ui/button";
import { useApplications } from "@/hooks/useApplications";
import { Check, X, Download } from "lucide-react";
import { toast } from "sonner";

const ApplicationsManager = () => {
  const { applications, updateApplication, exportCSV } = useApplications();

  const updateStatus = async (id: string, status: string) => {
    const { error } = await updateApplication(id, { status });
    if (!error) toast.success(`Application ${status.toLowerCase()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Applications Manager</h2>
        <Button variant="outline" onClick={exportCSV} className="gap-2"><Download size={16} /> Export CSV</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50">
            <th className="text-start p-3 text-muted-foreground font-medium">Name</th>
            <th className="text-start p-3 text-muted-foreground font-medium">CNIC</th>
            <th className="text-start p-3 text-muted-foreground font-medium">City</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Status</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Date</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {applications.map(a => (
              <tr key={a.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="p-3 text-foreground">{a.full_name}</td>
                <td className="p-3 text-muted-foreground">{a.cnic || "—"}</td>
                <td className="p-3 text-muted-foreground">{a.city || "—"}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${a.status === "Approved" ? "bg-primary/20 text-primary" : a.status === "Rejected" ? "bg-destructive/20 text-destructive" : "bg-yellow-500/20 text-yellow-400"}`}>{a.status}</span></td>
                <td className="p-3 text-muted-foreground text-xs">{new Date(a.created_at).toLocaleDateString()}</td>
                <td className="p-3 flex gap-2">
                  {a.status === "Pending" && (
                    <>
                      <button onClick={() => updateStatus(a.id, "Approved")} className="text-primary hover:text-primary/80"><Check size={16} /></button>
                      <button onClick={() => updateStatus(a.id, "Rejected")} className="text-destructive hover:text-destructive/80"><X size={16} /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && <p className="p-6 text-center text-muted-foreground">No applications yet.</p>}
      </div>
    </div>
  );
};

export default ApplicationsManager;
