import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const posts = [
  { id: 1, title: "Our Biggest Ration Drive Yet", date: "Feb 15, 2026", preview: "Over 500 families received essential food packages in our latest drive across Lahore." },
  { id: 2, title: "The Spirit of Zakat in Modern Times", date: "Jan 28, 2026", preview: "How the obligation of Zakat continues to transform communities in Pakistan." },
  { id: 3, title: "Volunteers Making a Difference", date: "Jan 10, 2026", preview: "Meet the dedicated volunteers who make KAAVIISH's mission possible." },
  { id: 4, title: "Winter Relief Campaign Update", date: "Dec 20, 2025", preview: "A look back at our winter relief efforts and the families we supported in Quetta." },
  { id: 5, title: "How Your Donation Reaches Families", date: "Dec 5, 2025", preview: "Transparency report: tracing your contribution from donation to delivery." },
  { id: 6, title: "Building Trust Through Charity", date: "Nov 18, 2025", preview: "Why accountability matters in Islamic philanthropy and how we ensure it." },
];

const Blog = () => {
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Blog</h1>
          <p className="text-muted-foreground text-lg">Stories, updates, and reflections from our journey.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Calendar size={12} className="text-primary" />
                {post.date}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.preview}</p>
              <span className="text-sm text-primary font-medium">Read More →</span>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
