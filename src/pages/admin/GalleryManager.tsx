import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGallery } from "@/hooks/useGallery";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const GalleryManager = () => {
  const { images, addImage, deleteImage } = useGallery();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ image_url: "", category: "", caption_en: "", caption_ur: "" });

  const handleAdd = async () => {
    const { error } = await addImage(form);
    if (!error) toast.success("Image added");
    setOpen(false);
    setForm({ image_url: "", category: "", caption_en: "", caption_ur: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await deleteImage(id);
    toast.success("Image deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Gallery</h2>
        <Button onClick={() => setOpen(true)} className="gap-2"><Plus size={16} /> Add Image</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="bg-card border border-border rounded-xl overflow-hidden group relative">
            <img src={img.image_url} alt={img.caption_en || ""} className="w-full h-40 object-cover" />
            <div className="p-3">
              <p className="text-xs text-foreground truncate">{img.caption_en || "No caption"}</p>
              {img.category && <span className="text-xs text-primary">{img.category}</span>}
            </div>
            <button onClick={() => handleDelete(img.id)} className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-destructive">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="text-center text-muted-foreground">No gallery images yet.</p>}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Image</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Caption (EN)" value={form.caption_en} onChange={e => setForm({ ...form, caption_en: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Caption (UR)" value={form.caption_ur} onChange={e => setForm({ ...form, caption_ur: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" dir="rtl" />
            <Button onClick={handleAdd} className="w-full">Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManager;
