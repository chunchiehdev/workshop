import { useState, useEffect } from "react";

interface ClientMessage {
  id: number;
  content: string;
  isBot: boolean;
  timestamp: Date;
  pending?: boolean;
  isTyping?: boolean;
  isUser: boolean;
}

interface UseTypingEffectProps {
  messages: ClientMessage[];
  typingSpeed: number;
}

export function useTypingEffect({ messages, typingSpeed }: UseTypingEffectProps) {
  const [currentTypingIndex, setCurrentTypingIndex] = useState<number>(-1);
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  // 找到需要打字效果的消息
  useEffect(() => {
    const typingMessageIndex = messages.findIndex(msg => msg.isTyping);
    if (typingMessageIndex >= 0 && currentTypingIndex === -1) {
      setCurrentTypingIndex(typingMessageIndex);
      setDisplayedText("");
      setIsTyping(true);
    }
  }, [messages, currentTypingIndex]);
  
  // 打字機效果
  useEffect(() => {
    const typingMessage = messages.find((_, index) => index === currentTypingIndex);
    
    if (typingMessage && typingMessage.isTyping) {
      if (displayedText.length < typingMessage.content.length) {
        // 設置定時器增加顯示的文字長度
        const timeout = setTimeout(() => {
          setDisplayedText(typingMessage.content.substring(0, displayedText.length + 1));
        }, typingSpeed);
        
        return () => clearTimeout(timeout);  // 清理計時器
      } else {
        // 完成打字效果，更新消息狀態
        setCurrentTypingIndex(-1);
        setIsTyping(false);
      }
    }
  }, [messages, currentTypingIndex, displayedText, typingSpeed]);
  
  return {
    currentTypingIndex,
    setCurrentTypingIndex,
    displayedText,
    setDisplayedText,
    typedText: displayedText,
    isTyping
  };
} 