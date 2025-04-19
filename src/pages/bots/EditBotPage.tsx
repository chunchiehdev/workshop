import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBot, useUpdateBot } from "@/services/queryHooks";
import BotFormLayout from "@/components/bots/BotFormLayout";
import BasicInfoStep from "@/components/bots/BasicInfoStep";
import PromptTemplateStep from "@/components/bots/PromptTemplateStep";
import ResultStep from "@/components/bots/ResultStep";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

// 步驟定義
const steps = [
  { title: "基本資訊", description: "設定 Bot 的基本資訊" },
  { title: "Prompt 模板", description: "設計 Bot 的 Prompt" },
  { title: "預覽結果", description: "檢視 Bot 的 Prompt" }
];

// 步驟對應的值，用於內容顯示控制
const stepValues = ["basic", "prompt", "result"];

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

export function EditBotPage() {
  const navigate = useNavigate();
  const { botId } = useParams<{ botId: string }>();
  const numericBotId = parseInt(botId || "0", 10);
  const queryClient = useQueryClient();
  
  // 獲取Bot數據
  const { data: bot, isLoading, error } = useGetBot(numericBotId);
  
  // 更新Bot
  const updateBotMutation = useUpdateBot();
  
  // 步驟狀態
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const activeTab = stepValues[currentStepIndex];
  
  // 表單狀態
  const [formData, setFormData] = useState<FormData>({
    botName: "",
    botDescription: "",
    model: "gpt-4o",
    role: "",
    goal: "",
    object: "",
    activity: "",
    format: "",
    responsestyle: "",
    files: [],
    generatedPrompt: ""
  });
  
  // 加載Bot數據到表單
  useEffect(() => {
    if (bot) {
      console.log("加載Bot數據到表單:", bot);
      
      // 確保設置所有必要的字段，並提供空字符串作為默認值
      const updatedFormData = {
        botName: bot.name || "",
        botDescription: bot.description || "",
        model: bot.model || "gpt-4o",
        role: bot.role || "",
        goal: bot.goal || "",
        object: bot.object || "", 
        activity: bot.activity || "",
        format: bot.format || "",
        responsestyle: bot.responsestyle || "",
        files: [],
        generatedPrompt: bot.prompt || ""
      };
      
      console.log("更新表單數據:", updatedFormData);
      setFormData(updatedFormData);
    }
  }, [bot]);
  
  // 當進入結果步驟時，刷新Bot數據以確保顯示最新的提示詞
  useEffect(() => {
    if (currentStepIndex === 2 && numericBotId) {
      // 重新獲取Bot數據
      queryClient.invalidateQueries({ queryKey: ['bot', numericBotId] });
    }
  }, [currentStepIndex, numericBotId, queryClient]);
  
  // 處理提示詞刷新
  const handleRefreshPrompt = useCallback(async () => {
    try {
      // 僅在結果步驟中可用
      if (currentStepIndex !== 2) return;
      
      // 檢查是否有實際的更改
      if (bot) {
        const hasChanged = 
          formData.botName !== bot.name ||
          formData.botDescription !== (bot.description || "") ||
          formData.model !== (bot.model || "gpt-4o") ||
          formData.role !== (bot.role || "") ||
          formData.goal !== (bot.goal || "") ||
          formData.object !== (bot.object || "") ||
          formData.activity !== (bot.activity || "") ||
          formData.format !== (bot.format || "") ||
          formData.responsestyle !== (bot.responsestyle || "");
        
        // 如果沒有變化，提示用戶但不發送請求
        if (!hasChanged) {
          toast({
            title: "未檢測到更改",
            description: "請先修改 Bot 資訊再重新生成提示詞",
          });
          
          return;
        }
      }
      
      // 準備請求數據
      const botData = {
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
      
      // 更新Bot並刷新提示詞
      await updateBotMutation.mutateAsync({ id: numericBotId, data: botData });
      
      // 刷新Bot數據
      await queryClient.invalidateQueries({ queryKey: ['bot', numericBotId] });
      
      toast({
        title: "提示詞已更新",
        description: "系統已重新生成 Bot 的提示詞",
      });
      
    } catch (error) {
      console.error('刷新提示詞時出錯:', error);
      toast({
        title: "錯誤",
        description: "刷新提示詞時發生錯誤，請稍後再試",
        variant: "destructive",
      });
    }
  }, [currentStepIndex, formData, updateBotMutation, numericBotId, queryClient, bot]);
  
  // 設置頁面標題
  useEffect(() => {
    document.title = `編輯 Bot - ${steps[currentStepIndex].title}`;
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
  
  // 返回上一步
  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex]);
  
  // 複製到剪貼板
  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "已複製",
          description: "內容已成功複製到剪貼板",
        });
      })
      .catch(() => {
        toast({
          title: "複製失敗",
          description: "無法複製到剪貼板，請手動複製",
          variant: "destructive",
        });
      });
  }, []);
  
  // 保存並完成編輯
  const handleFinish = useCallback(async () => {
    try {
      // 檢查是否有實際的更改
      if (bot) {
        const hasChanged = 
          formData.botName !== bot.name ||
          formData.botDescription !== (bot.description || "") ||
          formData.model !== (bot.model || "gpt-4o") ||
          formData.role !== (bot.role || "") ||
          formData.goal !== (bot.goal || "") ||
          formData.object !== (bot.object || "") ||
          formData.activity !== (bot.activity || "") ||
          formData.format !== (bot.format || "") ||
          formData.responsestyle !== (bot.responsestyle || "");
        
        // 如果沒有變化，直接導航回列表頁面而不發送更新請求
        if (!hasChanged) {
          navigate('/bots');
          
          toast({
            title: "未檢測到更改",
            description: "您沒有更改任何內容，直接返回列表",
          });
          
          return;
        }
      }
      
      // 更新Bot數據 - 只提交需要的基本資料，讓後端重新生成提示詞
      const botData = {
        name: formData.botName,
        description: formData.botDescription,
        role: formData.role,
        goal: formData.goal,
        object: formData.object,
        activity: formData.activity,
        format: formData.format,
        responsestyle: formData.responsestyle,
        model: formData.model
        // 移除 prompt 字段，讓後端自動生成
      };
      
      // 使用React Query的mutation
      await updateBotMutation.mutateAsync({ id: numericBotId, data: botData });
      
      // 使 bots 查詢失效，這樣在導航到列表頁時會重新獲取數據
      queryClient.invalidateQueries({ queryKey: ['bots'] });
      
      // 同時使當前 bot 的查詢失效，以便下次訪問時獲取最新數據
      queryClient.invalidateQueries({ queryKey: ['bot', numericBotId] });
      
      // 導航至Bot列表
      navigate('/bots');
      
      toast({
        title: "Bot 已更新",
        description: "AI 教學助手已成功更新，並重新生成了提示詞",
      });
    } catch (error) {
      console.error('更新Bot時出錯:', error);
      toast({
        title: "錯誤",
        description: "更新 Bot 時發生錯誤，請稍後再試",
        variant: "destructive",
      });
    }
  }, [formData, updateBotMutation, numericBotId, navigate, queryClient, bot]);
  
  // 取消編輯
  const handleCancel = useCallback(() => {
    navigate('/bots');
  }, [navigate]);
  
  // 渲染步驟內容
  const renderStepContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    }
    
    if (error || !bot) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">載入 Bot 數據失敗</p>
          <Button onClick={handleCancel}>返回列表</Button>
        </div>
      );
    }
    
    // 確保有加載完整的 Bot 數據，並且 formData 已經被設置
    const formDataLoaded = 
      formData.botName !== "" || 
      formData.role !== "" || 
      formData.goal !== "";
    
    if (!formDataLoaded) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-3">載入表單數據中...</span>
        </div>
      );
    }

    switch (activeTab) {
      case "basic":
        return (
          <BasicInfoStep
            key={`basic-${formData.botName}-${formData.model}`} // 添加 key 確保表單重新渲染
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
            key={`prompt-${formData.role}-${formData.goal}`} // 添加 key 確保表單重新渲染
            defaultValues={{
              role: formData.role,
              goal: formData.goal,
              object: formData.object,
              activity: formData.activity,
              format: formData.format,
              responsestyle: formData.responsestyle
            }}
            onSubmit={handlePromptSubmit}
            onPrevious={handlePrevious}
            stepIndex={2}
            stepTitle={steps[1].title}
            stepDescription={steps[1].description}
          />
        );
      case "result":
        return (
          <ResultStep
            key={`result-${formData.generatedPrompt?.length}`} // 添加 key 確保表單重新渲染
            formData={{
              botName: formData.botName,
              model: formData.model,
              role: formData.role,
              files: [],
              generatedPrompt: formData.generatedPrompt
            }}
            onPrevious={handlePrevious}
            onFinish={handleFinish}
            onCopyToClipboard={handleCopyToClipboard}
            onRefreshPrompt={handleRefreshPrompt}
            stepIndex={3}
            stepTitle={steps[2].title}
            stepDescription={steps[2].description}
          />
        );
      default:
        return null;
    }
  }, [
    activeTab, 
    formData, 
    handleBasicInfoSubmit, 
    handlePromptSubmit, 
    handlePrevious, 
    handleFinish, 
    handleCopyToClipboard,
    handleCancel,
    isLoading,
    error,
    bot,
    handleRefreshPrompt
  ]);
  
  // 主渲染
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-5xl">
      {/* 頁面標題和返回按鈕 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl md:text-2xl font-semibold">編輯 Bot - {formData.botName}</h1>
        </div>
        
        <div className="text-sm font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">
          步驟 {currentStepIndex + 1} / {steps.length}
        </div>
      </div>
      
      {/* 頂部 Stepper 導航 */}
      <div className="bg-muted/30 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex-1 text-center ${
                index === currentStepIndex 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground'
              }`}
              onClick={() => {
                // 只有當數據已加載完成時才允許切換步驟
                if (!isLoading && bot && formData.botName) {
                  setCurrentStepIndex(index);
                }
              }}
              style={{ cursor: isLoading || !bot || !formData.botName ? 'not-allowed' : 'pointer' }}
            >
              <div className="flex flex-col items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mb-1
                  ${isLoading || !bot || !formData.botName
                    ? 'bg-muted text-muted-foreground'
                    : index === currentStepIndex 
                      ? 'bg-primary text-primary-foreground' 
                      : index < currentStepIndex 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {index + 1}
                </div>
                <span className="text-sm hidden md:block">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 bg-muted my-4 mx-2 hidden md:block"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* 步驟內容 */}
      <div className="animate-in fade-in-50 duration-300">
        {renderStepContent()}
      </div>
    </div>
  );
} 