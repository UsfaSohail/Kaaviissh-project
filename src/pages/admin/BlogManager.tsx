import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/useBlogs";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const BlogManager = () => {
  const { posts, addPost, updatePost, deletePost } = useBlogs(false);
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const emptyForm = { title_en: "", title_ur: "", body_en: "", body_ur: "", category: "", image_url: "", is_published: false };
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setForm(emptyForm); setEditing(null); setOpen(true); };
  const openEdit = (p: any) => { setForm({ title_en: p.title_en, title_ur: p.title_ur, body_en: p.body_en, body_ur: p.body_ur, category: p.category || "", image_url: p.image_url || "", is_published: p.is_published }); setEditing(p); setOpen(true); };

  const handleSave = async () => {
    const data = { ...form, published_at: form.is_published ? new Date().toISOString() : null };
    if (editing) {
      const { error } = await updatePost(editing.id, data);
      if (!error) toast.success("Post updated");
    } else {
      const { error } = await addPost(data);
      if (!error) toast.success("Post created");
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await deletePost(id);
    toast.success("Post deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Blog Manager</h2>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> New Post</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50">
            <th className="text-start p-3 text-muted-foreground font-medium">Title</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Category</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Published</th>
            <th className="text-start p-3 text-muted-foreground font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="p-3 text-foreground">{p.title_en}</td>
                <td className="p-3 text-muted-foreground">{p.category || "—"}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${p.is_published ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>{p.is_published ? "Published" : "Draft"}</span></td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="p-6 text-center text-muted-foreground">No posts yet.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <input placeholder="Title (EN)" value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Title (UR)" value={form.title_ur} onChange={e => setForm({ ...form, title_ur: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" dir="rtl" />
            <textarea placeholder="Body (EN)" value={form.body_en} onChange={e => setForm({ ...form, body_en: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" rows={6} />
            <textarea placeholder="Body (UR)" value={form.body_ur} onChange={e => setForm({ ...form, body_ur: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" rows={6} dir="rtl" />
            <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
              Publish immediately
            </label>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManager;
