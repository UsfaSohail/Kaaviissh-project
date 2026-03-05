import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const posts = [
  {
    id: 1,
    title: "A Friday in Shahdara: What We Saw on the Ground",
    date: "March 14, 2025",
    category: "Field Report",
    preview: "Last Friday, our volunteers loaded three vehicles with ration bags and drove into the narrow lanes of Shahdara, Lahore. What we found there stayed with us long after we returned home.",
    body: `It was 7:30 in the morning when our team of six volunteers gathered outside the KAAVIISSH office. The vehicles were already packed — 28 ration bags, each containing flour, lentils, rice, cooking oil, sugar, tea, and powdered milk. The destination was a cluster of katchi abadis on the outskirts of Shahdara that a local contact had flagged to us three weeks earlier.

The streets grew narrower as we drove deeper in. By the time we parked, we were in an alley barely wide enough for one car. Children in school uniforms stared at us from doorways. A few elderly men sat outside on charpoys, watching quietly.

Our contact, Ustad Saleem — a retired school teacher who has lived in this neighbourhood for 40 years — walked us through the community. He knew every family by name. He knew which houses had a sick father, which had a widow managing six children alone, which had a young man who lost his job at a factory three months ago and had not found another.

The distribution took four hours. We did not simply hand over bags and leave. We sat with families. We listened. One woman, perhaps in her late fifties, took the ration bag and immediately began to cry — not dramatically, quietly. She said she had not been able to buy flour for four days. Her son had gone to look for daily wage work at 5am and had not yet returned.

The Prophet Muhammad ﷺ said: "The one who looks after a widow or a poor person is like a warrior who fights for Allah's cause." That morning in Shahdara, we understood the weight of those words in a way no lecture could have taught us.

We returned home quieter than we left. If you have ever wondered whether your donation reaches real people — it does. We saw their faces. We know their names. And we will go back.`,
  },
  {
    id: 2,
    title: "Zakat Explained: Who Must Pay, How to Calculate, and Who Truly Qualifies",
    date: "February 22, 2025",
    category: "Islamic Education",
    preview: "Zakat is one of the Five Pillars of Islam, yet many Pakistani Muslims are unsure whether they owe it, how much it is, and whether they are giving it correctly. This guide answers all three questions clearly.",
    body: `Every year as Ramadan approaches, the same questions circulate in households across Pakistan. Do I owe Zakat this year? Does gold jewellery count? What about money I have lent to someone? Can I give Zakat to my own relative? These are not trivial questions — getting Zakat wrong, either by not paying it or by paying it to someone who does not qualify, is a matter of religious seriousness.

What is Nisab?

Nisab is the minimum threshold of wealth above which Zakat becomes obligatory. It is calculated using either 87.48 grams of gold or 612.36 grams of silver, with scholars recommending the silver standard as it includes more people in the obligation and benefits more recipients. If your net wealth — assets minus immediate liabilities — has remained above Nisab for one full Islamic lunar year, Zakat is due.

What counts as wealth?

Cash in hand and in bank accounts, gold and silver (including jewellery in the majority scholarly opinion), business inventory valued at market price, and money others owe you that you expect to receive. What does not count: your home you live in, your personal vehicle, household furniture, and clothing.

Who are the eight categories of Zakat recipients?

The Quran in Surah At-Tawbah (9:60) defines them: the poor (fuqara), the destitute (masakeen), those employed to collect Zakat, those whose hearts are to be reconciled, those in bondage, those in debt, those in the way of Allah, and the stranded traveller. In the Pakistani context, the most common and straightforward recipients are families below the poverty line who do not own sufficient wealth themselves.

The Prophet Muhammad ﷺ said: "Zakat is a due that purifies your wealth." This is not charity in the ordinary sense — it is a right that the poor hold over the wealthy. It is purification, not generosity.

A common mistake to avoid: Many people give Zakat to a relative thinking it does not count. In fact, giving to a qualifying relative — a sibling, uncle, cousin in genuine need — is not only valid but earns additional reward as both Zakat and maintaining family ties (silat ul rahm). However, you cannot give Zakat to your spouse, parents, grandparents, or children.

If you are unsure of your calculation, use our Zakat Calculator on this website. It uses current gold and silver market rates and walks you through assets and liabilities step by step. May Allah accept it from all of us.`,
  },
  {
    id: 3,
    title: "Noor Ki Ammi: The Story Behind the DVT Surgery Campaign",
    date: "March 1, 2025",
    category: "Human Stories",
    preview: "She is 31 years old, mother of a four-year-old and a seven-year-old, and three weeks ago she could not walk without help. This is the story behind our DVT Surgery campaign and why it cannot wait.",
    body: `Her name, for privacy, we will keep as Umm Noor — the mother of Noor. She lives in a rented two-room house in the Samanabad area of Lahore with her husband, two children, and her mother-in-law. Her husband works as a motorcycle mechanic at a small roadside workshop. The household income is approximately Rs. 30,000 a month, of which Rs. 12,000 goes to rent alone.

Six weeks ago, Umm Noor began experiencing severe swelling and pain in her left leg. At first she ignored it, assuming it was exhaustion. When the pain became unbearable, her husband took her to a government hospital. The diagnosis was Deep Vein Thrombosis — a blood clot in the deep veins of her leg. The doctor was direct: without surgical intervention soon, the clot could travel to her lungs. The consequences of that, he did not need to elaborate.

The surgery and associated costs total Rs. 27,000. To many reading this, that may seem like a small amount. For this family, it is nearly a full month's income — income they cannot sacrifice because there is rent due, because two children need to eat, because the motorcycle mechanic cannot take time off unpaid to care for a recovering wife without the household collapsing.

We were connected to this family through a local mosque committee that knew them and vouched for their situation. Our team conducted a verification visit. We sat in their home. We saw the medical reports. We spoke to Umm Noor, who spent most of the conversation worrying not about herself but about who would take her daughter to school while she recovers.

The Prophet Muhammad ﷺ said: "Whoever relieves a believer's distress of the distressful aspects of this world, Allah will rescue him from a difficulty of the difficulties of the Hereafter."

Umm Noor's campaign is live on our Drives page. The goal is Rs. 27,000. Every rupee goes directly to the hospital. We will post an update with the surgical outcome once it is complete, with her permission. If you can give anything — Rs. 500, Rs. 1,000, whatever Allah has blessed you with today — please do not delay. Her situation does not have the luxury of waiting.`,
  },
];

const Blog = () => {
  const { t } = useLanguage();
  const [selectedPost, setSelectedPost] = useState<typeof posts[0] | null>(null);

  if (selectedPost) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button variant="ghost" onClick={() => setSelectedPost(null)} className="mb-6 text-muted-foreground hover:text-foreground">
              <ArrowLeft size={16} /> Back to Blog
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Tag size={10} /> {selectedPost.category}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={10} /> {selectedPost.date}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-6">{selectedPost.title}</h1>
            <div className="prose prose-invert max-w-none">
              {selectedPost.body.split("\n\n").map((p, i) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedPost(post)}
              className="bg-card border border-border rounded-2xl p-6 cursor-pointer group
                transition-all duration-300 ease-out
                hover:-translate-y-2 hover:shadow-[0_12px_32px_-8px_hsl(var(--primary)/0.2)]
                hover:border-primary/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Tag size={10} /> {post.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar size={12} />
                  {post.date}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{post.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.preview}</p>
              <span className="text-sm text-primary font-medium inline-flex items-center gap-1 transition-all duration-300 group-hover:gap-2">
                {t("blog.readmore")} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
