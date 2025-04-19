import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetBot, useSendMessage, useCreateConversation, useGetConversation } from "@/services/queryHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, Loader2, Plus } from "lucide-react";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { ChatMessage } from "@/components/ChatMessage";
import { toast } from "sonner";
import { useChatMessages } from "@/hooks/useChatMessages";

export function BotChatPage() {
  const { botId } = useParams<{ botId: string }>();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  
  const numericBotId = botId ? parseInt(botId, 10) : 0;
  
  // Fetch bot data
  const { data: bot, isLoading: isBotLoading, error: botError } = useGetBot(numericBotId);
  
  // Send message mutation
  const sendMessageMutation = useSendMessage();
  
  // Create new conversation mutation
  const createConversationMutation = useCreateConversation();
  
  // Get conversation data
  const { data: conversation } = useGetConversation(conversationId || 0);

  // Typing effect related state
  const [displayedText, setDisplayedText] = useState("");
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1);
  
  // Use the chat messages hook
  const {
    messages,
    addUserMessage,
    addBotResponseMessage,
    addErrorMessage,
    clearMessages
  } = useChatMessages({
    conversation,
    botName: bot?.name || '',
    botRole: bot?.role || '',
    botGoal: bot?.goal || '',
    conversationId,
    onSetCurrentTypingIndex: setCurrentTypingIndex,
    onSetDisplayedText: setDisplayedText
  });
  
  // 使用 useEffect 手動處理打字效果
  useEffect(() => {
    const typingMessage = messages.find((msg, idx) => idx === currentTypingIndex);
    
    if (typingMessage && typingMessage.isTyping) {
      if (displayedText.length < typingMessage.content.length) {
        // 設置文字打字效果
        const timeout = setTimeout(() => {
          setDisplayedText(typingMessage.content.substring(0, displayedText.length + 1));
        }, 20); // 打字速度
        
        return () => clearTimeout(timeout);
      }
    }
  }, [currentTypingIndex, displayedText, messages]);
  
  // Add useEffect to handle bot not found error (after deletion)
  useEffect(() => {
    if (botError) {
      // If there's an error (likely bot not found after deletion)
      console.error("Bot加載錯誤:", botError);
      
      // Clean up session storage to prevent future issues
      if (bot?.name) {
        sessionStorage.removeItem(`welcomeMessage_${bot.name}`);
      }
      
      // Show notification
      toast("Bot不存在", { 
        description: "這個Bot可能已被刪除，正在返回Bot列表" 
      });
      
      // Immediately clear any local state
      clearMessages();
      setConversationId(null);
      setInitialLoadComplete(false);
      
      // Navigate back to bots list after a short delay
      setTimeout(() => {
        navigate("/bots", { replace: true });
      }, 1000);
    }
  }, [botError, navigate, bot, clearMessages]);

  // Loading state
  const isInitialLoading = !initialLoadComplete && isBotLoading;
  
  // Mark initial load complete after bot data is loaded
  useEffect(() => {
    if (bot && !isBotLoading) {
      setInitialLoadComplete(true);
    }
  }, [bot, isBotLoading]);
  
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, displayedText]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isInitialLoading) return;

    // Add user message
    addUserMessage(input);
    setInput(''); // Clear input    
    
    try {
      setIsLoading(true);
      
      if (!conversationId) {
        // Create new conversation
        const newConversation = await createConversationMutation.mutateAsync({
          bot_id: numericBotId,
          title: input.substring(0, 30)
        });
        
        if (newConversation?.id) {
          setConversationId(newConversation.id);
          
          // Send message and get bot reply
          const botResponse = await sendMessageMutation.mutateAsync({
            conversation_id: newConversation.id,
            message: input,
            bot_id: numericBotId
          });
          
          if (botResponse) {
            addBotResponseMessage(botResponse.reply || "抱歉，我沒有回應。", messages.length);
          }
        }
      } else {
        // Use existing conversation
        const botResponse = await sendMessageMutation.mutateAsync({
          conversation_id: conversationId,
          message: input,
          bot_id: numericBotId
        });
        
        if (botResponse) {
          addBotResponseMessage(botResponse.reply || "抱歉，我沒有回應。", messages.length);
        }
      }
    } catch (error) {
      console.error("發送消息錯誤:", error);
      toast("消息發送失敗", {
        description: "請稍後重試"
      });
      
      // Add error message
      addErrorMessage("發送消息失敗，請稍後重試。");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle back button
  const handleBack = () => {
    navigate("/bots");
  };
  
  // Handle new conversation button
  const handleNewConversation = () => {
    // Clear conversation state
    setConversationId(null);
    clearMessages();
    
    // Reset input state
    setCurrentTypingIndex(-1);
    setDisplayedText('');
    
    // Clear welcome message flag to show it again
    if (bot?.name) {
      sessionStorage.removeItem(`welcomeMessage_${bot.name}`);
    }
  };

  // Clean up function for when component unmounts
  useEffect(() => {
    return () => {
      // Clear session storage when leaving chat page
      if (bot?.name) {
        sessionStorage.removeItem(`welcomeMessage_${bot.name}`);
      }
    };
  }, [bot]);

  // Loading or error state
  if (isInitialLoading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (botError || !bot) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-red-500 mb-4">無法加載此機器人的數據</p>
            <p className="text-gray-500 mb-4">這個Bot可能已被刪除或不存在</p>
            <Button onClick={handleBack}>返回機器人列表</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/bots")}
            className="rounded-full hover:bg-gray-100 border-gray-200 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4 text-gray-700" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{bot?.name || "聊天"}</h1>
            {bot?.role && (
              <p className="text-xs text-gray-500">{bot.role}</p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNewConversation}
          className="rounded-full hover:bg-gray-100 border-gray-200 h-8 w-8"
        >
          <Plus className="h-4 w-4 text-gray-700" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-3xl mx-auto p-4 space-y-4 pb-6">
          {messages.map((message, index) => {
            // 確定是否是目前正在輸入的訊息
            const isCurrentTypingMessage = message.isTyping && index === currentTypingIndex;
            // 決定顯示的內容
            const displayContent = isCurrentTypingMessage ? displayedText : message.content;
            
            return (
              <ChatMessage
                key={message.id}
                content={displayContent}
                isUser={!message.isBot}
                timestamp={message.timestamp.toISOString()}
                isTyping={isCurrentTypingMessage}
                typingContent={displayContent}
              />
            );
          })}
          
          {isLoading && !messages.some(m => m.isTyping) && (
            <div className="flex items-center justify-center py-4">
              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 mr-1"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400 mr-1" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400" style={{ animationDelay: "0.4s" }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-50 flex-shrink-0">
        <div className="relative flex items-center rounded-lg border max-w-3xl mx-auto shadow-sm bg-white">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="請輸入您的消息..."
            className="min-h-[56px] max-h-[200px] w-full resize-none rounded-lg border-0 bg-gray-100 p-4 pr-12 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            disabled={sendMessageMutation.isPending}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-3 rounded-full hover:bg-blue-100 h-10 w-10 transition-colors"
            disabled={sendMessageMutation.isPending || !input.trim()}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            ) : (
              <Send className="h-5 w-5 text-blue-600" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 