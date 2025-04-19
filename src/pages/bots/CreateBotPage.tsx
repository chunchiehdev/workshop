import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { ArrowLeft, UploadCloud, ChevronLeft, ChevronRight, CheckCircle2, Info } from "lucide-react";
import { useState, useEffect, ReactNode } from "react";
import { Stepper } from "@/components/ui/stepper";
import { cn } from "@/lib/utils";

// 步驟定義
const steps = [
  { title: "基本資訊", description: "設定 Bot 的基本資訊" },
  { title: "Prompt 模板", description: "設計 Bot 的 Prompt" },
  { title: "資料上傳", description: "上傳參考資料" }
];

// 步驟對應的值，用於內容顯示控制
const stepValues = ["basic", "prompt", "data"];

interface FormSectionProps {
  children: ReactNode;
  className?: string;
}

interface HelpTextProps {
  children: ReactNode;
}

export function CreateBotPage() {
  // 使用索引來跟踪當前步驟
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // 當前步驟的值
  const activeTab = stepValues[currentStepIndex];
  
  // 導航函數
  const goToNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const goToPrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // 設置頁面標題
  useEffect(() => {
    document.title = `建立 Bot - ${steps[currentStepIndex].title}`;
  }, [currentStepIndex]);
  
  const FormSection = ({ children, className }: FormSectionProps) => (
    <div className={cn("mb-5 border border-border/60 rounded-md p-5 bg-card", className)}>
      {children}
    </div>
  );
  
  const HelpText = ({ children }: HelpTextProps) => (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
      <Info className="h-3.5 w-3.5 text-primary/70" /> 
      {children}
    </p>
  );
  
  // 渲染當前步驟的內容
  const renderStepContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <Card className="shadow-md border-none transition-all duration-300">
            <CardHeader className="bg-muted/50 rounded-t-lg pb-4 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-primary text-primary-foreground w-8 h-8 rounded-full">
                  1
                </div>
                <div>
                  <CardTitle className="text-xl">{steps[0].title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{steps[0].description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid w-full gap-5 mx-auto">
                <FormSection>
                  <Label htmlFor="bot-name" className="text-sm font-medium mb-2 block">Bot 名稱</Label>
                  <Input id="bot-name" placeholder="請輸入 Bot 名稱" className="w-full" />
                  <HelpText>使用能清楚說明功能的名稱，有助於識別與搜尋</HelpText>
                </FormSection>

                <FormSection>
                  <Label htmlFor="bot-description" className="text-sm font-medium mb-2 block">Bot 描述</Label>
                  <Textarea id="bot-description" placeholder="請描述此 Bot 的功能和用途" className="min-h-24" />
                  <HelpText>簡要描述此 Bot 的主要功能和適用情境</HelpText>
                </FormSection>

                <FormSection>
                  <Label htmlFor="bot-model" className="text-sm font-medium mb-2 block">選擇模型</Label>
                  <select id="bot-model" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4o-mini">GPT-4o-mini</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  </select>
                  <HelpText>不同模型有不同的能力與成本，請依需求選擇</HelpText>
                </FormSection>
              </div>
              <div className="pt-4 flex justify-end">
                <Button className="px-5 flex items-center gap-2 h-10" onClick={goToNext}>
                  下一步 <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      
      case "prompt":
        return (
          <Card className="shadow-md border-none transition-all duration-300">
            <CardHeader className="bg-muted/50 rounded-t-lg pb-4 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-primary text-primary-foreground w-8 h-8 rounded-full">
                  2
                </div>
                <div>
                  <CardTitle className="text-xl">{steps[1].title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{steps[1].description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mx-auto">
                <FormSection>
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="role" className="text-sm font-medium mb-2 block">角色</Label>
                      <Input id="role" placeholder="例如: 老師、助教" defaultValue="老師" className="text-sm" />
                      <HelpText>Bot 將扮演的角色，影響回應風格</HelpText>
                    </div>
                    
                    <div>
                      <Label htmlFor="object" className="text-sm font-medium mb-2 block">教學對象</Label>
                      <Textarea id="object" placeholder="描述此 Bot 的目標使用者" className="min-h-[80px] text-sm" />
                      <HelpText>使用者的特性、背景和知識水平</HelpText>
                    </div>
                    
                    <div>
                      <Label htmlFor="format" className="text-sm font-medium mb-2 block">輸出格式</Label>
                      <Textarea id="format" placeholder="描述 Bot 回應的格式" className="min-h-[80px] text-sm" />
                      <HelpText>回應的結構、排版和組成元素</HelpText>
                    </div>
                  </div>
                </FormSection>
                
                <FormSection>
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="goal" className="text-sm font-medium mb-2 block">任務目標</Label>
                      <Textarea id="goal" placeholder="描述此 Bot 的主要目標" className="min-h-[80px] text-sm" />
                      <HelpText>Bot 應該達成的具體目標與結果</HelpText>
                    </div>
                    
                    <div>
                      <Label htmlFor="activity" className="text-sm font-medium mb-2 block">互動方式</Label>
                      <Textarea id="activity" placeholder="描述此 Bot 如何與學生互動" className="min-h-[80px] text-sm" />
                      <HelpText>Bot 與使用者的互動模式與流程</HelpText>
                    </div>
                    
                    <div>
                      <Label htmlFor="responsestyle" className="text-sm font-medium mb-2 block">回應風格</Label>
                      <Textarea id="responsestyle" placeholder="描述 Bot 回應的語氣和風格" className="min-h-[80px] text-sm" />
                      <HelpText>語氣、詞彙選擇與表達方式</HelpText>
                    </div>
                  </div>
                </FormSection>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button variant="outline" className="flex items-center gap-2 h-10 px-5" onClick={goToPrevious}>
                  <ChevronLeft className="h-4 w-4" /> 上一步
                </Button>
                <Button className="flex items-center gap-2 h-10 px-5" onClick={goToNext}>
                  下一步 <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      
      case "data":
        return (
          <Card className="shadow-md border-none transition-all duration-300">
            <CardHeader className="bg-muted/50 rounded-t-lg pb-4 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-primary text-primary-foreground w-8 h-8 rounded-full">
                  3
                </div>
                <div>
                  <CardTitle className="text-xl">{steps[2].title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{steps[2].description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-3">
                  <FormSection className="h-full flex flex-col items-center justify-center py-8 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary/70 transition-all cursor-pointer group">
                    <div className="bg-primary/15 p-4 rounded-full inline-flex mx-auto mb-4 group-hover:bg-primary/25 transition-colors">
                      <UploadCloud className="h-10 w-10 text-primary/80 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-base font-medium text-primary/90 mb-2">
                      拖放檔案到此處
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      或從您的裝置選擇檔案
                    </p>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                    />
                    <Button className="h-10 text-sm px-5">
                      選擇檔案
                    </Button>
                  </FormSection>
                </div>
                
                <div className="md:col-span-2">
                  <FormSection className="h-full">
                    <h3 className="text-sm font-medium mb-3">上傳須知</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <div className="min-w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                        <span>支援檔案: PDF, DOC, DOCX, TXT, CSV, XLSX</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="min-w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                        <span>檔案大小限制: 20MB</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="min-w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                        <span>可一次上傳多個檔案</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="min-w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                        <span>所有資料將用於訓練您的 Bot</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border/40">
                      <h3 className="text-sm font-medium mb-3">已上傳檔案</h3>
                      <div className="text-sm text-muted-foreground italic">
                        尚未上傳任何檔案
                      </div>
                    </div>
                  </FormSection>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button variant="outline" className="flex items-center gap-2 h-10 px-5" onClick={goToPrevious}>
                  <ChevronLeft className="h-4 w-4" /> 上一步
                </Button>
                <Button className="flex gap-2 items-center px-5 h-10 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4" /> 完成並建立 Bot
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-5xl">
      {/* 頁面標題和返回按鈕 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/bots">
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-semibold">建立新 Bot</h1>
        </div>
        
        <div className="text-sm font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">
          步驟 {currentStepIndex + 1} / {steps.length}
        </div>
      </div>
      
      {/* 頂部 Stepper 導航 */}
      <div className="bg-muted/30 p-4 rounded-lg mb-6 shadow-sm">
        <Stepper 
          steps={steps} 
          currentStep={currentStepIndex} 
          onStepChange={setCurrentStepIndex} 
        />
      </div>
      
      {/* 步驟內容 */}
      <div className="animate-in fade-in-50 duration-300">
        {renderStepContent()}
      </div>
    </div>
  );
} 