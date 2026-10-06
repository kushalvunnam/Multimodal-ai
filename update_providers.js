const fs = require('fs');
const geminiFile = 'backend/services/ai/geminiProvider.js';
let gemini = fs.readFileSync(geminiFile, 'utf8');
gemini = gemini.replace('module.exports = {', "const askAssistant = async (message, context) => {\n  const model = getModel();\n  const prompt = `You are OmniSense AI, an intelligent context-aware reasoning assistant.\nAnswer the user's query professionally and concisely. Do not hallucinate.\nContext provided: ${JSON.stringify(context || {})}\nUser Query: ${message}`;\n  const result = await model.generateContent(prompt);\n  return result.response.text();\n};\n\nmodule.exports = {\n  askAssistant,");
fs.writeFileSync(geminiFile, gemini);

const groqFile = 'backend/services/ai/groqProvider.js';
let groq = fs.readFileSync(groqFile, 'utf8');
groq = groq.replace('module.exports = {', "const askAssistant = async (message, context) => {\n  const model = getModel();\n  const chatCompletion = await groq.chat.completions.create({\n    messages: [{ role: 'system', content: `You are OmniSense AI, an intelligent context-aware reasoning assistant. Context provided: ${JSON.stringify(context || {})}` }, { role: 'user', content: message }],\n    model: model,\n  });\n  return chatCompletion.choices[0]?.message?.content || '';\n};\n\nmodule.exports = {\n  askAssistant,");
fs.writeFileSync(groqFile, groq);
