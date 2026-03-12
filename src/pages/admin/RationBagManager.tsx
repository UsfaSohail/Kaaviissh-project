import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRationBagItems } from "@/hooks/useRationBagItems";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const RationBagManager = () => {
  const { items, addItem, updateItem, deleteItem } = useRationBagItems();
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const emptyForm = { item_name_en: "", item_name_ur: "", quantity: "", unit: "" };
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setForm(emptyForm); setEditing(null); setOpen(true); };
  const openEdit = (item: any) => { setForm({ item_name_en: item.item_name_en, item_name_ur: item.item_name_ur, quantity: item.quantity || "", unit: item.unit || "" }); setEditing(item); setOpen(true); };

  const handleSave = async () => {
    if (editing) {
      const { error } = await updateItem(editing.id, form);
      if (!error) toast.success("Item updated");
    } else {
      const { error } = await addItem(form);
      if (!error) toast.success("Item added");
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await deleteItem(id);
    toast.success("Item deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Ration Bag Items</h2>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> Add Item</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50">
            <th className="text-start p-3 text-muted-foreground font-medium">Item (EN)</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Item (UR)</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Quantity</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="p-3 text-foreground">{item.item_name_en}</td>
                <td className="p-3 text-foreground" dir="rtl">{item.item_name_ur}</td>
                <td className="p-3 text-muted-foreground">{item.quantity} {item.unit}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openEdit(item)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="p-6 text-center text-muted-foreground">No items yet.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Item" : "Add Item"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <input placeholder="Item Name (EN)" value={form.item_name_en} onChange={e => setForm({ ...form, item_name_en: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Item Name (UR)" value={form.item_name_ur} onChange={e => setForm({ ...form, item_name_ur: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" dir="rtl" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
              <input placeholder="Unit (kg, L, etc.)" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            </div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RationBagManager;
