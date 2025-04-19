// src/services/fileService.ts - 文件上傳服務
import { apiClient } from './api';

export interface FileUploadResponse {
  id: number;
  filename: string;
  url: string;
}

export const fileService = {
  // 上傳單個文件
  uploadFile: async (file: File, botId?: number): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (botId) formData.append('bot_id', botId.toString());
    
    const response = await apiClient.post<FileUploadResponse>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // 批量上傳文件
  uploadFiles: async (files: File[], botId?: number): Promise<FileUploadResponse[]> => {
    const promises = files.map(file => fileService.uploadFile(file, botId));
    return Promise.all(promises);
  }
};