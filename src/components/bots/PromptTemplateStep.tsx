import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FormSection from "@/components/form/FormSection";
import { TextField, TextareaField } from "@/components/form/BotFormField";

// 定義表單驗證schema
const promptTemplateSchema = z.object({
  role: z.string().min(1, "角色不能為空"),
  goal: z.string().min(1, "任務目標不能為空"),
  object: z.string().min(1, "教學對象不能為空"),
  activity: z.string().min(1, "互動方式不能為空"),
  format: z.string().min(1, "輸出格式不能為空"),
  responsestyle: z.string().min(1, "回應風格不能為空")
});

type PromptFormData = z.infer<typeof promptTemplateSchema>;

interface PromptTemplateStepProps {
  defaultValues: {
    role: string;
    goal: string;
    object: string;
    activity: string;
    format: string;
    responsestyle: string;
  };
  onSubmit: (data: PromptFormData) => void;
  onPrevious: () => void;
  stepIndex: number;
  stepTitle: string;
  stepDescription: string;
}

const PromptTemplateStep = React.memo(({
  defaultValues,
  onSubmit,
  onPrevious,
  stepIndex,
  stepTitle,
  stepDescription
}: PromptTemplateStepProps) => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<PromptFormData>({
    defaultValues,
    resolver: zodResolver(promptTemplateSchema),
    mode: "onChange"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mx-auto">
            <FormSection>
              <div className="space-y-5">
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      id="role"
                      label="角色"
                      placeholder="例如: 老師、助教"
                      className="text-sm"
                      value={field.value}
                      onChange={field.onChange}
                      helpText="Bot 將扮演的角色，影響回應風格"
                      error={errors.role?.message}
                    />
                  )}
                />
                
                <Controller
                  name="object"
                  control={control}
                  render={({ field }) => (
                    <TextareaField
                      id="object"
                      label="教學對象"
                      placeholder="描述此 Bot 的目標使用者"
                      className="min-h-[80px] text-sm"
                      value={field.value}
                      onChange={field.onChange}
                      helpText="使用者的特性、背景和知識水平"
                      error={errors.object?.message}
                    />
                  )}
                />
                
                <Controller
                  name="format"
                  control={control}
                  render={({ field }) => (
                    <TextareaField
                      id="format"
                      label="輸出格式"
                      placeholder="描述 Bot 回應的格式"
                      className="min-h-[80px] text-sm"
                      value={field.value}
                      onChange={field.onChange}
                      helpText="回應的結構、排版和組成元素"
                      error={errors.format?.message}
                    />
                  )}
                />
              </div>
            </FormSection>
            
            <FormSection>
              <div className="space-y-5">
                <Controller
                  name="goal"
                  control={control}
                  render={({ field }) => (
                    <TextareaField
                      id="goal"
                      label="任務目標"
                      placeholder="描述此 Bot 的主要目標"
                      className="min-h-[80px] text-sm"
                      value={field.value}
                      onChange={field.onChange}
                      helpText="Bot 應該達成的具體目標與結果"
                      error={errors.goal?.message}
                    />
                  )}
                />
                
                <Controller
                  name="activity"
                  control={control}
                  render={({ field }) => (
                    <TextareaField
                      id="activity"
                      label="互動方式"
                      placeholder="描述此 Bot 如何與學生互動"
                      className="min-h-[80px] text-sm"
                      value={field.value}
                      onChange={field.onChange}
                      helpText="Bot 與使用者的互動模式與流程"
                      error={errors.activity?.message}
                    />
                  )}
                />
                
                <Controller
                  name="responsestyle"
                  control={control}
                  render={({ field }) => (
                    <TextareaField
                      id="responsestyle"
                      label="回應風格"
                      placeholder="描述 Bot 回應的語氣和風格"
                      className="min-h-[80px] text-sm"
                      value={field.value}
                      onChange={field.onChange}
                      helpText="語氣、詞彙選擇與表達方式"
                      error={errors.responsestyle?.message}
                    />
                  )}
                />
              </div>
            </FormSection>
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center gap-2 h-10 px-5" 
              onClick={onPrevious}
            >
              <ChevronLeft className="h-4 w-4" /> 上一步
            </Button>
            <Button 
              type="submit" 
              className="flex items-center gap-2 h-10 px-5"
              disabled={!isValid}
            >
              下一步 <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
});

PromptTemplateStep.displayName = 'PromptTemplateStep';

export default PromptTemplateStep; 