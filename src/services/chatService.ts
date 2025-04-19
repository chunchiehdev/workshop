// src/services/chatService.ts - 聊天相關API服務
import { apiClient } from './api';

// 定義類型 (基於API文檔)
export interface ChatRequest {
  message: string;
  bot_id: number;
  conversation_id?: number;
  user_identifier?: string;
}

export interface ChatResponse {
  reply: string;
  conversation_id: number;
}

export interface ConversationCreate {
  bot_id: number;
  title?: string;
  user_identifier?: string;
}

export interface MessageResponse {
  id: number;
  content: string;
  is_bot: boolean;
  created_at: string;
}

export interface ConversationResponse {
  id: number;
  bot_id: number;
  title?: string;
  user_identifier?: string;
  created_at: string;
  messages: MessageResponse[];
}

// 聊天服務函數
export const chatService = {
  // 發送聊天訊息
  sendMessage: async (data: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>('/chat/', data);
    return response.data;
  },

  // 創建新對話
  createConversation: async (data: ConversationCreate): Promise<ConversationResponse> => {
    const response = await apiClient.post<ConversationResponse>('/conversations/', data);
    return response.data;
  },

  // 獲取對話詳情
  getConversation: async (id: number): Promise<ConversationResponse> => {
    const response = await apiClient.get<ConversationResponse>(`/conversations/${id}`);
    return response.data;
  },

  // 獲取Bot的所有對話
  getConversationsByBot: async (botId: number): Promise<ConversationResponse[]> => {
    const response = await apiClient.get<ConversationResponse[]>(`/conversations/bot/${botId}`);
    return response.data;
  },

  // 刪除對話
  deleteConversation: async (id: number): Promise<void> => {
    await apiClient.delete(`/conversations/${id}`);
  }
}; 