// src/services/api.ts - API基礎設置
import axios from 'axios';

const API_BASE_URL = "https://teachbot.grading.software";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 處理全局錯誤
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);