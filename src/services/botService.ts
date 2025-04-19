// src/services/botService.ts - Bot相關API服務
import { apiClient } from './api';

// 定義類型 (基於API文檔)
export interface PromptRequest {
  role: string;
  goal: string;
  object: string;
  activity: string;
  format: string;
  responsestyle: string;
  model: string;
  name: string;
  description?: string;
  user_id?: string;
}

export interface PromptResponse {
  reply: string;
  bot_id?: number;
}

export interface BotCreate {
  name: string;
  role: string;
  goal: string;
  object: string;
  activity: string;
  format: string;
  responsestyle: string;
  model?: string;
  description?: string;
  user_id?: string;
  prompt?: string;
}

export interface BotResponse extends BotCreate {
  id: number;
  prompt: string;
  created_at: string;
  updated_at?: string;
}

// Bot服務函數
export const botService = {
  // 生成提示詞
  generatePrompt: async (data: PromptRequest): Promise<PromptResponse> => {
    const response = await apiClient.post<PromptResponse>('/generate/', data);
    return response.data;
  },

  // 創建Bot
  createBot: async (data: BotCreate): Promise<BotResponse> => {
    const response = await apiClient.post<BotResponse>('/bots/', data);
    return response.data;
  },

  // 獲取所有Bot
  getAllBots: async (userId?: string): Promise<BotResponse[]> => {
    const params = userId ? { user_id: userId } : {};
    const response = await apiClient.get<BotResponse[]>('/bots/', { params });
    return response.data;
  },

  // 根據ID獲取Bot
  getBotById: async (id: number): Promise<BotResponse> => {
    const response = await apiClient.get<BotResponse>(`/bots/${id}`);
    return response.data;
  },

  // 更新Bot
  updateBot: async (id: number, data: BotCreate): Promise<BotResponse> => {
    const response = await apiClient.put<BotResponse>(`/bots/${id}`, data);
    return response.data;
  },

  // 刪除Bot
  deleteBot: async (id: number): Promise<void> => {
    await apiClient.delete(`/bots/${id}`);
  }
};