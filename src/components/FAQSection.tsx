import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQS = [
  {
    q: "How can I donate through Kaaviissh?",
    a: "You can donate using EasyPaisa, JazzCash, SadaPay, or direct bank transfer through the donation section on our website.",
  },
  {
    q: "How long does application review take?",
    a: "Applications are usually reviewed within 2–5 working days after document verification by our admin team.",
  },
  {
    q: "Can I apply as a volunteer?",
    a: "Yes, anyone interested in community welfare can apply through the Volunteer section and our team will contact shortlisted applicants.",
  },
  {
    q: "How do I know my donation is being used properly?",
    a: "Kaaviissh maintains transparency through verified cases, impact updates, and success stories shared on the platform.",
  },
  {
    q: "Will I receive updates about my application or donation?",
    a: "Yes, users receive in-app notifications and status updates when applications or donations are approved, rejected, or verified.",
  },
];

const FAQSection = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <HelpCircle size={14} /> FAQ
          </div>
          <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-2">Everything you need to know before getting involved</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-2 sm:p-4"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
                <AccordionTrigger className="text-start text-foreground hover:text-primary px-3">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground px-3 leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
