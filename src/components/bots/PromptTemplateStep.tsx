import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FormSection from "@/components/form/FormSection";
import { TextField, TextareaField } from "@/components/form/BotFormField";

interface PromptFormData {
  role: string;
  goal: string;
  object: string;
  activity: string;
  format: string;
  responsestyle: string;
}

interface PromptTemplateStepProps {
  formData: PromptFormData;
  onFieldChange: (field: keyof PromptFormData, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  stepIndex: number;
  stepTitle: string;
  stepDescription: string;
}

const PromptTemplateStep = React.memo(({
  formData,
  onFieldChange,
  onNext,
  onPrevious,
  stepIndex,
  stepTitle,
  stepDescription
}: PromptTemplateStepProps) => {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mx-auto">
          <FormSection>
            <div className="space-y-5">
              <TextField
                id="role"
                label="角色"
                placeholder="例如: 老師、助教"
                className="text-sm"
                value={formData.role}
                onChange={(value) => onFieldChange('role', value)}
                helpText="Bot 將扮演的角色，影響回應風格"
              />
              
              <TextareaField
                id="object"
                label="教學對象"
                placeholder="描述此 Bot 的目標使用者"
                className="min-h-[80px] text-sm"
                value={formData.object}
                onChange={(value) => onFieldChange('object', value)}
                helpText="使用者的特性、背景和知識水平"
              />
              
              <TextareaField
                id="format"
                label="輸出格式"
                placeholder="描述 Bot 回應的格式"
                className="min-h-[80px] text-sm"
                value={formData.format}
                onChange={(value) => onFieldChange('format', value)}
                helpText="回應的結構、排版和組成元素"
              />
            </div>
          </FormSection>
          
          <FormSection>
            <div className="space-y-5">
              <TextareaField
                id="goal"
                label="任務目標"
                placeholder="描述此 Bot 的主要目標"
                className="min-h-[80px] text-sm"
                value={formData.goal}
                onChange={(value) => onFieldChange('goal', value)}
                helpText="Bot 應該達成的具體目標與結果"
              />
              
              <TextareaField
                id="activity"
                label="互動方式"
                placeholder="描述此 Bot 如何與學生互動"
                className="min-h-[80px] text-sm"
                value={formData.activity}
                onChange={(value) => onFieldChange('activity', value)}
                helpText="Bot 與使用者的互動模式與流程"
              />
              
              <TextareaField
                id="responsestyle"
                label="回應風格"
                placeholder="描述 Bot 回應的語氣和風格"
                className="min-h-[80px] text-sm"
                value={formData.responsestyle}
                onChange={(value) => onFieldChange('responsestyle', value)}
                helpText="語氣、詞彙選擇與表達方式"
              />
            </div>
          </FormSection>
        </div>
        
        <div className="pt-4 flex justify-between">
          <Button variant="outline" className="flex items-center gap-2 h-10 px-5" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" /> 上一步
          </Button>
          <Button className="flex items-center gap-2 h-10 px-5" onClick={onNext}>
            下一步 <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

PromptTemplateStep.displayName = 'PromptTemplateStep';

export default PromptTemplateStep; 