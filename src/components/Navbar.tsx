import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, LogOut, Shield, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import LogoutDialog from "@/components/LogoutDialog";
import NotificationBell from "@/components/NotificationBell";
import logo from "@/assets/kaaviissh-logo.jpeg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const { user, signOut, isAdmin } = useAuth();

  const navLinks = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.drives"), path: "/drives" },
    { label: t("nav.zakat"), path: "/zakat" },
    { label: t("nav.apply"), path: "/apply" },
    { label: "Volunteer", path: "/volunteer" },
    { label: "Stories", path: "/success-stories" },
    { label: t("nav.courses"), path: "/courses" },
    { label: t("nav.blog"), path: "/blog" },
    { label: t("nav.chat"), path: "/chat" },
  ];

  const handleSignOut = async () => {
    setLogoutOpen(false);
    await signOut();
    navigate("/");
  };

  // Determine font size/padding depending on admin
  const linkClasses = isAdmin
    ? "px-2 py-1 rounded-md text-xs font-medium transition-colors"
    : "px-3 py-2 rounded-lg text-sm font-medium transition-colors";

  const buttonClasses = isAdmin
    ? "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors"
    : "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="KAAVIISSH Foundation Logo" className="h-9 w-9 rounded-lg object-cover" />
            <span className="text-xl font-bold tracking-wider text-foreground">KAAVIISSH</span>
            <span className="text-lg font-bold text-primary" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>کاوش</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${linkClasses} ${
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
              className={`${buttonClasses} text-muted-foreground hover:text-foreground`}
            >
              <Globe size={16} />
              {lang === "en" ? "اردو" : "English"}
            </button>

            {user && (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`${buttonClasses} text-primary hover:text-primary/80`}
                  >
                    <Shield size={16} />
                    {t("nav.admin")}
                  </Link>
                )}

                {!isAdmin && (
                  <Link
                    to="/profile"
                    className={`${buttonClasses} text-muted-foreground hover:text-foreground`}
                  >
                    <User size={16} />
                    Profile
                  </Link>
                )}

                <button
                  onClick={() => setLogoutOpen(true)}
                  className={`${buttonClasses} text-muted-foreground hover:text-foreground`}
                >
                  <LogOut size={16} />
                  {t("nav.logout")}
                </button>
              </>
            )}

            {!user && (
              <Link to="/login">
                <Button variant="ghost" size="sm" className={isAdmin ? "text-xs px-2 py-1" : "text-sm"}>{t("nav.login")}</Button>
              </Link>
            )}

            <Link to="/donate">
              <Button variant="hero" size="sm" className={isAdmin ? "px-4 py-1 text-xs" : "px-6 py-2 text-sm"}>{t("nav.donate")}</Button>
            </Link>
          </div>

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
                    className={`${linkClasses} ${
                      location.pathname === link.path
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <button
                  onClick={() => setLang(lang === "en" ? "ur" : "en")}
                  className={`${buttonClasses} text-muted-foreground hover:text-foreground`}
                >
                  <Globe size={16} />
                  {lang === "en" ? "اردو" : "English"}
                </button>

                {user && (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className={`${buttonClasses} text-primary`}
                      >
                        <Shield size={16} /> {t("nav.admin")}
                      </Link>
                    )}

                    {!isAdmin && (
                      <Link
                        to="/profile"
                        onClick={() => setOpen(false)}
                        className={`${buttonClasses} text-muted-foreground hover:text-foreground`}
                      >
                        <User size={16} /> Profile
                      </Link>
                    )}

                    <Button
                      variant="ghost"
                      className={`w-full mt-1 py-1 ${isAdmin ? "text-xs" : "text-sm"}`}
                      onClick={() => {
                        setOpen(false);
                        setLogoutOpen(true);
                      }}
                    >
                      <LogOut size={16} className="mr-2" /> {t("nav.logout")}
                    </Button>
                  </>
                )}

                {!user && (
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className={isAdmin ? "w-full py-1 text-xs" : "w-full py-3 text-sm"}>{t("nav.login")}</Button>
                  </Link>
                )}

                <Link to="/donate" onClick={() => setOpen(false)}>
                  <Button variant="hero" className={isAdmin ? "w-full py-1 text-xs" : "w-full py-3 text-sm"}>{t("nav.donate")}</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <LogoutDialog open={logoutOpen} onConfirm={handleSignOut} onCancel={() => setLogoutOpen(false)} />
    </>
  );
};

export default Navbar;