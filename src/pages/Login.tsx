import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const { t } = useLanguage();
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  // Redirect if already logged in
  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgot) {
        const { error } = await resetPassword(form.email);
        if (error) throw error;
        toast.success("Password reset email sent! Check your inbox.");
        setIsForgot(false);
      } else if (isSignup) {
        const { error } = await signUp(form.email, form.password, form.name, form.phone);
        if (error) throw error;
        toast.success("Account created! Please check your email to verify.");
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
                <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
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
              placeholder="email@example.com"
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {!isForgot && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("login.password")}</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
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
