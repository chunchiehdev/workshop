import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import FormSection from "@/components/form/FormSection";
import { TextField, TextareaField, SelectField } from "@/components/form/BotFormField";

interface FormData {
  botName: string;
  botDescription: string;
  model: string;
}

interface BasicInfoStepProps {
  formData: FormData;
  onFieldChange: (field: keyof FormData, value: any) => void;
  onNext: () => void;
  stepIndex: number;
  stepTitle: string;
  stepDescription: string;
}

const BasicInfoStep = React.memo(({
  formData,
  onFieldChange,
  onNext,
  stepIndex,
  stepTitle,
  stepDescription
}: BasicInfoStepProps) => {
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
            <TextField
              id="botName"
              label="Bot 名稱"
              placeholder="請輸入 Bot 名稱"
              className="w-full"
              value={formData.botName}
              onChange={(value) => onFieldChange('botName', value)}
              helpText="使用能清楚說明功能的名稱，有助於識別與搜尋"
            />
          </FormSection>

          <FormSection>
            <TextareaField
              id="botDescription"
              label="Bot 描述"
              placeholder="請描述此 Bot 的功能和用途"
              className="min-h-24"
              value={formData.botDescription}
              onChange={(value) => onFieldChange('botDescription', value)}
              helpText="簡要描述此 Bot 的主要功能和適用情境"
            />
          </FormSection>

          <FormSection>
            <SelectField
              id="model"
              label="選擇模型"
              value={formData.model}
              onChange={(value) => onFieldChange('model', value)}
              options={[
                { value: "gpt-4o", label: "GPT-4o" },
                { value: "gpt-4o-mini", label: "GPT-4o-mini" },
                { value: "claude-3-opus", label: "Claude 3 Opus" },
                { value: "claude-3-sonnet", label: "Claude 3 Sonnet" }
              ]}
              helpText="不同模型有不同的能力與成本，請依需求選擇"
            />
          </FormSection>
        </div>
        <div className="pt-4 flex justify-end">
          <Button className="px-5 flex items-center gap-2 h-10" onClick={onNext}>
            下一步 <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

BasicInfoStep.displayName = 'BasicInfoStep';

export default BasicInfoStep; 