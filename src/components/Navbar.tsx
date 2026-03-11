import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/kaaviissh-logo.jpeg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const { user, signOut, isAdmin } = useAuth();

  const navLinks = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.drives"), path: "/drives" },
    { label: t("nav.zakat"), path: "/zakat" },
    { label: t("nav.apply"), path: "/apply" },
    { label: t("nav.courses"), path: "/courses" },
    { label: t("nav.blog"), path: "/blog" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="KAAVIISSH Foundation Logo" className="h-9 w-9 rounded-lg object-cover" />
          <span className="text-xl font-bold tracking-wider text-foreground">KAAVIISSH</span>
          <span className="text-lg font-bold text-primary" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>کاوش</span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "ur" : "en")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe size={16} />
            {lang === "en" ? "اردو" : "English"}
          </button>
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                {t("nav.login")}
              </Button>
            </Link>
          )}
          <Link to="/donate">
            <Button variant="hero" size="sm" className="px-6 py-2 text-sm">
              {t("nav.donate")}
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { setLang(lang === "en" ? "ur" : "en"); }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe size={16} />
                {lang === "en" ? "اردو" : "English"}
              </button>
              {user ? (
                <Button variant="ghost" className="w-full mt-1 py-3 text-sm" onClick={() => { handleSignOut(); setOpen(false); }}>
                  <LogOut size={16} className="mr-2" /> Logout
                </Button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full mt-1 py-3 text-sm">
                    {t("nav.login")}
                  </Button>
                </Link>
              )}
              <Link to="/donate" onClick={() => setOpen(false)}>
                <Button variant="hero" className="w-full mt-1 py-3 text-sm">
                  {t("nav.donate")}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
