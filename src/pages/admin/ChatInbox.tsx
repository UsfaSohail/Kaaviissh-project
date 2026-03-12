import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle } from "lucide-react";

const ChatInbox = () => {
  const { messages, sendMessage, markResolved } = useChat();
  const { user } = useAuth();
  const [reply, setReply] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Group messages by user
  const grouped = messages.reduce((acc, msg) => {
    if (!acc[msg.user_id]) acc[msg.user_id] = [];
    acc[msg.user_id].push(msg);
    return acc;
  }, {} as Record<string, typeof messages>);

  const userIds = Object.keys(grouped);

  const handleReply = async () => {
    if (!reply.trim() || !selectedUser) return;
    await sendMessage({ user_id: selectedUser, message: reply, sender: "admin" });
    setReply("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Chat Inbox</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        {/* User list */}
        <div className="bg-card border border-border rounded-xl overflow-y-auto">
          {userIds.length === 0 && <p className="p-4 text-center text-muted-foreground text-sm">No chats yet.</p>}
          {userIds.map(uid => {
            const msgs = grouped[uid];
            const lastMsg = msgs[msgs.length - 1];
            const unread = msgs.filter(m => !m.is_read && m.sender === "user").length;
            return (
              <button key={uid} onClick={() => setSelectedUser(uid)} className={`w-full text-start p-4 border-b border-border/50 hover:bg-secondary/30 transition-colors ${selectedUser === uid ? "bg-secondary/50" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground font-medium truncate">{uid.slice(0, 8)}...</span>
                  {unread > 0 && <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">{unread}</span>}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">{lastMsg.message}</p>
              </button>
            );
          })}
        </div>

        {/* Chat area */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-3 border-b border-border flex items-center justify-between">
                <span className="text-sm text-foreground font-medium">Chat with {selectedUser.slice(0, 8)}...</span>
                <Button variant="ghost" size="sm" onClick={() => markResolved(selectedUser)} className="text-xs gap-1">
                  <CheckCircle size={14} /> Mark Resolved
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {grouped[selectedUser]?.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${msg.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                      {msg.message}
                      <p className="text-xs opacity-60 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === "Enter" && handleReply()} placeholder="Type a reply..." className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
                <Button onClick={handleReply} size="sm"><Send size={14} /></Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Select a conversation</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInbox;
