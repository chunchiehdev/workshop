import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BotFormLayout from "@/components/bots/BotFormLayout";
import BasicInfoStep from "@/components/bots/BasicInfoStep";
import PromptTemplateStep from "@/components/bots/PromptTemplateStep";
import DataUploadStep from "@/components/bots/DataUploadStep";
import ResultStep from "@/components/bots/ResultStep";
import { useGeneratePrompt, useCreateBot } from "@/services/queryHooks";
import { useQueryClient } from "@tanstack/react-query";

// 步驟定義
const steps = [
  { title: "基本資訊", description: "設定 Bot 的基本資訊" },
  { title: "Prompt 模板", description: "設計 Bot 的 Prompt" },
  { title: "資料上傳", description: "上傳參考資料" },
  { title: "生成結果", description: "檢視生成的 AI 助教" }
];

// 步驟對應的值，用於內容顯示控制
const stepValues = ["basic", "prompt", "data", "result"];

// Toast通知函數
const toast = (props: { title: string; description: string; variant?: string }) => {
  const { title, description, variant } = props;
  console.log(`[Toast] ${variant === 'destructive' ? 'Error:' : 'Success:'} ${title} - ${description}`);
  // 實際項目中應該使用真正的Toast組件
};

// 表單數據類型
interface FormData {
  botName: string;
  botDescription: string;
  model: string;
  role: string;
  goal: string;
  object: string;
  activity: string;
  format: string;
  responsestyle: string;
  files: File[];
  generatedPrompt?: string;
  createdBotId?: number; // 添加字段存儲後端創建的 Bot ID
}

export function CreateBotPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // 使用React Query的hooks
  const generatePromptMutation = useGeneratePrompt();
  const createBotMutation = useCreateBot();
  
  // 步驟狀態
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const activeTab = stepValues[currentStepIndex];
  
  // 表單狀態 - 使用單一狀態
  const [formData, setFormData] = useState<FormData>({
    botName: "",
    botDescription: "",
    model: "gpt-4o",
    role: "老師",
    goal: "",
    object: "",
    activity: "",
    format: "",
    responsestyle: "",
    files: []
  });
  
  // 設置頁面標題
  useEffect(() => {
    document.title = `建立 Bot - ${steps[currentStepIndex].title}`;
  }, [currentStepIndex]);
  
  // 處理BasicInfoStep表單提交
  const handleBasicInfoSubmit = useCallback((data: {botName: string; botDescription: string; model: string}) => {
    setFormData(prev => ({
      ...prev,
      botName: data.botName,
      botDescription: data.botDescription,
      model: data.model
    }));
    // 移至下一步
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex]);
  
  // 處理PromptTemplateStep表單提交
  const handlePromptSubmit = useCallback((data: {role: string; goal: string; object: string; activity: string; format: string; responsestyle: string}) => {
    setFormData(prev => ({
      ...prev,
      role: data.role,
      goal: data.goal,
      object: data.object,
      activity: data.activity,
      format: data.format,
      responsestyle: data.responsestyle
    }));
    // 移至下一步
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex]);
  
  // 處理檔案上傳
  const handleFilesAdded = useCallback((newFiles: File[]) => {
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
  }, []);
  
  // 導航函數
  const goToPrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex]);
  
  // 提交表單 - 使用React Query的mutation
  const handleSubmit = useCallback(async () => {
    try {
      // 準備API請求數據
      const promptRequestData = {
        name: formData.botName,
        description: formData.botDescription,
        role: formData.role,
        goal: formData.goal,
        object: formData.object,
        activity: formData.activity,
        format: formData.format,
        responsestyle: formData.responsestyle,
        model: formData.model
      };
      
      // 使用React Query的mutation
      const result = await generatePromptMutation.mutateAsync(promptRequestData);
      
      // 保存生成的回應和 bot_id
      setFormData(prev => ({
        ...prev,
        generatedPrompt: result.reply || "",
        createdBotId: result.bot_id // 保存後端創建的 Bot ID
      }));
      
      // 顯示成功通知
      toast({
        title: "Bot 已創建成功",
        description: "AI 教學助手已成功生成並保存",
      });
      
      // 切換到結果頁
      setCurrentStepIndex(3);
      
    } catch (error) {
      console.error('生成提示詞時出錯:', error);
      toast({
        title: "錯誤",
        description: "生成提示詞時發生錯誤，請稍後再試",
        variant: "destructive",
      });
    }
  }, [formData, generatePromptMutation]);
  
  // 複製到剪貼板函數
  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "已複製",
      description: "內容已複製到剪貼簿",
    });
  }, []);
  
  // 完成並導航至Bot列表 - 直接導航，不需要再創建Bot
  const handleFinish = useCallback(() => {
    // 使 bots 查詢失效，這樣在導航到列表頁時會重新獲取數據
    queryClient.invalidateQueries({ queryKey: ['bots'] });
    
    // 導航至Bot列表
    navigate('/bots');
    
    toast({
      title: "返回 Bot 列表",
      description: "您的 Bot 已成功創建，可以開始使用了",
    });
  }, [navigate, queryClient]);
  
  // 渲染當前步驟內容
  const renderStepContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <BasicInfoStep 
            defaultValues={{
              botName: formData.botName,
              botDescription: formData.botDescription,
              model: formData.model
            }}
            onSubmit={handleBasicInfoSubmit}
            stepIndex={1}
            stepTitle={steps[0].title}
            stepDescription={steps[0].description}
          />
        );
      
      case "prompt":
        return (
          <PromptTemplateStep 
            defaultValues={{
              role: formData.role,
              goal: formData.goal,
              object: formData.object,
              activity: formData.activity,
              format: formData.format,
              responsestyle: formData.responsestyle
            }}
            onSubmit={handlePromptSubmit}
            onPrevious={goToPrevious}
            stepIndex={2}
            stepTitle={steps[1].title}
            stepDescription={steps[1].description}
          />
        );
      
      case "data":
        return (
          <DataUploadStep 
            files={formData.files}
            onFilesAdded={handleFilesAdded}
            onPrevious={goToPrevious}
            onSubmit={handleSubmit}
            isSubmitting={generatePromptMutation.isPending}
            stepIndex={3}
            stepTitle={steps[2].title}
            stepDescription={steps[2].description}
          />
        );
      
      case "result":
        return (
          <ResultStep 
            formData={formData}
            onPrevious={goToPrevious}
            onFinish={handleFinish}
            onCopyToClipboard={handleCopyToClipboard}
            stepIndex={4}
            stepTitle={steps[3].title}
            stepDescription={steps[3].description}
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <BotFormLayout
      steps={steps}
      currentStepIndex={currentStepIndex}
      onStepChange={setCurrentStepIndex}
    >
      {renderStepContent()}
    </BotFormLayout>
  );
} 