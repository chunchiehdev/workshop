import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import FormSection from "@/components/form/FormSection";

interface ResultStepProps {
  formData: {
    botName: string;
    model: string;
    role: string;
    files: File[];
    generatedPrompt?: string;
  };
  onPrevious: () => void;
  onFinish: () => void;
  onCopyToClipboard: (text: string) => void;
  onRefreshPrompt?: () => void;
  stepIndex: number;
  stepTitle: string;
  stepDescription: string;
}

const ResultStep = React.memo(({
  formData,
  onPrevious,
  onFinish,
  onCopyToClipboard,
  onRefreshPrompt,
  stepIndex,
  stepTitle,
  stepDescription
}: ResultStepProps) => {
  return (
    <Card className="shadow-md border-none transition-all duration-300">
      <CardHeader className="bg-muted/50 rounded-t-lg pb-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary text-primary-foreground w-8 h-8 rounded-full">
            {stepIndex}
          </div>
          <div>
            <CardTitle className="text-xl">{stepTitle}</CardTitle>
            <CardDescription className="text-sm mt-1">{stepDescription}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid w-full gap-5 mx-auto">
          <FormSection>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">生成的 AI 助教</h3>
              <div className="flex gap-2">
                {onRefreshPrompt && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={onRefreshPrompt}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    重新生成
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => onCopyToClipboard(formData.generatedPrompt || "")}
                >
                  複製
                </Button>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-md whitespace-pre-wrap text-sm min-h-[200px] max-h-[500px] overflow-y-auto border border-border/30">
              {formData.generatedPrompt || "尚未生成內容"}
            </div>
          </FormSection>
          
          <FormSection>
            <h3 className="text-sm font-medium mb-3 block">AI 助教資訊</h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted/20 rounded-md">
                <div className="text-sm font-medium">名稱</div>
                <div className="text-sm">{formData.botName}</div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted/20 rounded-md">
                <div className="text-sm font-medium">模型</div>
                <div className="text-sm">{formData.model}</div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted/20 rounded-md">
                <div className="text-sm font-medium">角色</div>
                <div className="text-sm">{formData.role}</div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted/20 rounded-md">
                <div className="text-sm font-medium">上傳文件</div>
                <div className="text-sm">{formData.files.length} 個檔案</div>
              </div>
            </div>
          </FormSection>
        </div>
        
        <div className="pt-4 flex justify-between">
          <Button variant="outline" className="flex items-center gap-2 h-10 px-5" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" /> 返回編輯
          </Button>
          <Button className="flex items-center gap-2 h-10 px-5" onClick={onFinish}>
            完成並前往 Bot 列表 <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

ResultStep.displayName = 'ResultStep';

export default ResultStep; 