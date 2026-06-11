import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const SiteContentManager = () => {
  const { allContent, updateContent } = useSiteContent();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ value_en: "", value_ur: "" });

  const openEdit = (item: any) => {
    setForm({ value_en: item.value_en, value_ur: item.value_ur });
    setEditing(item);
  };

  const handleSave = async () => {
    if (!editing) return;
    const { error } = await updateContent(editing.id, form);
    if (!error) toast.success("Content updated");
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Site Content</h2>
      <div className="admin-table-card">
        <table className="admin-table">
          <thead><tr>
            <th>Key</th>
            <th>Value (EN)</th>
            <th>Value (UR)</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {allContent.map(item => (
              <tr key={item.id}>
                <td className="font-mono text-xs">{item.key}</td>
                <td className="text-muted-foreground text-xs max-w-[200px] truncate">{item.value_en}</td>
                <td className="text-muted-foreground text-xs max-w-[200px] truncate" dir="rtl">{item.value_ur}</td>
                <td>
                  <div className="admin-table-actions">
                    <button onClick={() => openEdit(item)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allContent.length === 0 && <p className="p-6 text-center text-muted-foreground">No content entries.</p>}
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit: {editing?.key}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Value (EN)</label>
              <textarea value={form.value_en} onChange={e => setForm({ ...form, value_en: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" rows={4} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Value (UR)</label>
              <textarea value={form.value_ur} onChange={e => setForm({ ...form, value_ur: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" rows={4} dir="rtl" />
            </div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteContentManager;
