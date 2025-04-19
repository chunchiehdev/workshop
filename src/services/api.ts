// src/services/api.ts - API基礎設置
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // 調整為您的API基礎URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 全局錯誤處理
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 處理全局錯誤
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);