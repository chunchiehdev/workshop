import React, { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
  className?: string;
}

const Dropzone = React.memo(({
  onFilesAdded,
  maxFiles = 5,
  maxSize = 20 * 1024 * 1024, // 20MB
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
    'text/csv': ['.csv'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
  },
  className
}: DropzoneProps) => {
  const [fileRejections, setFileRejections] = useState<FileRejection[]>([]);
  
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (acceptedFiles.length > 0) {
      onFilesAdded(acceptedFiles);
    }
    
    if (rejectedFiles.length > 0) {
      setFileRejections(rejectedFiles);
    }
  }, [onFilesAdded]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept
  });
  
  return (
    <div className={className}>
      <div 
        {...getRootProps()} 
        className={`h-full flex flex-col items-center justify-center py-8 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary/70 transition-all cursor-pointer rounded-md ${isDragActive ? 'border-primary border-2' : 'border'}`}
      >
        <div className="bg-primary/15 p-4 rounded-full inline-flex mx-auto mb-4 group-hover:bg-primary/25 transition-colors">
          <UploadCloud className="h-10 w-10 text-primary/80 group-hover:text-primary transition-colors" />
        </div>
        <p className="text-base font-medium text-primary/90 mb-2">
          {isDragActive ? '放開以添加檔案' : '拖放檔案到此處'}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          或從您的裝置選擇檔案
        </p>
        <input {...getInputProps()} />
        <Button type="button" className="h-10 text-sm px-5">
          選擇檔案
        </Button>
      </div>
      
      {fileRejections.length > 0 && (
        <div className="mt-4 p-3 border border-destructive/30 bg-destructive/10 rounded-md">
          <h4 className="text-sm font-medium text-destructive mb-1">無法上傳的檔案：</h4>
          <ul className="text-xs text-destructive/90 pl-2">
            {fileRejections.map(({ file, errors }, index) => (
              <li key={index} className="mb-1">
                {file.name} - {errors.map(e => e.message).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

Dropzone.displayName = 'Dropzone';

export default Dropzone;