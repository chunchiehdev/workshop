import React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
}

// 表單分區組件，用於視覺上分隔不同的表單字段組
const FormSection = React.memo(({ children, className }: FormSectionProps) => {
  return (
    <div className={cn("mb-5 border border-border/60 rounded-md p-5 bg-card", className)}>
      {children}
    </div>
  );
});

FormSection.displayName = 'FormSection';

export default FormSection; 