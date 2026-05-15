import { motion } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";
import { useSuccessStories } from "@/hooks/useSuccessStories";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

const SuccessStories = () => {
  const { stories, loading } = useSuccessStories(true);
  const { lang } = useLanguage();

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
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="group bg-card border border-border rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-primary/40 transition-all"
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
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
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
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessStories;
