// src/hooks/useBotCreation.ts (使用React Query)
import { useState } from 'react';
import { useGeneratePrompt, useCreateBot } from '@/services/queryHooks';
import { PromptRequest, BotResponse, BotCreate } from '@/services/botService';

/**
 * Bot創建自定義Hook
 * 整合提示詞生成和Bot創建的流程
 */
export function useBotCreation() {
  // 生成的提示詞
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  
  // 引入React Query hooks
  const generatePromptMutation = useGeneratePrompt();
  const createBotMutation = useCreateBot();
  
  /**
   * 生成提示詞，成功後保存到本地狀態
   */
  const generatePrompt = async (data: PromptRequest) => {
    try {
      const result = await generatePromptMutation.mutateAsync(data);
      setGeneratedPrompt(result.reply);
      return result;
    } catch (error) {
      console.error('生成提示詞失敗:', error);
      throw error;
    }
  };
  
  /**
   * 創建Bot，集成了提示詞生成過程
   */
  const createFullBot = async (data: BotCreate & { autoGenerate?: boolean }) => {
    try {
      // 如果需要自動生成提示詞
      if (data.autoGenerate && !data.prompt) {
        const promptData: PromptRequest = {
          name: data.name,
          role: data.role,
          goal: data.goal,
          object: data.object,
          activity: data.activity,
          format: data.format,
          responsestyle: data.responsestyle,
          model: data.model || 'gpt-4o'
        };
        
        // 先生成提示詞
        const promptResult = await generatePrompt(promptData);
        
        // 將生成的提示詞添加到Bot數據中
        data.prompt = promptResult.reply;
      }
      
      // 創建Bot
      return await createBotMutation.mutateAsync(data);
    } catch (error) {
      console.error('創建Bot失敗:', error);
      throw error;
    }
  };
  
  // 獲取綜合錯誤信息
  const error = generatePromptMutation.error || createBotMutation.error;
  const errorMessage = error 
    ? (error instanceof Error ? error.message : '操作失敗') 
    : null;
  
  return {
    // 狀態指示器
    isGenerating: generatePromptMutation.isPending,
    isCreating: createBotMutation.isPending,
    isLoading: generatePromptMutation.isPending || createBotMutation.isPending,
    
    // 錯誤處理
    error: errorMessage,
    
    // 數據
    generatedPrompt,
    createdBot: createBotMutation.data as BotResponse | undefined,
    
    // 方法
    generatePrompt,
    createBot: createBotMutation.mutateAsync,
    createFullBot,
    
    // 重置狀態
    reset: () => {
      setGeneratedPrompt(null);
      generatePromptMutation.reset();
      createBotMutation.reset();
    }
  };
}