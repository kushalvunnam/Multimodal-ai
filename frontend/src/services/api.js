import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// If undefined, or accidentally set to localhost in a production Vercel build, force the correct Render URL
if (!API_BASE_URL || (import.meta.env.PROD && API_BASE_URL.includes('localhost'))) {
  API_BASE_URL = import.meta.env.PROD ? 'https://multimodal-ai-b0xm.onrender.com' : 'http://localhost:5000';
}

const apiClient = axios.create({ baseURL: API_BASE_URL });

export const createAnalysis = async () => (await apiClient.post('/api/analysis/create')).data;
export const getAnalysis = async (analysisId) => (await apiClient.get(`/api/analysis/${analysisId}`)).data;
export const uploadFile = async (analysisId, file, onUploadProgress) => {
  const formData = new FormData(); formData.append('file', file);
  return (await apiClient.post(`/api/analysis/${analysisId}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress })).data;
};
export const removeInput = async (analysisId, inputId) => (await apiClient.delete(`/api/analysis/${analysisId}/input/${inputId}`)).data;
export const updateContext = async (analysisId, text) => (await apiClient.post(`/api/analysis/${analysisId}/context`, { text })).data;
export const updateAnalysisStatus = async (analysisId, status) => (await apiClient.put(`/api/analysis/${analysisId}/status`, { status })).data;
export const processAnalysis = async (analysisId) => (await apiClient.post(`/api/analysis/${analysisId}/process`)).data;
export const getAnalysisStatus = async (analysisId) => (await apiClient.get(`/api/analysis/${analysisId}/status`)).data;
export const sendChatMessage = async (analysisId, message) => (await apiClient.post(`/api/analysis/${analysisId}/chat`, { message })).data;
export const generateCustomerSummary = async (analysisId) => (await apiClient.post(`/api/analysis/${analysisId}/summary`)).data;
