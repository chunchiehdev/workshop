import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BotFormLayout from "@/components/bots/BotFormLayout";
import BasicInfoStep from "@/components/bots/BasicInfoStep";
import PromptTemplateStep from "@/components/bots/PromptTemplateStep";
import DataUploadStep from "@/components/bots/DataUploadStep";
import ResultStep from "@/components/bots/ResultStep";

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
}

export function CreateBotPage() {
  const navigate = useNavigate();
  
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
  
  // 加載狀態
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 設置頁面標題
  useEffect(() => {
    document.title = `建立 Bot - ${steps[currentStepIndex].title}`;
  }, [currentStepIndex]);
  
  // 直接更新表單值的處理函數 - 使用useCallback優化
  const handleChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  // 處理檔案上傳
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  }, []);
  
  // 導航函數
  const goToNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex]);
  
  const goToPrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex]);
  
  // 提交表單
  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      
      // 準備API請求數據
      const requestData = {
        role: formData.role,
        goal: formData.goal,
        object: formData.object,
        activity: formData.activity,
        format: formData.format,
        responsestyle: formData.responsestyle,
        model: formData.model
      };
      
      // 發送API請求
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error('API請求失敗');
      }
      
      const data = await response.json();
      
      // 保存生成的回應
      setFormData(prev => ({
        ...prev,
        generatedPrompt: data.reply || ""
      }));
      
      // 顯示成功通知
      toast({
        title: "Bot 建立成功",
        description: "AI 教學助手已成功生成",
      });
      
      // 切換到結果頁
      setCurrentStepIndex(3);
      
    } catch (error) {
      console.error('提交表單時出錯:', error);
      toast({
        title: "錯誤",
        description: "建立 Bot 時發生錯誤，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);
  
  // 複製到剪貼板函數
  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "已複製",
      description: "內容已複製到剪貼簿",
    });
  }, []);
  
  // 完成並導航至Bot列表
  const handleFinish = useCallback(() => {
    // TODO: 保存到資料庫
    navigate('/bots');
  }, [navigate]);
  
  // 渲染當前步驟內容
  const renderStepContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <BasicInfoStep 
            formData={formData}
            onFieldChange={handleChange}
            onNext={goToNext}
            stepIndex={1}
            stepTitle={steps[0].title}
            stepDescription={steps[0].description}
          />
        );
      
      case "prompt":
        return (
          <PromptTemplateStep 
            formData={formData}
            onFieldChange={handleChange}
            onNext={goToNext}
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
            onFileUpload={handleFileUpload}
            onPrevious={goToPrevious}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
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