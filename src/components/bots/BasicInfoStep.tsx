// src/components/bots/BasicInfoStep.tsx (用React Hook Form重寫)
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import FormSection from "@/components/form/FormSection";
import { TextField, TextareaField, SelectField } from "@/components/form/BotFormField";

// 定義表單驗證schema
const basicInfoSchema = z.object({
  botName: z.string().min(2, "Bot名稱至少需要2個字符").max(100, "Bot名稱不能超過100個字符"),
  botDescription: z.string(),
  model: z.string()
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

interface BasicInfoStepProps {
  defaultValues: {
    botName: string;
    botDescription: string;
    model: string;
  };
  onSubmit: (data: BasicInfoFormData) => void;
  stepIndex: number;
  stepTitle: string;
  stepDescription: string;
}

const BasicInfoStep = React.memo(({
  defaultValues,
  onSubmit,
  stepIndex,
  stepTitle,
  stepDescription
}: BasicInfoStepProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm<BasicInfoFormData>({
    defaultValues,
    resolver: zodResolver(basicInfoSchema)
  });

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full gap-5 mx-auto">
            <FormSection>
              <Controller
                name="botName"
                control={control}
                render={({ field }) => (
                  <TextField
                    id="botName"
                    label="Bot 名稱"
                    placeholder="請輸入 Bot 名稱"
                    className="w-full"
                    value={field.value}
                    onChange={field.onChange}
                    helpText="使用能清楚說明功能的名稱，有助於識別與搜尋"
                    error={errors.botName?.message}
                  />
                )}
              />
            </FormSection>

            <FormSection>
              <Controller
                name="botDescription"
                control={control}
                render={({ field }) => (
                  <TextareaField
                    id="botDescription"
                    label="Bot 描述"
                    placeholder="請描述此 Bot 的功能和用途"
                    className="min-h-24"
                    value={field.value}
                    onChange={field.onChange}
                    helpText="簡要描述此 Bot 的主要功能和適用情境"
                    error={errors.botDescription?.message}
                  />
                )}
              />
            </FormSection>

            <FormSection>
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <SelectField
                    id="model"
                    label="選擇模型"
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: "gpt-4o", label: "GPT-4o" },
                      { value: "gpt-4o-mini", label: "GPT-4o-mini" },
                      { value: "gemini-2.0-flash", label: "gemini-2.0-flash" },
                    ]}
                    helpText="不同模型有不同的能力與成本，請依需求選擇"
                    error={errors.model?.message}
                  />
                )}
              />
            </FormSection>
          </div>
          <div className="pt-4 flex justify-end">
            <Button className="px-5 flex items-center gap-2 h-10" type="submit">
              下一步 <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
});

BasicInfoStep.displayName = 'BasicInfoStep';

export default BasicInfoStep;