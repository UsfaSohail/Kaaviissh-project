import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Courses = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <BookOpen size={36} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">{t("courses.title")}</h1>
        <p className="text-muted-foreground text-lg">{t("courses.coming")}</p>
      </motion.div>
    </div>
  );
};

export default Courses;
