import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuotes } from "@/hooks/useQuotes";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const QuotesManager = () => {
  const { quotes, addQuote, updateQuote, deleteQuote } = useQuotes(false);
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const emptyForm = { text_en: "", text_ur: "", source_en: "", source_ur: "", is_active: true };
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setForm(emptyForm); setEditing(null); setOpen(true); };
  const openEdit = (q: any) => { setForm({ text_en: q.text_en, text_ur: q.text_ur, source_en: q.source_en || "", source_ur: q.source_ur || "", is_active: q.is_active }); setEditing(q); setOpen(true); };

  const handleSave = async () => {
    if (editing) {
      const { error } = await updateQuote(editing.id, form);
      if (!error) toast.success("Quote updated");
    } else {
      const { error } = await addQuote(form);
      if (!error) toast.success("Quote added");
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quote?")) return;
    await deleteQuote(id);
    toast.success("Quote deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Quotes Manager</h2>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> Add Quote</Button>
      </div>

      <div className="space-y-3">
        {quotes.map(q => (
          <div key={q.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-foreground italic">"{q.text_en}"</p>
              {q.source_en && <p className="text-xs text-primary mt-1">{q.source_en}</p>}
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${q.is_active ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>{q.is_active ? "Active" : "Inactive"}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(q)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(q.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {quotes.length === 0 && <p className="text-center text-muted-foreground">No quotes yet.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Quote" : "Add Quote"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <textarea placeholder="Quote text (EN)" value={form.text_en} onChange={e => setForm({ ...form, text_en: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" rows={3} />
            <textarea placeholder="Quote text (UR)" value={form.text_ur} onChange={e => setForm({ ...form, text_ur: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" rows={3} dir="rtl" />
            <input placeholder="Source (EN)" value={form.source_en} onChange={e => setForm({ ...form, source_en: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Source (UR)" value={form.source_ur} onChange={e => setForm({ ...form, source_ur: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" dir="rtl" />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
              Active
            </label>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotesManager;
