import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCases } from "@/hooks/useCases";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const CasesManager = () => {
  const { cases, loading, addCase, updateCase, deleteCase } = useCases();
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const emptyForm = { title_en: "", title_ur: "", description_en: "", description_ur: "", location: "", target_amount: 0, raised_amount: 0, status: "Open", image_url: "" };
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setForm(emptyForm); setEditing(null); setOpen(true); };
  const openEdit = (c: any) => { setForm({ title_en: c.title_en, title_ur: c.title_ur, description_en: c.description_en, description_ur: c.description_ur, location: c.location || "", target_amount: c.target_amount, raised_amount: c.raised_amount, status: c.status, image_url: c.image_url || "" }); setEditing(c); setOpen(true); };

  const handleSave = async () => {
    if (editing) {
      const { error } = await updateCase(editing.id, form);
      if (!error) toast.success("Case updated");
    } else {
      const { error } = await addCase(form as any);
      if (!error) toast.success("Case added");
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this case?")) return;
    await deleteCase(id);
    toast.success("Case deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Cases Manager</h2>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> Add Case</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50">
            <th className="text-start p-3 text-muted-foreground font-medium">Title</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Status</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Progress</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {cases.map(c => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="p-3 text-foreground">{c.title_en}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${c.status === "Completed" ? "bg-primary/20 text-primary" : c.status === "In Progress" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}`}>{c.status}</span></td>
                <td className="p-3 text-muted-foreground">Rs. {Number(c.raised_amount).toLocaleString()} / {Number(c.target_amount).toLocaleString()}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openEdit(c)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cases.length === 0 && <p className="p-6 text-center text-muted-foreground">No cases yet.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Case" : "Add Case"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <input placeholder="Title (EN)" value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Title (UR)" value={form.title_ur} onChange={e => setForm({ ...form, title_ur: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" dir="rtl" />
            <textarea placeholder="Description (EN)" value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" rows={3} />
            <textarea placeholder="Description (UR)" value={form.description_ur} onChange={e => setForm({ ...form, description_ur: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" rows={3} dir="rtl" />
            <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Target Amount" value={form.target_amount} onChange={e => setForm({ ...form, target_amount: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
              <input type="number" placeholder="Raised Amount" value={form.raised_amount} onChange={e => setForm({ ...form, raised_amount: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            </div>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm">
              <option>Open</option><option>In Progress</option><option>Completed</option>
            </select>
            <input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CasesManager;
