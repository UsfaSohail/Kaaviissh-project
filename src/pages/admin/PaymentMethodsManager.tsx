import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PaymentMethodsManager = () => {
  const { methods, updateMethod, refetch } = usePaymentMethods();
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const emptyForm = { method_name: "", account_title: "", phone_number: "", iban: "", is_active: true };
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setForm(emptyForm); setEditing(null); setOpen(true); };
  const openEdit = (m: any) => {
    setForm({ method_name: m.method_name, account_title: m.account_title, phone_number: m.phone_number || "", iban: m.iban || "", is_active: m.is_active });
    setEditing(m);
    setOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      const { error } = await updateMethod(editing.id, form);
      if (!error) { toast.success("Updated"); refetch(); }
    } else {
      const { error } = await supabase.from("payment_methods").insert(form);
      if (!error) { toast.success("Added"); refetch(); }
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this payment method?")) return;
    await supabase.from("payment_methods").delete().eq("id", id);
    toast.success("Deleted");
    refetch();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await updateMethod(id, { is_active: !isActive });
    toast.success("Updated");
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Payment Methods</h2>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> Add Method</Button>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50">
            <th className="text-start p-3 text-muted-foreground font-medium">Method</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Account Title</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Phone</th>
            <th className="text-start p-3 text-muted-foreground font-medium">IBAN</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Active</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {methods.map(m => (
              <tr key={m.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="p-3 text-foreground font-medium">{m.method_name}</td>
                <td className="p-3 text-muted-foreground">{m.account_title}</td>
                <td className="p-3 text-muted-foreground">{m.phone_number || "—"}</td>
                <td className="p-3 text-muted-foreground text-xs font-mono">{m.iban || "—"}</td>
                <td className="p-3">
                  <button onClick={() => toggleActive(m.id, m.is_active)} className={`px-3 py-1 rounded-full text-xs font-medium ${m.is_active ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {m.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openEdit(m)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(m.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Method" : "Add Method"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <input placeholder="Method Name (e.g. EasyPaisa)" value={form.method_name} onChange={e => setForm({ ...form, method_name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Account Title" value={form.account_title} onChange={e => setForm({ ...form, account_title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Phone Number" value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="IBAN" value={form.iban} onChange={e => setForm({ ...form, iban: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-primary" />
              Active
            </label>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethodsManager;