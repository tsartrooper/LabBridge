"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useServerAction } from "zsa-react";
import { sendMessage } from "../actions"

interface MessageFormProps {
  collaborationId: string;
}

export default function MessageForm({ collaborationId }: MessageFormProps) {
  const [message, setMessage] = useState("");
  const { execute, isPending } = useServerAction(sendMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await execute({
        collaborationId,
        content: message.trim()
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 min-h-[40px] resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button 
        type="submit" 
        disabled={isPending || !message.trim()}
        size="sm"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}