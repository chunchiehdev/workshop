import { useState, useEffect, useRef } from "react";
import { MessageResponse } from "@/services/chatService";

// 客戶端消息類型，包含臨時ID用於消息追踪
export interface ClientMessage {
  id: number;
  content: string;
  isBot: boolean;
  timestamp: Date;
  pending?: boolean;
  isTyping?: boolean;
}

interface UseChatMessagesProps {
  conversation: {
    id: number;
    messages: MessageResponse[];
  } | null | undefined;
  botName: string;
  botRole: string;
  botGoal: string;
  conversationId: number | null;
  onSetCurrentTypingIndex: (index: number) => void;
  onSetDisplayedText: (text: string) => void;
}

export function useChatMessages({
  conversation,
  botName,
  botRole,
  botGoal,
  conversationId,
  onSetCurrentTypingIndex,
  onSetDisplayedText
}: UseChatMessagesProps) {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const hasAddedWelcomeMessage = useRef(false);

  // 從API消息轉換為客戶端消息格式
  const convertApiMessages = (apiMessages: MessageResponse[]): ClientMessage[] => {
    return apiMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      isBot: msg.is_bot,
      timestamp: new Date(msg.created_at)
    }));
  };
  
  // 加載對話歷史記錄
  useEffect(() => {
    if (!conversation || !conversation.messages.length || !conversationId) {
      return;
    }
    
    const historyMessages = convertApiMessages(conversation.messages);
    setMessages(historyMessages);
  }, [conversation, conversationId]);
  
  // 添加初始問候消息 - 只在初始化時執行一次
  useEffect(() => {
    // 如果沒有對話ID、消息為空，且還沒添加過歡迎訊息
    const shouldAddWelcomeMessage = 
      Boolean(botName) && 
      !conversationId && 
      messages.length === 0 && 
      !hasAddedWelcomeMessage.current;
    
    if (!shouldAddWelcomeMessage) {
      return;
    }
    
    // 檢查session storage中是否已顯示歡迎訊息
    const welcomeMessageKey = `welcomeMessage_${botName}`;
    const hasShownWelcomeMessage = sessionStorage.getItem(welcomeMessageKey);
    
    if (hasShownWelcomeMessage) {
      return;
    }
    
    // 構建歡迎訊息，確保格式自然
    let welcomeContent = `你好！我是 ${botName}`;
    
    if (botRole) {
      welcomeContent += ` - ${botRole}`;
    }
    
    welcomeContent += `。`;
    
    if (botGoal) {
      // 確保 botGoal 本身是完整的句子
      const goalEndsWithPunctuation = /[.!?。！？]$/.test(botGoal.trim());
      
      if (goalEndsWithPunctuation) {
        welcomeContent += ` ${botGoal} `;
      } else {
        welcomeContent += ` ${botGoal}。 `;
      }
    }
    
    welcomeContent += `有什麼我能幫助你的嗎？`;
    
    const welcomeMessage = {
      id: -1,
      content: welcomeContent,
      isBot: true,
      timestamp: new Date(),
      isTyping: true
    };
    
    setMessages([welcomeMessage]);
    onSetCurrentTypingIndex(0);
    onSetDisplayedText('');
    
    // 標記已添加歡迎訊息
    hasAddedWelcomeMessage.current = true;
    sessionStorage.setItem(welcomeMessageKey, 'true');
  }, [botName, botRole, botGoal, conversationId, messages.length, onSetCurrentTypingIndex, onSetDisplayedText]);

  // 添加用戶消息
  const addUserMessage = (content: string): ClientMessage => {
    const userMessage: ClientMessage = {
      id: Date.now(),
      content,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    return userMessage;
  };

  // 添加機器人臨時消息 (輸入中...)
  const addBotPendingMessage = (): number => {
    const pendingMessageId = Date.now() + 1;
    const pendingMessage: ClientMessage = {
      id: pendingMessageId,
      content: "",
      isBot: true,
      timestamp: new Date(),
      pending: true
    };
    
    setMessages(prev => [...prev, pendingMessage]);
    return pendingMessageId;
  };

  // 移除臨時消息
  const removePendingMessage = (pendingMessageId: number) => {
    setMessages(prev => {
      // 過濾掉臨時的加載消息
      const filteredMessages = prev.filter(msg => msg.id !== pendingMessageId);
      
      // 替換臨時ID為新的ID以防止其被清除
      return filteredMessages.map(msg => 
        msg.id === -1 ? { ...msg, id: -100 } : msg
      );
    });
  };

  // 添加機器人回應消息
  const addBotResponseMessage = (content: string, messagesLength: number) => {
    const botReplyId = Date.now() + 2;
    const botReply: ClientMessage = {
      id: botReplyId,
      content: content,
      isBot: true,
      timestamp: new Date(),
      isTyping: true
    };
    
    setMessages(prev => [...prev, botReply]);
    onSetCurrentTypingIndex(messagesLength + 1);
    onSetDisplayedText('');
  };

  // 添加錯誤消息
  const addErrorMessage = (errorText: string, pendingMessageId?: number) => {
    setMessages(prev => {
      const filtered = pendingMessageId 
        ? prev.filter(msg => msg.id !== pendingMessageId) 
        : prev.filter(msg => !msg.pending);
        
      const errorMessage: ClientMessage = {
        id: Date.now() + 2,
        content: errorText,
        isBot: true,
        timestamp: new Date(),
        isTyping: true
      };
      
      setTimeout(() => {
        onSetCurrentTypingIndex(filtered.length);
        onSetDisplayedText('');
      }, 10);
      
      return [...filtered, errorMessage];
    });
  };

  // 清空所有消息
  const clearMessages = () => {
    setMessages([]);
    hasAddedWelcomeMessage.current = false;
    
    // 清除session storage中的歡迎訊息標記
    if (botName) {
      sessionStorage.removeItem(`welcomeMessage_${botName}`);
    }
  };

  return {
    messages,
    addUserMessage,
    addBotPendingMessage,
    removePendingMessage,
    addBotResponseMessage,
    addErrorMessage,
    clearMessages
  };
} 