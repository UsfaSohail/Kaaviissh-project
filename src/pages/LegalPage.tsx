import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const LegalPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useLanguage();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const key = slug === "privacy-policy" ? "privacy_policy" : "terms_of_service";
  const title = slug === "privacy-policy" ? t("footer.privacy") : t("footer.terms");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("legal_content" as any)
        .select("*")
        .eq("key", key)
        .maybeSingle();
      if (data) {
        setContent(lang === "ur" ? (data as any).body_ur : (data as any).body_en);
      }
      setLoading(false);
    };
    fetch();
  }, [key, lang]);

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-foreground mb-8">{title}</h1>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-secondary rounded w-3/4" />
              <div className="h-4 bg-secondary rounded w-1/2" />
            </div>
          ) : (
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LegalPage;