import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

// 幫助文本組件
const HelpText = ({ children }: { children: React.ReactNode }) => (
  <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
    <Info className="h-3.5 w-3.5 text-primary/70" /> 
    {children}
  </p>
);

// 定義通用的表單字段屬性
interface FormFieldProps {
  id: string;
  label: string;
  helpText?: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

// 文本輸入框組件
export const TextField = React.memo(({
  id,
  label,
  helpText,
  placeholder,
  className,
  value,
  onChange
}: FormFieldProps) => {
  // 使用useCallback防止每次渲染創建新的函數
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium block">{label}</Label>
      <Input 
        id={id} 
        placeholder={placeholder} 
        className={className}
        value={value}
        onChange={handleChange}
      />
      {helpText && <HelpText>{helpText}</HelpText>}
    </div>
  );
});

// 文本區域組件
export const TextareaField = React.memo(({
  id,
  label,
  helpText,
  placeholder,
  className,
  value,
  onChange
}: FormFieldProps) => {
  // 使用useCallback防止每次渲染創建新的函數
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium block">{label}</Label>
      <Textarea 
        id={id} 
        placeholder={placeholder} 
        className={className || "min-h-[80px]"}
        value={value}
        onChange={handleChange}
      />
      {helpText && <HelpText>{helpText}</HelpText>}
    </div>
  );
});

// 選擇框組件
interface SelectFieldProps extends Omit<FormFieldProps, 'placeholder'> {
  options: { value: string; label: string }[];
}

export const SelectField = React.memo(({
  id,
  label,
  helpText,
  className,
  value,
  onChange,
  options
}: SelectFieldProps) => {
  // 使用useCallback防止每次渲染創建新的函數
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium block">{label}</Label>
      <select 
        id={id} 
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        value={value}
        onChange={handleChange}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && <HelpText>{helpText}</HelpText>}
    </div>
  );
});

// 為了避免eslint警告，添加displayName
TextField.displayName = 'TextField';
TextareaField.displayName = 'TextareaField';
SelectField.displayName = 'SelectField'; 