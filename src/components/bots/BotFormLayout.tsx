import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Stepper } from "@/components/ui/stepper";

interface StepInfo {
  title: string;
  description: string;
}

interface BotFormLayoutProps {
  children: React.ReactNode;
  steps: StepInfo[];
  currentStepIndex: number;
  onStepChange: (stepIndex: number) => void;
}

const BotFormLayout = React.memo(({
  children,
  steps,
  currentStepIndex,
  onStepChange
}: BotFormLayoutProps) => {
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
          onStepChange={onStepChange} 
        />
      </div>
      
      {/* 步驟內容 */}
      <div className="animate-in fade-in-50 duration-300">
        {children}
      </div>
    </div>
  );
});

BotFormLayout.displayName = 'BotFormLayout';

export default BotFormLayout; 