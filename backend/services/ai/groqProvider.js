const Groq = require('groq-sdk');

const getClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('MISSING_API_KEY');
  return new Groq({ apiKey });
};

const getModel = () => process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';

const toDataUrl = (buffer, mimeType) => {
  if (!buffer) throw new Error('MISSING_IMAGE_BUFFER');
  const safeMime = mimeType || 'image/jpeg';
  return `data:${safeMime};base64,${buffer.toString('base64')}`;
};

const chatCompletion = async (messages, options = {}) => {
  const groq = getClient();
  const completion = await groq.chat.completions.create({
    model: getModel(),
    messages,
    temperature: options.temperature ?? 0.1,
    max_completion_tokens: options.max_completion_tokens ?? 2048,
    ...(options.response_format ? { response_format: options.response_format } : {})
  });
  return completion.choices[0]?.message?.content || '{}';
};

const analyzeImage = async (buffer, mimeType) => {
  const imageUrl = toDataUrl(buffer, mimeType);
  const prompt = `Analyze this vehicle image for an insurance claim. Be conservative but do not ignore clearly visible physical damage. Identify every visibly damaged vehicle area, including dents, scratches, cracks, broken or displaced parts, paint transfer, deformation, or impact damage. Do not invent damage that is not visible.

Return ONLY a JSON object matching this exact structure:
{
  "damage": [
    {
      "area": "Rear bumper",
      "severity": "High",
      "description": "Visible deformation, scraping and paint damage on the rear bumper.",
      "confidence": 0.95
    }
  ],
  "summary": "Vehicle has visible exterior damage.",
  "vehicle": { "type": "string|null", "make": "string|null", "model": "string|null" },
  "imageQuality": "string",
  "confidence": 0.0
}

If visible damage exists, damage MUST contain one or more findings. If there is genuinely no visible damage, return an empty damage array.`;

  return chatCompletion([
    {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imageUrl } }
      ]
    }
  ], {
    temperature: 0,
    max_completion_tokens: 2048,
    response_format: { type: 'json_object' }
  });
};

const analyzeDocument = async () => {
  return JSON.stringify({
    error: 'UNSUPPORTED_MODALITY',
    message: 'Groq document analysis requires document-to-image or text extraction before vision analysis.',
    confidence: null
  });
};

const transcribeAudio = async () => {
  return JSON.stringify({
    error: 'UNSUPPORTED_MODALITY',
    message: 'Groq audio transcription requires Whisper integration.',
    confidence: null
  });
};

const analyzeText = async (text) => {
  const prompt = `Analyze the following additional context for an insurance claim. Extract incident description, entities, dates, and locations. Return strictly as JSON matching this structure: { "incidentDescription": "string|null", "entities": ["string"], "dates": ["string"], "locations": ["string"], "confidence": 0.0 }\n\nContext: ${text}`;
  return chatCompletion([{ role: 'user', content: prompt }], {
    temperature: 0,
    response_format: { type: 'json_object' }
  });
};

const crossModalReasoning = async (findings) => {
  const prompt = `You are the OmniSense Cross-Modal Reasoning Engine. Compare the provided insurance claim evidence without inventing information. Preserve real image damage findings. Identify agreements, contradictions, missing information, risk signals, and actionable recommendations. Return ONLY JSON matching this schema:
{
  "overallAssessment": { "summary": "string", "confidence": 0.0 },
  "correlations": [{ "type": "correlation", "topic": "string", "sources": ["string"], "evidence": ["string"], "assessment": "string" }],
  "contradictions": [{ "type": "contradiction", "topic": "string", "sources": ["string"], "values": ["string"], "severity": "low|medium|high", "explanation": "string", "recommendedAction": "string" }],
  "missingInformation": [{ "type": "missing_information", "topic": "string", "importance": "low|medium|high", "reason": "string", "recommendedAction": "string" }],
  "riskSignals": [{ "reason": "string", "evidence": "string", "sources": ["string"], "severity": "low|medium|high" }],
  "recommendations": [{ "action": "string", "reason": "string" }]
}

Findings:\n${JSON.stringify(findings, null, 2)}`;
  return chatCompletion([{ role: 'user', content: prompt }], {
    temperature: 0,
    max_completion_tokens: 3072,
    response_format: { type: 'json_object' }
  });
};

const chatWithAnalysis = async (analysis, message) => {
  const prompt = `You are OmniSense AI. Answer the user's query using ONLY this insurance claim analysis. Do not hallucinate. If the information is unavailable, say so.\n\nAnalysis:\n${JSON.stringify(analysis)}\n\nUser Query: ${message}`;
  return chatCompletion([{ role: 'user', content: prompt }], { temperature: 0.2 });
};

const askAssistant = async (message, context) => {
  const prompt = `You are OmniSense AI, a context-aware reasoning assistant. Answer professionally and concisely using only the provided context. Do not hallucinate.\n\nContext:\n${JSON.stringify(context || {})}\n\nUser Query: ${message}`;
  return chatCompletion([{ role: 'user', content: prompt }], { temperature: 0.2 });
};

const generateCustomerSummary = async (analysis) => {
  const prompt = `You are OmniSense AI. Write a customer-friendly summary of this insurance claim analysis. Use simple professional language, do not invent information, and keep it under 3 paragraphs.\n\nAnalysis:\n${JSON.stringify(analysis)}`;
  return chatCompletion([{ role: 'user', content: prompt }], { temperature: 0.2 });
};

module.exports = {
  askAssistant,
  generateCustomerSummary,
  analyzeImage,
  analyzeDocument,
  transcribeAudio,
  analyzeText,
  crossModalReasoning,
  chatWithAnalysis
};



