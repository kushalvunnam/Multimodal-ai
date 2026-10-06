import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://multimodal-ai-b0xm.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('omnisense_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Routes
export const signup = async (data) => (await apiClient.post('/api/auth/signup', data)).data;
export const signin = async (data) => (await apiClient.post('/api/auth/signin', data)).data;
export const signout = async () => (await apiClient.post('/api/auth/signout')).data;
export const getCurrentUser = async () => (await apiClient.get('/api/auth/me')).data;
export const forgotPassword = async (email) => (await apiClient.post('/api/auth/forgot-password', { email })).data;
export const resetPassword = async (token, password) => (await apiClient.post('/api/auth/reset-password', { token, password })).data;

// Analysis Routes
export const getDashboardStats = async () => (await apiClient.get('/api/analysis/dashboard')).data;
export const getUserAnalyses = async () => (await apiClient.get('/api/analysis')).data;
export const createAnalysis = async () => (await apiClient.post('/api/analysis/create')).data;
export const getAnalysis = async (analysisId) => (await apiClient.get(`/api/analysis/${analysisId}`)).data;
export const uploadFile = async (analysisId, file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  return (await apiClient.post(`/api/analysis/${analysisId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })).data;
};
export const removeInput = async (analysisId, inputId) => (await apiClient.delete(`/api/analysis/${analysisId}/input/${inputId}`)).data;
export const updateContext = async (analysisId, text) => (await apiClient.post(`/api/analysis/${analysisId}/context`, { text })).data;
export const updateAnalysisStatus = async (analysisId, status) => (await apiClient.put(`/api/analysis/${analysisId}/status`, { status })).data;
export const processAnalysis = async (analysisId) => (await apiClient.post(`/api/analysis/${analysisId}/process`)).data;
export const getAnalysisStatus = async (analysisId) => (await apiClient.get(`/api/analysis/${analysisId}/status`)).data;
export const sendChatMessage = async (analysisId, message) => (await apiClient.post(`/api/analysis/${analysisId}/chat`, { message })).data;
export const generateCustomerSummary = async (analysisId) => (await apiClient.post(`/api/analysis/${analysisId}/summary`)).data;
export const checkHealth = async () => (await apiClient.get('/api/health')).data;

export const askAssistant = async (message, context) => (await apiClient.post('/api/assistant', { message, context })).data;


