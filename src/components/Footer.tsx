import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-foreground tracking-wider">KAAVIISH</h3>
              <span className="text-lg font-bold text-primary" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>کاویش</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("footer.quicklinks")}</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: t("nav.home"), path: "/" },
                { label: t("nav.drives"), path: "/drives" },
                { label: t("nav.donate"), path: "/donate" },
                { label: t("nav.zakat"), path: "/zakat" },
                { label: t("nav.courses"), path: "/courses" },
                { label: t("nav.blog"), path: "/blog" },
              ].map((l) => (
                <Link key={l.path} to={l.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("footer.contact")}</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} className="text-primary" />
                info@kaaviish.org
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} className="text-primary" />
                +92 300 1234567
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin size={14} className="text-primary mt-0.5" />
                Lahore, Pakistan
              </div>
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
