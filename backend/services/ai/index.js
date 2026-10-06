const geminiProvider = require('./geminiProvider');
const groqProvider = require('./groqProvider');
const { normalizeResponse, extractJson } = require('./normalizer');
const { withRetry } = require('../../utils/retry');

const getProvider = () => {
  const provider = process.env.AI_PROVIDER;
  if (provider === 'groq') return groqProvider;
  if (provider === 'gemini') return geminiProvider;
  // Prefer Groq when a Groq key is configured because it is the current
  // multimodal vision provider for production image analysis.
  if (process.env.GROQ_API_KEY) return groqProvider;
  return geminiProvider;
};

const getAlternateVisionProvider = (provider) => {
  if (provider === groqProvider && process.env.GEMINI_API_KEY) return geminiProvider;
  if (provider === geminiProvider && process.env.GROQ_API_KEY) return groqProvider;
  return null;
};

const runImageAnalysis = async (provider, buffer, mimeType) => {
  const rawResponse = await withRetry(() => provider.analyzeImage(buffer, mimeType));
  return normalizeResponse(rawResponse, 'image');
};

const processInput = async (type, buffer, mimeType, text) => {
  const provider = getProvider();

  if (type === 'image') {
    try {
      const primary = await runImageAnalysis(provider, buffer, mimeType);

      // A successful request with an empty damage array can still be a vision
      // false-negative. If another configured vision provider is available,
      // give it one chance before accepting an empty result.
      if (Array.isArray(primary?.damage) && primary.damage.length > 0) {
        return primary;
      }

      const alternate = getAlternateVisionProvider(provider);
      if (alternate) {
        const secondary = await runImageAnalysis(alternate, buffer, mimeType);
        if (Array.isArray(secondary?.damage) && secondary.damage.length > 0) {
          return secondary;
        }
        // Preserve a valid primary result if both providers genuinely see no damage.
        return primary;
      }
      return primary;
    } catch (error) {
      console.error('AI Image Processing Error:', error);
      const alternate = getAlternateVisionProvider(provider);
      if (alternate) {
        try {
          return await runImageAnalysis(alternate, buffer, mimeType);
        } catch (fallbackError) {
          console.error('AI Image Fallback Error:', fallbackError);
          return { error: 'PROCESSING_FAILED', details: fallbackError.message, confidence: null };
        }
      }
      return { error: 'PROCESSING_FAILED', details: error.message, confidence: null };
    }
  }

  let rawResponse = '';
  const processFn = async () => {
    switch (type) {
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

const askAssistant = async (message, context) => {
  const provider = getProvider();
  try {
    const processFn = async () => await provider.askAssistant(message, context);
    return await withRetry(processFn);
  } catch (error) {
    console.error('Ask Error:', error);
    throw new Error('Failed to generate response.');
  }
};

module.exports = { processInput, runReasoning, runChat, generateSummary, askAssistant };


