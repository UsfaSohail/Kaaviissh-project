import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, X } from "lucide-react";
import { useSuccessStories, type SuccessStory } from "@/hooks/useSuccessStories";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const SuccessStoriesPage = () => {
  const { stories, loading } = useSuccessStories(true);
  const { lang } = useLanguage();
  const [active, setActive] = useState<SuccessStory | null>(null);

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Sparkles size={14} /> Real Impact
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Success Stories</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every donation creates a ripple of change. Here are some of the lives transformed by your generosity.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Sparkles size={40} className="mx-auto mb-3 opacity-30" />
            <p>No success stories published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => setActive(s)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="group text-start bg-card border border-border rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-primary/40 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {s.image_url && (
                  <div className="aspect-video overflow-hidden bg-secondary">
                    <img
                      src={s.image_url}
                      alt={lang === "ur" ? s.title_ur : s.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {lang === "ur" ? s.title_ur || s.title_en : s.title_en}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {lang === "ur" ? s.description_ur || s.description_en : s.description_en}
                  </p>
                  {s.completion_date && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                      <Calendar size={12} />
                      Completed {new Date(s.completion_date).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                    </div>
                  )}
                  <div className="mt-3 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Read full story →
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {active.image_url && (
                  <div className="aspect-video overflow-hidden bg-secondary">
                    <img src={active.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-3" dir={lang === "ur" ? "rtl" : "ltr"}>
                    {lang === "ur" ? active.title_ur || active.title_en : active.title_en}
                  </h2>
                  {active.completion_date && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                      <Calendar size={12} />
                      Completed {new Date(active.completion_date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                    </div>
                  )}
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap" dir={lang === "ur" ? "rtl" : "ltr"}>
                    {lang === "ur" ? active.description_ur || active.description_en : active.description_en}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuccessStoriesPage;
