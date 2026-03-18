import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Eye, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

/* 🔥 Disable browser native password reveal icon */
const disableNativePasswordIcon = `
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear,
input[type="password"]::-webkit-password-toggle-button,
input[type="password"]::-webkit-credentials-auto-fill-button {
  display: none !important;
  -webkit-appearance: none;
}
`;
const style = document.createElement("style");
style.appendChild(document.createTextNode(disableNativePasswordIcon));
document.head.appendChild(style);

const BLOCKED_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "trashmail.com",
  "fakeinbox.com"
];

const validateEmailDomain = (email: string): boolean => {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  if (BLOCKED_DOMAINS.includes(domain)) return false;
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) return false;
  return true;
};

const Login = () => {
  const { t } = useLanguage();
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    if (key === "email") setEmailError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmailDomain(form.email)) {
      setEmailError("Please use a valid email address (e.g. Gmail, Yahoo, Outlook).");
      return;
    }

    setLoading(true);
    try {
      if (isForgot) {
        const { error } = await resetPassword(form.email);
        if (error) throw error;
        toast.success("Password reset email sent! Check your inbox.");
        setIsForgot(false);
      } else if (isSignup) {
        const { error } = await signUp(form.email, form.password, form.name, form.phone);
        if (error) {
          if (error.message?.includes("already registered")) {
            toast.error("An account with this email already exists. Please sign in instead.");
          } else {
            throw error;
          }
          return;
        }
        toast.success("Account created successfully!");
        setSignupSuccess(true);
      } else {
        const { error } = await signIn(form.email, form.password);
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Account Created!</h2>
          <p className="text-muted-foreground mb-6">
            Your account has been created successfully. Please sign in to continue.
          </p>
          <Button
            variant="hero"
            onClick={() => {
              setSignupSuccess(false);
              setIsSignup(false);
            }}
          >
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isForgot ? "Reset Password" : isSignup ? t("login.signup") : t("login.title")}
          </h1>
          <p className="text-muted-foreground">
            {isForgot ? "Enter your email to receive a reset link" : t("login.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
          {isSignup && !isForgot && (
            <>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{t("login.name")}</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder={t("login.name")}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{t("login.phone")}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("login.email")}</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder={t("login.email")}
              className={`w-full px-4 py-3 rounded-xl bg-secondary border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm ${
                emailError ? "border-destructive" : "border-border"
              }`}
            />
            {emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
          </div>

          {!isForgot && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("login.password")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder={t("login.password")}
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Eye size={18} className="text-white" />
                </button>
              </div>
            </div>
          )}

          <Button variant="hero" type="submit" className="w-full mt-2" disabled={loading}>
            {loading
              ? "Please wait..."
              : isForgot
              ? "Send Reset Link"
              : isSignup
              ? t("login.createaccount")
              : t("login.signin")}
          </Button>

          {!isForgot && !isSignup && (
            <p className="text-center text-xs text-muted-foreground">
              <button type="button" onClick={() => setIsForgot(true)} className="text-primary hover:underline">
                Forgot password?
              </button>
            </p>
          )}

          <p className="text-center text-sm text-muted-foreground mt-4">
            {isForgot ? (
              <button type="button" onClick={() => setIsForgot(false)} className="text-primary hover:underline font-medium">
                Back to login
              </button>
            ) : (
              <>
                {isSignup ? t("login.hasaccount") : t("login.noaccount")}{" "}
                <button type="button" onClick={() => setIsSignup(!isSignup)} className="text-primary hover:underline font-medium">
                  {isSignup ? t("login.signin") : t("login.signup")}
                </button>
              </>
            )}
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;