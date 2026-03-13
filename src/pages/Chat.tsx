import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const Chat = () => {
  const { user } = useAuth();
  const { messages, sendMessage } = useChat(user?.id);
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    await sendMessage({ user_id: user.id, message: input.trim(), sender: "user" });
    setInput("");
  };

  if (!user) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <MessageCircle size={48} className="text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">{t("chat.title")}</h2>
          <p className="text-muted-foreground mb-6">{t("chat.loginRequired")}</p>
          <Link to="/login"><Button variant="hero">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  const userMessages = messages.filter(m => m.user_id === user.id);

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-6 text-center">{t("chat.title")}</h1>

        <div className="bg-card border border-border rounded-2xl flex flex-col" style={{ height: "calc(100vh - 220px)" }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {userMessages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm text-center">
                  {t("chat.empty")}<br />
                  <span className="text-xs italic">{t("chat.offline")}</span>
                </p>
              </div>
            )}
            {userMessages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.sender === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-foreground rounded-bl-md"}`}>
                  {msg.message}
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-xs opacity-60">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    {msg.sender === "user" && msg.is_read && <span className="text-xs opacity-60">✓✓</span>}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={t("chat.placeholder")}
              className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={handleSend} variant="hero" size="sm" className="px-4">
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;