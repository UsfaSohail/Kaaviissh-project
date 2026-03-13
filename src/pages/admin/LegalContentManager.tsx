import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LegalContentManager = () => {
  const [privacy, setPrivacy] = useState({ body_en: "", body_ur: "", id: "" });
  const [terms, setTerms] = useState({ body_en: "", body_ur: "", id: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("legal_content" as any).select("*");
      if (data) {
        const p = (data as any[]).find((d: any) => d.key === "privacy_policy");
        const t = (data as any[]).find((d: any) => d.key === "terms_of_service");
        if (p) setPrivacy({ body_en: p.body_en, body_ur: p.body_ur, id: p.id });
        if (t) setTerms({ body_en: t.body_en, body_ur: t.body_ur, id: t.id });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const save = async (id: string, body_en: string, body_ur: string) => {
    const { error } = await supabase
      .from("legal_content" as any)
      .update({ body_en, body_ur, updated_at: new Date().toISOString() } as any)
      .eq("id", id);
    if (!error) toast.success("Saved successfully");
    else toast.error("Failed to save");
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Legal Content</h2>
      <Tabs defaultValue="privacy">
        <TabsList>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
        </TabsList>
        <TabsContent value="privacy" className="space-y-4 mt-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">English</label>
            <textarea value={privacy.body_en} onChange={e => setPrivacy({ ...privacy, body_en: e.target.value })} rows={12} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Urdu</label>
            <textarea value={privacy.body_ur} onChange={e => setPrivacy({ ...privacy, body_ur: e.target.value })} rows={12} dir="rtl" className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }} />
          </div>
          <Button onClick={() => save(privacy.id, privacy.body_en, privacy.body_ur)}>Save Privacy Policy</Button>
        </TabsContent>
        <TabsContent value="terms" className="space-y-4 mt-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">English</label>
            <textarea value={terms.body_en} onChange={e => setTerms({ ...terms, body_en: e.target.value })} rows={12} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Urdu</label>
            <textarea value={terms.body_ur} onChange={e => setTerms({ ...terms, body_ur: e.target.value })} rows={12} dir="rtl" className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }} />
          </div>
          <Button onClick={() => save(terms.id, terms.body_en, terms.body_ur)}>Save Terms of Service</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalContentManager;