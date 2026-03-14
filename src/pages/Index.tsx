import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Eye, Target, Users, Package, Heart, HandHeart, Minus, Plus } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuotes } from "@/hooks/useQuotes";
import { useImpactCounter } from "@/hooks/useImpactCounter";
import { useRationBagItems } from "@/hooks/useRationBagItems";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Animated counter component
const AnimatedCounter = ({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{prefix}{typeof target === "number" && target > 999 ? count.toLocaleString() : count}{suffix}</span>;
};

const Index = () => {
  const { t, lang } = useLanguage();
  const { quotes } = useQuotes();
  const { impact } = useImpactCounter();
  const { items: rationItems } = useRationBagItems();
  const [bagPrice, setBagPrice] = useState(10000);
  const [bagQty, setBagQty] = useState(1);
  const quote = quotes[0];

  useEffect(() => {
    supabase.from("ration_bag_config" as any).select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) setBagPrice(Number((data as any).total_price));
    });
  }, []);

  const impactStats = impact ? [
    { label: t("impact.familiesHelped"), value: impact.families_helped, icon: Users },
    { label: t("impact.rationBags"), value: impact.ration_bags_distributed, icon: Package },
    { label: t("impact.totalDonations"), value: Number(impact.total_donations), icon: Heart, prefix: "Rs. " },
    { label: t("impact.volunteers"), value: impact.volunteers_count, icon: HandHeart },
  ] : [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-background/75" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="font-bold text-foreground leading-tight whitespace-nowrap"
            dir="rtl"
            style={{
              fontFamily: "'Noto Nastaliq Urdu', serif",
              fontSize: "clamp(1.5rem, 5vw, 3.75rem)",
            }}
          >
            {t("hero.tagline")}
          </h1>
          <p className="text-base md:text-xl text-muted-foreground mb-10 mt-6">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donate"><Button variant="hero">{t("hero.donate")}</Button></Link>
            <Link to="/apply"><Button variant="heroOutline">{t("hero.apply")}</Button></Link>
          </div>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown size={28} className="text-muted-foreground animate-scroll-down" />
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-4">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-2xl mx-auto text-center">
          {quote ? (
            <>
              <p className="text-xl md:text-2xl text-foreground italic leading-relaxed font-light">
                "{lang === "ur" ? quote.text_ur : quote.text_en}"
              </p>
              <p className="text-primary mt-4 text-sm font-medium">
                {lang === "ur" ? quote.source_ur : quote.source_en}
              </p>
            </>
          ) : (
            <>
              <p className="text-xl md:text-2xl text-foreground italic leading-relaxed font-light">{t("hadith.text")}</p>
              <p className="text-primary mt-4 text-sm font-medium">{t("hadith.source")}</p>
            </>
          )}
        </motion.div>
      </section>

      {/* Ration Bag Section */}
      {rationItems.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-foreground text-center mb-10">{t("rationBag.title")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {rationItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, boxShadow: "0 8px 30px -10px hsl(152 88% 30% / 0.3)" }}
                  className="bg-card border border-border rounded-2xl p-5 text-center transition-all"
                >
                  <p className="text-foreground font-medium text-sm">{lang === "ur" ? item.item_name_ur : item.item_name_en}</p>
                  {item.quantity && (
                    <p className="text-xs text-muted-foreground mt-1">{item.quantity} {item.unit}</p>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="text-center space-y-4">
              {/* Quantity selector */}
              <div className="flex items-center justify-center gap-4 mb-2">
                <button
                  onClick={() => setBagQty(Math.max(1, bagQty - 1))}
                  className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-2xl font-bold text-foreground min-w-[3rem] text-center">{bagQty}</span>
                <button
                  onClick={() => setBagQty(bagQty + 1)}
                  className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors"
                >
                  <Plus size={16} />
                </button>
                <span className="text-sm text-muted-foreground">
                  {bagQty === 1 ? "bag" : "bags"} for {bagQty === 1 ? "1 family" : `${bagQty} families`}
                </span>
              </div>
              <Link to={`/donate?type=Ration&amount=${bagPrice * bagQty}`}>
                <Button variant="hero" size="lg">
                  {t("rationBag.donate")} — Rs. {(bagPrice * bagQty).toLocaleString()}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Impact Counter */}
      {impact && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-foreground text-center mb-10">{t("impact.title")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impactStats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 30px -10px hsl(152 88% 30% / 0.3)" }}
                  className="bg-card border border-border rounded-2xl p-6 text-center transition-all cursor-default"
                >
                  <s.icon size={24} className="text-primary mx-auto mb-3" />
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    <AnimatedCounter target={s.value} prefix={s.prefix || ""} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 30px -10px hsl(152 88% 30% / 0.3)" }}
            className="bg-card rounded-2xl p-8 border border-border transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Target size={20} className="text-primary" /></div>
              <h2 className="text-2xl font-bold text-foreground">{t("mission.title")}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">{t("mission.text")}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 30px -10px hsl(152 88% 30% / 0.3)" }}
            className="bg-card rounded-2xl p-8 border border-border transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Eye size={20} className="text-primary" /></div>
              <h2 className="text-2xl font-bold text-foreground">{t("vision.title")}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">{t("vision.text")}</p>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">{t("about.title")}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">{t("about.text")}</p>
          <Link to="/drives"><Button variant="heroOutline" size="lg">{t("about.cta")}</Button></Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
