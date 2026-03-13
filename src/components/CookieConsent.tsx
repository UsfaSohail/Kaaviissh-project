import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[200] p-4"
        >
          <div className="container mx-auto max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <Cookie size={24} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium mb-1">We use cookies to improve your experience.</p>
                <p className="text-xs text-muted-foreground">By accepting, you allow us to use session and preference cookies. You can reject non-essential cookies.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4 justify-end">
              <Button variant="ghost" size="sm" onClick={handleReject} className="text-muted-foreground">
                Reject
              </Button>
              <Button variant="hero" size="sm" onClick={handleAccept}>
                Accept
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;