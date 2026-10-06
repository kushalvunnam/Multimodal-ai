const { GoogleGenerativeAI } = require('@google/generative-ai');

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('MISSING_API_KEY');
  return new GoogleGenerativeAI(apiKey);
};

const getModel = () => {
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  return getClient().getGenerativeModel({ model: modelName });
};

const bufferToGenerativePart = (buffer, mimeType) => ({
  inlineData: { data: buffer.toString('base64'), mimeType },
});

const analyzeImage = async (buffer, mimeType) => {
  const model = getModel();
  const imagePart = bufferToGenerativePart(buffer, mimeType);
  const prompt = `Analyze this image for an insurance claim. Extract vehicle details, visible damage (areas, severity, description), safety concerns, and image quality. Return strictly as JSON matching this structure: { "vehicle": { "type": "string|null", "make": "string|null", "model": "string|null" }, "damage": [{ "area": "string", "severity": "low|medium|high", "description": "string", "confidence": 0.0-1.0 }], "imageQuality": "string", "confidence": 0.0-1.0 }`;
  const result = await model.generateContent([prompt, imagePart]);
  return result.response.text();
};

const analyzeDocument = async (buffer, mimeType) => {
  const model = getModel();
  const docPart = bufferToGenerativePart(buffer, mimeType);
  const prompt = `Extract insurance claim information from this document. Find claim number, incident date, vehicle info, damage description, entities, and potential inconsistencies. Return strictly as JSON matching this structure: { "claimNumber": "string|null", "incidentDate": "string|null", "vehicle": {}, "damageDescription": "string|null", "entities": ["string"], "potentialInconsistencies": ["string"], "confidence": 0.0-1.0 }`;
  const result = await model.generateContent([prompt, docPart]);
  return result.response.text();
};

const transcribeAudio = async (buffer, mimeType) => {
  const model = getModel();
  const audioPart = bufferToGenerativePart(buffer, mimeType);
  const prompt = `Transcribe and analyze this audio for an insurance claim. Extract transcript, language, important statements, and entities. Return strictly as JSON matching this structure: { "transcript": "string", "language": "string", "importantStatements": ["string"], "entities": ["string"], "confidence": 0.0-1.0 }`;
  const result = await model.generateContent([prompt, audioPart]);
  return result.response.text();
};

const analyzeText = async (text) => {
  const model = getModel();
  const prompt = `Analyze the following context for an insurance claim. Extract incident description, entities, dates, and locations. Return strictly as JSON matching this structure: { "incidentDescription": "string|null", "entities": ["string"], "dates": ["string"], "locations": ["string"], "confidence": 0.0-1.0 }\n\nContext: ${text}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const crossModalReasoning = async (findings) => {
  const model = getModel();
  const prompt = `You are the OmniSense Cross-Modal Reasoning Engine.
Compare information across the provided modalities for an insurance claim.
Do not invent information. Do not assume missing information.
Identify agreements, contradictions, missing information, anomalies, risk signals, and actionable recommendations.
Every conclusion must cite the source modality (image, document, voice, text) and evidence.
Use neutral language. Never make legal, medical, financial, or fraud determinations.

Findings:
${JSON.stringify(findings, null, 2)}

Return strictly as JSON matching this schema:
{
  "overallAssessment": { "summary": "string", "confidence": 0.0-1.0 },
  "correlations": [
    { "type": "correlation", "topic": "string", "sources": ["string"], "evidence": ["string"], "assessment": "string" }
  ],
  "contradictions": [
    { "type": "contradiction", "topic": "string", "sources": ["string"], "values": ["string"], "severity": "low|medium|high", "explanation": "string", "recommendedAction": "string" }
  ],
  "missingInformation": [
    { "type": "missing_information", "topic": "string", "importance": "low|medium|high", "reason": "string", "recommendedAction": "string" }
  ],
  "riskSignals": [
    { "reason": "string", "evidence": "string", "sources": ["string"], "severity": "low|medium|high" }
  ],
  "recommendations": [
    { "action": "string", "reason": "string" }
  ]
}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const chatWithAnalysis = async (analysis, message) => {
  const model = getModel();
  const prompt = `You are OmniSense AI, an intelligent assistant. You have analyzed an insurance claim using cross-modal reasoning. 
Answer the user's query based ONLY on the provided analysis. Do not hallucinate. If the answer is not in the analysis, say so.
Analysis:
${JSON.stringify({ 
  imageAnalysis: analysis.imageAnalysis, 
  documentAnalysis: analysis.documentAnalysis,
  audioAnalysis: analysis.audioAnalysis,
  textAnalysis: analysis.textAnalysis,
  reasoning: analysis.reasoning
})}

User Query: ${message}`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const generateCustomerSummary = async (analysis) => {
  const model = getModel();
  const prompt = `You are OmniSense AI. Write a customer-friendly summary of this insurance claim analysis.
Avoid technical AI terminology. Use simple language, a professional tone, and clear next steps.
Do not invent information. Keep it under 3 paragraphs.

Analysis Data:
${JSON.stringify({
  reasoning: analysis.reasoning,
  imageAnalysis: analysis.imageAnalysis,
  documentAnalysis: analysis.documentAnalysis,
  audioAnalysis: analysis.audioAnalysis
})}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = {
  generateCustomerSummary,
  analyzeImage,
  analyzeDocument,
  transcribeAudio,
  analyzeText,
  crossModalReasoning,
  chatWithAnalysis
};

