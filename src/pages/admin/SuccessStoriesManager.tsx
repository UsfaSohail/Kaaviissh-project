import { useState, useRef } from "react";
import { useSuccessStories, type SuccessStory } from "@/hooks/useSuccessStories";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, X as XIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const empty: Partial<SuccessStory> = {
  title_en: "",
  title_ur: "",
  description_en: "",
  description_ur: "",
  image_url: "",
  completion_date: "",
  is_published: true,
};

const SuccessStoriesManager = () => {
  const { stories, loading, create, update, remove } = useSuccessStories(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<SuccessStory>>(empty);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("success-stories").upload(path, file, { upsert: false });
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("success-stories").getPublicUrl(path);
    setEditing((prev) => ({ ...prev, image_url: data.publicUrl }));
    toast.success("Image uploaded");
    setUploading(false);
  };

  const openNew = () => {
    setEditing(empty);
    setOpen(true);
  };

  const openEdit = (s: SuccessStory) => {
    setEditing(s);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editing.title_en) {
      toast.error("Title (English) is required");
      return;
    }
    const payload: any = { ...editing };
    if (!payload.completion_date) payload.completion_date = null;
    if (!payload.image_url) payload.image_url = null;
    let res;
    if ((editing as any).id) {
      const { id, created_at, updated_at, ...rest } = payload;
      res = await update(id, rest);
    } else {
      res = await create(payload);
    }
    if (res.error) toast.error("Save failed");
    else {
      toast.success("Saved");
      setOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this story?")) return;
    const { error } = await remove(id);
    if (error) toast.error("Delete failed");
    else toast.success("Deleted");
  };

  const togglePublish = async (s: SuccessStory) => {
    await update(s.id, { is_published: !s.is_published });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Success Stories</h2>
          <p className="text-sm text-muted-foreground mt-1">{stories.length} stories</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus size={14} /> New Story</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : stories.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          No success stories yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-xl overflow-hidden">
              {s.image_url && <img src={s.image_url} alt="" className="aspect-video object-cover w-full" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground line-clamp-1">{s.title_en}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${s.is_published ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {s.is_published ? "Live" : "Hidden"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{s.description_en}</p>
                <div className="flex gap-1 mt-3 pt-3 border-t border-border">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                  <button onClick={() => togglePublish(s)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
                    {s.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive ml-auto"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{(editing as any).id ? "Edit" : "New"} Story</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Field label="Title (English)" value={editing.title_en || ""} onChange={(v) => setEditing({ ...editing, title_en: v })} />
            <Field label="Title (Urdu)" value={editing.title_ur || ""} onChange={(v) => setEditing({ ...editing, title_ur: v })} />
            <Field label="Description (English)" value={editing.description_en || ""} onChange={(v) => setEditing({ ...editing, description_en: v })} textarea />
            <Field label="Description (Urdu)" value={editing.description_ur || ""} onChange={(v) => setEditing({ ...editing, description_ur: v })} textarea />
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Story Image</label>
              {editing.image_url ? (
                <div className="relative group rounded-lg overflow-hidden border border-border">
                  <img src={editing.image_url} alt="" className="w-full aspect-video object-cover" />
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, image_url: "" })}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex flex-col items-center justify-center gap-2 py-8 px-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                  <span className="text-xs">{uploading ? "Uploading..." : "Click to upload image (max 5MB)"}</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                  e.target.value = "";
                }}
              />
            </div>
            <Field label="Completion Date" value={editing.completion_date || ""} onChange={(v) => setEditing({ ...editing, completion_date: v })} type="date" />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={!!editing.is_published}
                onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                className="accent-primary"
              />
              Published
            </label>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  textarea,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
    {textarea ? (
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
    )}
  </div>
);

export default SuccessStoriesManager;
