import { useState, useMemo } from "react";
import { useVolunteers } from "@/hooks/useVolunteers";
import { createNotification } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2, Search, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  Approved: "bg-primary/15 text-primary border-primary/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const VolunteersManager = () => {
  const { volunteers, loading, update, remove } = useVolunteers();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [viewing, setViewing] = useState<any>(null);

  const filtered = useMemo(() => {
    return volunteers.filter((v) => {
      if (filter !== "All" && v.status !== filter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        v.full_name?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.city?.toLowerCase().includes(q) ||
        v.skills?.toLowerCase().includes(q)
      );
    });
  }, [volunteers, search, filter]);

  const handleStatus = async (v: any, status: string) => {
    const { error } = await update(v.id, { status });
    if (error) return toast.error("Update failed");
    toast.success(`Volunteer ${status.toLowerCase()}`);
    if (v.user_id) {
      await createNotification(
        v.user_id,
        `Volunteer Application ${status}`,
        `Your volunteer application has been ${status.toLowerCase()}.`,
        status === "Approved" ? "success" : "error"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this volunteer application?")) return;
    const { error } = await remove(id);
    if (error) toast.error("Delete failed");
    else toast.success("Deleted");
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "City", "Skills", "Availability", "Status", "Date"];
    const rows = filtered.map((v) => [
      v.full_name,
      v.email,
      v.phone || "",
      v.city || "",
      (v.skills || "").replace(/,/g, ";"),
      (v.availability || "").replace(/,/g, ";"),
      v.status,
      new Date(v.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "volunteers.csv";
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Volunteer Applications</h2>
          <p className="text-sm text-muted-foreground mt-1">{volunteers.length} total · {volunteers.filter(v => v.status === "Pending").length} pending</p>
        </div>
        <Button variant="outline" onClick={exportCSV} className="gap-2">
          <Download size={14} /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, city, skills..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          {(["All", "Pending", "Approved", "Rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-start">
              <th className="text-start p-3 text-muted-foreground font-medium">Name</th>
              <th className="text-start p-3 text-muted-foreground font-medium">Email</th>
              <th className="text-start p-3 text-muted-foreground font-medium">City</th>
              <th className="text-start p-3 text-muted-foreground font-medium">Skills</th>
              <th className="text-start p-3 text-muted-foreground font-medium">Status</th>
              <th className="text-start p-3 text-muted-foreground font-medium">Date</th>
              <th className="text-start p-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No applications match your filters.</td></tr>
            ) : (
              filtered.map((v) => (
                <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="p-3 text-foreground font-medium">{v.full_name}</td>
                  <td className="p-3 text-muted-foreground">{v.email}</td>
                  <td className="p-3 text-muted-foreground">{v.city || "—"}</td>
                  <td className="p-3 text-muted-foreground max-w-[200px] truncate">{v.skills || "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_STYLES[v.status] || ""}`}>{v.status}</span>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(v.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => setViewing(v)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground" title="View">
                        <Eye size={14} />
                      </button>
                      {v.status === "Pending" && (
                        <>
                          <button onClick={() => handleStatus(v, "Approved")} className="p-1.5 rounded hover:bg-primary/10 text-primary" title="Approve">
                            <Check size={14} />
                          </button>
                          <button onClick={() => handleStatus(v, "Rejected")} className="p-1.5 rounded hover:bg-destructive/10 text-destructive" title="Reject">
                            <X size={14} />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{viewing?.full_name}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <Row label="Email" value={viewing.email} />
              <Row label="Phone" value={viewing.phone} />
              <Row label="City" value={viewing.city} />
              <Row label="Availability" value={viewing.availability} />
              <Row label="Skills" value={viewing.skills} multiline />
              <Row label="Motivation" value={viewing.motivation} multiline />
              <Row label="Status" value={viewing.status} />
              <Row label="Submitted" value={new Date(viewing.created_at).toLocaleString()} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Row = ({ label, value, multiline }: { label: string; value: any; multiline?: boolean }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`text-foreground ${multiline ? "whitespace-pre-wrap" : ""}`}>{value || "—"}</p>
  </div>
);

export default VolunteersManager;
