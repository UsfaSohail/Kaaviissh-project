import { Link } from "react-router-dom";
import { Mail, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/kaaviissh-logo.jpeg";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="KAAVIISSH Foundation Logo" className="h-12 w-12 rounded-lg object-cover" />
              <div>
                <h3 className="text-xl font-bold text-foreground tracking-wider">KAAVIISSH</h3>
                <span className="text-sm font-bold text-primary" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>کاوش</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{t("footer.tagline")}</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("footer.contact")}</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail size={14} className="text-primary" /> kaaviissh@gmail.com</div>
              <a href="https://instagram.com/kaaviissh" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={14} className="text-primary" /> @kaaviissh
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("footer.legal")}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("footer.privacy")}</Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("footer.terms")}</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
