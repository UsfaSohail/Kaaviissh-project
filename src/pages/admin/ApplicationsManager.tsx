import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/hooks/useApplications";
import { useChat } from "@/hooks/useChat";
import { Check, X, Download, FileText, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ApplicationsManager = () => {
  const { applications, updateApplication } = useApplications();
  const { sendMessage } = useChat();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewingDoc, setViewingDoc] = useState<{ url: string; name: string } | null>(null);
  const [loadingDoc, setLoadingDoc] = useState<string | null>(null);

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

  const exportSingle = (application: any) => {
    const headers = ["ID", "Name", "CNIC", "Phone", "City", "Status", "Date"];
    const row = [application.id, application.full_name, application.cnic, application.phone, application.city, application.status, application.created_at];
    const csv = [headers, row].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; 
    a.download = `application_${application.id}.csv`; 
    a.click();
  };

  // Create signed URL for secure access to private documents
  const getSignedDocumentUrl = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("application-documents")
      .createSignedUrl(path, 300); // 5 minutes expiry for viewing
    
    if (error) {
      console.error("Error creating signed URL:", error);
      toast.error("Failed to access document: " + error.message);
      return null;
    }
    return data.signedUrl;
  };

  // Download document using signed URL
  const downloadDocument = async (path: string, fileName: string) => {
    setLoadingDoc(path);
    const signedUrl = await getSignedDocumentUrl(path);
    setLoadingDoc(null);
    
    if (signedUrl) {
      const a = document.createElement("a");
      a.href = signedUrl;
      a.download = fileName || path.split("/").pop() || "document.pdf";
      a.target = "_blank";
      a.click();
    }
  };

  // View document in dialog using signed URL
  const viewDocument = async (path: string) => {
    setLoadingDoc(path);
    const signedUrl = await getSignedDocumentUrl(path);
    setLoadingDoc(null);
    
    if (signedUrl) {
      const name = path.split("/").pop() || "Document";
      setViewingDoc({ url: signedUrl, name });
    }
  };

  const handleStatusUpdate = async (application: any, status: string) => {
    const { error } = await updateApplication(application.id, { status });
    if (error) {
      toast.error("Failed to update application status");
    } else {
      toast.success(`Application ${status.toLowerCase()} successfully`);
      // Notify the user via chat
      await sendMessage({
        user_id: application.user_id,
        message: `Your application has been ${status.toLowerCase()}.`,
        sender: "admin"
      });
    }
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
            <th className="text-start p-3 text-muted-foreground font-medium">Documents</th>
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
                
                {/* Documents Column */}
                <td className="p-3">
                  {a.documents && a.documents.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {a.documents.map((doc: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <FileText size={14} className="text-primary" />
                          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                            {doc.split("/").pop()}
                          </span>
                          
                          {/* View Button */}
                          <button 
                            onClick={() => viewDocument(doc)} 
                            disabled={loadingDoc === doc}
                            className="text-primary hover:text-primary/80 p-1 disabled:opacity-50"
                            title="View PDF"
                          >
                            {loadingDoc === doc ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                          
                          {/* Download Button */}
                          <button 
                            onClick={() => downloadDocument(doc, doc.split("/").pop() || `document_${idx + 1}.pdf`)} 
                            disabled={loadingDoc === doc}
                            className="text-muted-foreground hover:text-foreground p-1 disabled:opacity-50"
                            title="Download PDF"
                          >
                            {loadingDoc === doc ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Download size={14} />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No documents</span>
                  )}
                </td>

                <td className="p-3 flex gap-2">
                  {a.status === "Pending" && (
                    <>
                      <button onClick={() => handleStatusUpdate(a, "Approved")} className="text-primary hover:text-primary/80"><Check size={16} /></button>
                      <button onClick={() => handleStatusUpdate(a, "Rejected")} className="text-destructive hover:text-destructive/80"><X size={16} /></button>
                    </>
                  )}
                  <button onClick={() => exportSingle(a)} className="text-muted-foreground hover:text-foreground" title="Export CSV">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && <p className="p-6 text-center text-muted-foreground">No applications yet.</p>}
      </div>

      {/* PDF Viewer Dialog */}
      <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-8">
              <span className="truncate">{viewingDoc?.name}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => viewingDoc && downloadDocument(viewingDoc.url, viewingDoc.name)}
                className="gap-2 shrink-0"
              >
                <Download size={14} /> Download
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-full min-h-[60vh] bg-secondary rounded-lg overflow-hidden">
            {viewingDoc && (
              <iframe
                src={viewingDoc.url}
                className="w-full h-full"
                title={viewingDoc.name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsManager;