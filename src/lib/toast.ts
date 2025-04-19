// src/lib/toast.ts (使用sonner)
import { toast as sonnerToast } from 'sonner';

export const toast = (props: { title: string; description: string; variant?: string }) => {
  const { title, description, variant } = props;
  
  if (variant === 'destructive') {
    return sonnerToast.error(title, {
      description
    });
  }
  
  return sonnerToast(title, {
    description
  });
};