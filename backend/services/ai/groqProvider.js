// Fallback provider. Doesn't support audio/image natively in standard endpoints without specific models.
const analyzeImage = async (buffer, mimeType) => {
  return JSON.stringify({ error: 'UNSUPPORTED_MODALITY', message: 'Groq does not currently support image analysis in this configuration.', confidence: null });
};

const analyzeDocument = async (buffer, mimeType) => {
  return JSON.stringify({ error: 'UNSUPPORTED_MODALITY', message: 'Groq document analysis requires text extraction first.', confidence: null });
};

const transcribeAudio = async (buffer, mimeType) => {
  return JSON.stringify({ error: 'UNSUPPORTED_MODALITY', message: 'Groq audio transcription requires Whisper integration.', confidence: null });
};

const analyzeText = async (text) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('MISSING_API_KEY');
  
  const Groq = require('groq-sdk');
  const groq = new Groq({ apiKey });
  const modelName = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';

  const prompt = `Analyze the following additional context for an insurance claim. Extract incident description, entities, dates, and locations. Return strictly as JSON matching this structure: { "incidentDescription": "string|null", "entities": ["string"], "dates": ["string"], "locations": ["string"], "confidence": 0.0-1.0 }\n\nContext: ${text}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: modelName,
  });

  return completion.choices[0]?.message?.content || '{}';
};

const askAssistant = async (message, context) => {
  const model = getModel();
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'system', content: `You are OmniSense AI, an intelligent context-aware reasoning assistant. Context provided: ${JSON.stringify(context || {})}` }, { role: 'user', content: message }],
    model: model,
  });
  return chatCompletion.choices[0]?.message?.content || '';
};

module.exports = {
  askAssistant,
  analyzeImage,
  analyzeDocument,
  transcribeAudio,
  analyzeText
};
