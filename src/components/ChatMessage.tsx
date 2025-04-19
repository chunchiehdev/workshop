import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
  isTyping?: boolean;
  typingContent?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  isUser,
  timestamp,
  isTyping = false,
  typingContent = "",
}) => {
  // 根據是否正在輸入決定顯示內容
  const displayContent = isTyping ? typingContent : content;
  
  // 格式化時間戳
  const formattedTimestamp = React.useMemo(() => {
    if (!timestamp) return "";
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";
      
      // 只顯示時間 HH:MM 格式
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  }, [timestamp]);
  
  return (
    <div
      className={cn(
        "flex w-full gap-4 py-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-10 w-10 mt-1">
          <AvatarImage src="/bot-avatar.png" alt="Bot" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        <div className="whitespace-pre-wrap text-sm md:text-base">
          {displayContent || (isTyping ? "" : "...")}
          {isTyping && (
            <span className="inline-block animate-pulse">▊</span>
          )}
        </div>
        {formattedTimestamp && !isTyping && (
          <div className="text-right text-xs opacity-70">
            {formattedTimestamp}
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="h-10 w-10 mt-1">
          <AvatarImage src="/user-avatar.png" alt="User" />
          <AvatarFallback className="bg-muted">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}; 