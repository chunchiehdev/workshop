// src/services/queryHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { botService, BotCreate, BotResponse, PromptRequest } from './botService';
import { chatService, ChatRequest, ChatResponse, ConversationCreate, ConversationResponse } from './chatService';

// 查詢鍵，用於在多處統一管理和無效化緩存
export const queryKeys = {
  bots: 'bots',
  bot: (id: number) => ['bot', id],
  allBots: (filters?: Record<string, unknown>) => ['bots', { ...filters }],
  conversations: 'conversations',
  conversation: (id: number) => ['conversation', id],
  botConversations: (botId: number) => ['conversations', 'bot', botId]
};

// 獲取所有Bots
export function useGetAllBots(userId?: string) {
  return useQuery({
    queryKey: queryKeys.allBots({ userId }),
    queryFn: () => botService.getAllBots(userId),
    staleTime: 1000 * 60 * 5, // 5分鐘後認為數據過期
  });
}

// 獲取單個Bot
export function useGetBot(id: number) {
  return useQuery({
    queryKey: queryKeys.bot(id),
    queryFn: async () => {
      try {
        return await botService.getBotById(id);
      } catch (error) {
        // Improve error handling for 404 and other errors
        console.error(`Error fetching bot with ID ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id, // 只有当id存在時才執行查詢
    staleTime: 1000 * 60 * 5,
    retry: 1, // Only retry once for better user experience on deleted bots
  });
}

// 創建Bot
export function useCreateBot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BotCreate) => botService.createBot(data),
    onSuccess: (newBot) => {
      // 更新所有Bots查詢的緩存
      queryClient.setQueryData<BotResponse[]>(
        queryKeys.allBots(),
        (oldData = []) => [...oldData, newBot]
      );
      
      // 直接將新Bot寫入緩存
      queryClient.setQueryData(queryKeys.bot(newBot.id), newBot);
      
      // 使相關查詢失效，以便重新獲取
      queryClient.invalidateQueries({ queryKey: [queryKeys.bots] });
    }
  });
}

// 更新Bot
export function useUpdateBot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BotCreate }) => 
      botService.updateBot(id, data),
    onSuccess: (updatedBot) => {
      // 更新所有Bots查詢的緩存
      queryClient.setQueryData<BotResponse[]>(
        queryKeys.allBots(),
        (oldData = []) => oldData.map(bot => 
          bot.id === updatedBot.id ? updatedBot : bot
        )
      );
      
      // 更新單個Bot緩存
      queryClient.setQueryData(queryKeys.bot(updatedBot.id), updatedBot);
      
      // 使相關查詢失效
      queryClient.invalidateQueries({ queryKey: [queryKeys.bots] });
    }
  });
}

// 刪除Bot
export function useDeleteBot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => botService.deleteBot(id),
    onSuccess: (_, deletedId) => {
      // 將相關緩存直接標記為stale
      queryClient.invalidateQueries({ queryKey: [queryKeys.bots] });
      
      // 強制移除單個Bot緩存
      queryClient.removeQueries({ queryKey: queryKeys.bot(deletedId) });
      
      // 強制移除該Bot所有相關對話緩存
      queryClient.removeQueries({ 
        queryKey: queryKeys.botConversations(deletedId) 
      });
      
      // 清除所有對話緩存，因為可能包含被刪除的bot的數據
      queryClient.invalidateQueries({ 
        queryKey: [queryKeys.conversations]
      });
      
      // 更新所有Bots查詢的緩存 - 直接過濾掉已刪除的bot
      queryClient.setQueryData<BotResponse[]>(
        queryKeys.allBots(),
        (oldData = []) => oldData.filter(bot => bot.id !== deletedId)
      );
      
      console.log(`Bot ${deletedId} 已從緩存中清除`);
    },
    onError: (error, id) => {
      console.error(`刪除Bot ${id}失敗:`, error);
    }
  });
}

// 生成提示詞
export function useGeneratePrompt() {
  return useMutation({
    mutationFn: (data: PromptRequest) => botService.generatePrompt(data)
  });
}

// === 聊天相關的 Hooks ===

// 發送消息
export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChatRequest) => chatService.sendMessage(data),
    onSuccess: (response, variables) => {
      // 如果有對話ID，則使相關對話的緩存失效
      if (variables.conversation_id) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.conversation(variables.conversation_id) 
        });
      }
      
      // 使相關Bot的對話列表緩存失效
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.botConversations(variables.bot_id) 
      });
    }
  });
}

// 創建對話
export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConversationCreate) => chatService.createConversation(data),
    onSuccess: (newConversation) => {
      // 更新Bot對話列表緩存
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.botConversations(newConversation.bot_id) 
      });
    }
  });
}

// 獲取對話詳情
export function useGetConversation(id: number) {
  return useQuery({
    queryKey: queryKeys.conversation(id),
    queryFn: () => chatService.getConversation(id),
    enabled: !!id,
    staleTime: 1000 * 30, // 30秒後認為數據過期
  });
}

// 獲取Bot的所有對話
export function useGetBotConversations(botId: number) {
  return useQuery({
    queryKey: queryKeys.botConversations(botId),
    queryFn: () => chatService.getConversationsByBot(botId),
    enabled: !!botId,
    staleTime: 1000 * 60, // 1分鐘後認為數據過期
  });
}

// 刪除對話
export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => chatService.deleteConversation(id),
    onSuccess: (_, deletedId) => {
      // 移除對話緩存
      queryClient.removeQueries({ 
        queryKey: queryKeys.conversation(deletedId) 
      });
      
      // 需要更新包含此對話的所有列表
      queryClient.invalidateQueries({ 
        queryKey: [queryKeys.conversations] 
      });
    }
  });
}