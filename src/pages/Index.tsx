import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown, Eye, Target } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-background/75" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight" dir="rtl">
            میری ہر کاوش میرے رب کے نام
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10">
            Serving humanity with compassion, dignity, and faith.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donate">
              <Button variant="hero">Donate Now</Button>
            </Link>
            <Link to="/apply">
              <Button variant="heroOutline">Apply for Help</Button>
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown size={28} className="text-muted-foreground animate-scroll-down" />
        </div>
      </section>

      {/* Hadith Section */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-xl md:text-2xl text-foreground italic leading-relaxed font-light">
            "The believer's shade on the Day of Resurrection will be his charity."
          </p>
          <p className="text-primary mt-4 text-sm font-medium">— Prophet Muhammad (ﷺ)</p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target size={20} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              KAAVIISH is dedicated to uplifting underprivileged communities across Pakistan through ration drives,
              financial assistance, and sustained welfare programs. We bridge the gap between those who can give
              and those in dire need, ensuring every contribution reaches the right hands.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye size={20} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              A Pakistan where no family goes to bed hungry, where every deserving individual has access to
              basic necessities, and where charity is a way of life guided by Islamic values of empathy and service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold text-foreground mb-6">About KAAVIISH</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">
            Founded with a deep commitment to Islamic philanthropy, KAAVIISH is a non-profit foundation
            based in Pakistan. We organize ration drives, provide emergency relief, and support families
            in overcoming poverty with dignity and respect.
          </p>
          <Link to="/drives">
            <Button variant="heroOutline" size="lg">
              View Our Drives →
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
