import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Chat = Tables<"chats">;

export const useChat = (userId?: string) => {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    let query = supabase.from("chats").select("*").order("created_at", { ascending: true });
    if (userId) query = query.eq("user_id", userId);
    const { data } = await query;
    if (data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel("chats-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "chats" }, () => fetchMessages())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const sendMessage = async (msg: { user_id: string; message: string; sender: string }) => {
    const { error } = await supabase.from("chats").insert(msg);
    return { error };
  };

  const markRead = async (id: string) => {
    await supabase.from("chats").update({ is_read: true }).eq("id", id);
  };

  const markResolved = async (userId: string) => {
    await supabase.from("chats").update({ is_resolved: true }).eq("user_id", userId);
  };

  const deleteChat = async (id: string) => {
    await supabase.from("chats").delete().eq("id", id);
  };

  return { messages, loading, sendMessage, markRead, markResolved, deleteChat, refetch: fetchMessages };
};
