import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, UploadCloud, CheckCircle2 } from "lucide-react";
import FormSection from "@/components/form/FormSection";
import Dropzone from "@/components/ui/Dropzone";

interface DataUploadStepProps {
  files: File[];
  onFilesAdded: (files: File[]) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  stepIndex: number;
  stepTitle: string;
  stepDescription: string;
}

const DataUploadStep = React.memo(({
  files,
  onFilesAdded,
  onPrevious,
  onSubmit,
  isSubmitting,
  stepIndex,
  stepTitle,
  stepDescription
}: DataUploadStepProps) => {
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <Dropzone 
              onFilesAdded={onFilesAdded}
              className="h-full"
            />
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
                  {files.length === 0 ? "尚未上傳任何檔案" : `已上傳 ${files.length} 個檔案`}
                </div>
              </div>
            </FormSection>
          </div>
        </div>
        
        <div className="pt-4 flex justify-between">
          <Button variant="outline" className="flex items-center gap-2 h-10 px-5" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" /> 上一步
          </Button>
          <Button 
            className="flex items-center gap-2 h-10 px-5 bg-green-600 hover:bg-green-700" 
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "處理中..." : (
              <>
                完成建立 <CheckCircle2 className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* 顯示上傳文件列表 */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-3">已上傳文件</h3>
            <div className="border rounded-md">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border-b last:border-b-0">
                  <div className="flex items-center gap-2">
                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </div>
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

DataUploadStep.displayName = 'DataUploadStep';

export default DataUploadStep; 