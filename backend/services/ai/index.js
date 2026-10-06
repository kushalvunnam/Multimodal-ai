const geminiProvider = require('./geminiProvider');
const groqProvider = require('./groqProvider');
const { normalizeResponse, extractJson } = require('./normalizer');
const { withRetry } = require('../../utils/retry');

const getProvider = () => {
  const provider = process.env.AI_PROVIDER || 'gemini';
  if (provider === 'groq') return groqProvider;
  return geminiProvider;
};

const processInput = async (type, buffer, mimeType, text) => {
  const provider = getProvider();
  let rawResponse = '';
  
  const processFn = async () => {
    switch (type) {
      case 'image': return await provider.analyzeImage(buffer, mimeType);
      case 'document': return await provider.analyzeDocument(buffer, mimeType);
      case 'audio': return await provider.transcribeAudio(buffer, mimeType);
      case 'text': return await provider.analyzeText(text);
      default: throw new Error(`Unsupported modality: ${type}`);
    }
  };

  try {
    rawResponse = await withRetry(processFn);
    return normalizeResponse(rawResponse, type);
  } catch (error) {
    console.error(`AI Processing Error [${type}]:`, error);
    return { error: 'PROCESSING_FAILED', details: error.message, confidence: null };
  }
};

const runReasoning = async (findings) => {
  const provider = getProvider();
  try {
    const processFn = async () => await provider.crossModalReasoning(findings);
    const rawResponse = await withRetry(processFn);
    return extractJson(rawResponse);
  } catch (error) {
    console.error(`Reasoning Error:`, error);
    return { error: 'REASONING_FAILED', details: error.message };
  }
};

const runChat = async (analysis, message) => {
  const provider = getProvider();
  try {
    const processFn = async () => await provider.chatWithAnalysis(analysis, message);
    return await withRetry(processFn);
  } catch (error) {
    console.error(`Chat Error:`, error);
    throw new Error('Failed to generate response.');
  }
};

const generateSummary = async (analysis) => {
  const provider = getProvider();
  try {
    const processFn = async () => await provider.generateCustomerSummary(analysis);
    return await withRetry(processFn);
  } catch (error) {
    console.error('Customer Summary Error:', error);
    throw new Error('Failed to generate customer summary.');
  }
};

module.exports = { processInput, runReasoning, runChat, generateSummary };

