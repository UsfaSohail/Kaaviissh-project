import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBlogs } from "@/hooks/useBlogs";
import type { Tables } from "@/integrations/supabase/types";

type BlogPost = Tables<"blog_posts">;

const Blog = () => {
  const { t, lang } = useLanguage();
  const { posts, loading } = useBlogs();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const getTitle = (p: BlogPost) => lang === "ur" && p.title_ur ? p.title_ur : p.title_en;
  const getBody = (p: BlogPost) => lang === "ur" && p.body_ur ? p.body_ur : p.body_en;

  if (selectedPost) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button variant="ghost" onClick={() => setSelectedPost(null)} className="mb-6 text-muted-foreground hover:text-foreground">
              <ArrowLeft size={16} /> {t("blog.backToBlog")}
            </Button>
            <div className="flex items-center gap-3 mb-4">
              {selectedPost.category && (
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag size={10} /> {selectedPost.category}
                </span>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={10} /> {new Date(selectedPost.published_at || selectedPost.created_at).toLocaleDateString()}
              </span>
            </div>
            {selectedPost.image_url && <img src={selectedPost.image_url} alt={getTitle(selectedPost)} className="w-full h-64 object-cover rounded-2xl mb-6" />}
            <h1 className="text-3xl font-bold text-foreground mb-6">{getTitle(selectedPost)}</h1>
            <div className="prose prose-invert max-w-none">
              {getBody(selectedPost).split("\n\n").map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-sm">{p}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">{t("blog.title")}</h1>
          <p className="text-muted-foreground text-lg">{t("blog.subtitle")}</p>
        </motion.div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">{t("common.loading")}</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">{t("blog.noPosts")}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedPost(post)} className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_12px_32px_-8px_hsl(var(--primary)/0.2)] hover:border-primary/30">
                {post.image_url && <img src={post.image_url} alt={getTitle(post)} className="w-full h-44 object-cover" />}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full flex items-center gap-1"><Tag size={10} /> {post.category}</span>}
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={12} /> {new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{getTitle(post)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{getBody(post).slice(0, 150)}...</p>
                  <span className="text-sm text-primary font-medium inline-flex items-center gap-1 transition-all duration-300 group-hover:gap-2">
                    {t("blog.readmore")}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
