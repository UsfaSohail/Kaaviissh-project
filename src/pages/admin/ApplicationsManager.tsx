import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/hooks/useApplications";
import { Check, X, Download } from "lucide-react";
import { toast } from "sonner";

const ApplicationsManager = () => {
  const { applications, updateApplication } = useApplications();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === applications.length) setSelected(new Set());
    else setSelected(new Set(applications.map(a => a.id)));
  };

  const exportSelected = () => {
    const filtered = selected.size > 0 ? applications.filter(a => selected.has(a.id)) : applications;
    const headers = ["ID", "Name", "CNIC", "Phone", "City", "Status", "Date"];
    const rows = filtered.map(a => [a.id, a.full_name, a.cnic, a.phone, a.city, a.status, a.created_at]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "applications.csv"; a.click();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await updateApplication(id, { status });
    if (!error) toast.success(`Application ${status.toLowerCase()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Applications Manager</h2>
        <Button variant="outline" onClick={exportSelected} className="gap-2">
          <Download size={16} /> Export {selected.size > 0 ? `(${selected.size})` : "All"} CSV
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50">
            <th className="p-3 w-10">
              <input type="checkbox" checked={selected.size === applications.length && applications.length > 0} onChange={toggleAll} className="accent-primary" />
            </th>
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
                <td className="p-3">
                  <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggleSelect(a.id)} className="accent-primary" />
                </td>
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