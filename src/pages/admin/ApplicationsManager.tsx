import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/hooks/useApplications";
import { useChat } from "@/hooks/useChat";
import { createNotification } from "@/hooks/useNotifications";
import { Check, X, Download, FileText, Eye, ExternalLink } from "lucide-react";
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

  const [selected, setSelected] = useState(new Set());
  const [viewingDoc, setViewingDoc] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(null);

  // ✅ thumbnails state
  const [thumbs, setThumbs] = useState({});

  const toggleSelect = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === applications.length) setSelected(new Set());
    else setSelected(new Set(applications.map(a => a.id)));
  };

  const exportSelected = () => {
    const filtered = selected.size > 0
      ? applications.filter(a => selected.has(a.id))
      : applications;

    const headers = ["ID", "Name", "CNIC", "Phone", "City", "Status", "Date"];
    const rows = filtered.map(a => [
      a.id, a.full_name, a.cnic, a.phone, a.city, a.status, a.created_at
    ]);

    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applications.csv";
    a.click();
  };

  // ✅ signed URL
  const getSignedDocumentUrl = async (path) => {
    const { data, error } = await supabase.storage
      .from("application-documents")
      .createSignedUrl(path, 300);

    if (error) {
      toast.error("Failed to access document");
      return null;
    }
    return data.signedUrl;
  };

  // ✅ thumbnails loader
  const loadThumbnails = async (docs) => {
    const obj = {};

    for (let doc of docs) {
      const url = await getSignedDocumentUrl(doc);
      if (url) obj[doc] = url;
    }

    setThumbs(prev => ({ ...prev, ...obj }));
  };

  useEffect(() => {
    applications.forEach(a => {
      if (a.document_urls) {
        loadThumbnails(a.document_urls);
      }
    });
  }, [applications]);

  // ✅ download
  const downloadDocument = async (path, fileName) => {
    let url = path;

    if (!path.startsWith("http")) {
      const signed = await getSignedDocumentUrl(path);
      if (!signed) return;
      url = signed;
    }

    const res = await fetch(url);
    const blob = await res.blob();

    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = fileName;
    a.click();
  };

  // ✅ view
  const viewDocument = async (path) => {
    const url = await getSignedDocumentUrl(path);
    if (!url) return;

    setViewingDoc({
      url,
      name: path.split("/").pop(),
      path
    });
  };

  // ✅ open in new tab
  const openInNewTab = async (path) => {
    let url = path;

    if (!path.startsWith("http")) {
      const signed = await getSignedDocumentUrl(path);
      if (!signed) return;
      url = signed;
    }

    window.open(url, "_blank");
  };

  const handleStatusUpdate = async (application, status) => {
    const { error } = await updateApplication(application.id, { status });

    if (error) toast.error("Update failed");
    else {
      toast.success(`Application ${status}`);
      await sendMessage({
        user_id: application.user_id,
        message: `Your application has been ${status}`,
        sender: "admin"
      });
    }
  };

  return (
    <div className="space-y-4">

      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Applications Manager</h2>
        <Button onClick={exportSelected}>
          <Download size={16} /> Export CSV
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selected.size === applications.length}
                  onChange={toggleAll}
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">CNIC</th>
              <th className="p-3">City</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Documents</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map(a => (
              <tr key={a.id} className="border-b hover:bg-secondary/30">

                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(a.id)}
                    onChange={() => toggleSelect(a.id)}
                  />
                </td>

                <td className="p-3">{a.full_name}</td>
                <td className="p-3">{a.cnic}</td>
                <td className="p-3">{a.city}</td>
                <td className="p-3">{a.status}</td>
                <td className="p-3">
                  {new Date(a.created_at).toLocaleDateString()}
                </td>

                {/* ✅ UPDATED DOCUMENT COLUMN */}
                <td className="p-3">
                  {a.document_urls && a.document_urls.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">

                      {a.document_urls.map((doc, idx) => {
                        const fileName = doc.split("/").pop();
                        const isImage = fileName.match(/\.(jpg|jpeg|png|webp)$/i);

                        return (
                          <div key={idx} className="flex flex-col items-center gap-1">

                            {/* Thumbnail */}
                            {isImage ? (
                              <img
                                src={thumbs[doc]}
                                className="w-12 h-12 object-cover rounded border"
                              />
                            ) : (
                              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded border">
                                <FileText size={20} />
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-1">
                              <button onClick={() => viewDocument(doc)}>
                                <Eye size={14} />
                              </button>

                              <button onClick={() => downloadDocument(doc, fileName)}>
                                <Download size={14} />
                              </button>

                              <button onClick={() => openInNewTab(doc)}>
                                <ExternalLink size={14} />
                              </button>
                            </div>

                          </div>
                        );
                      })}

                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No documents
                    </span>
                  )}
                </td>

                <td className="p-3 flex gap-2">
                  {a.status === "Pending" && (
                    <>
                      <button onClick={() => handleStatusUpdate(a, "Approved")}>
                        <Check size={16} />
                      </button>
                      <button onClick={() => handleStatusUpdate(a, "Rejected")}>
                        <X size={16} />
                      </button>
                    </>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex justify-between">
              {viewingDoc?.name}
              <div className="flex gap-2">
                <Button onClick={() => downloadDocument(viewingDoc.url, viewingDoc.name)}>
                  <Download size={14} />
                </Button>

                <Button onClick={() => openInNewTab(viewingDoc.url)}>
                  <ExternalLink size={14} />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {viewingDoc && (
            <iframe src={viewingDoc.url} className="w-full h-full" />
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ApplicationsManager;