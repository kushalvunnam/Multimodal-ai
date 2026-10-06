const { v4: uuidv4 } = require('uuid');

class InMemoryDB {
  constructor() {
    this.analyses = new Map();
  }

  createAnalysis(data = {}) {
    const id = uuidv4();
    const analysis = {
      _id: id,
      title: data.title || 'New Analysis',
      inputs: [],
      textContext: '',
      status: 'draft',
      
      aiProvider: process.env.AI_PROVIDER || 'gemini',
      processingStatus: { overall: 'pending', progress: 0, steps: [] },
      
      imageAnalysis: null,
      documentAnalysis: null,
      audioAnalysis: null,
      textAnalysis: null,
      
      // Phase 5 additions
      reasoning: null,
      chatHistory: [],
      
      processedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  getAnalysis(id) {
    return this.analyses.get(id) || null;
  }

  updateAnalysis(id, updates) {
    const analysis = this.getAnalysis(id);
    if (!analysis) return null;
    const updated = { ...analysis, ...updates, updatedAt: new Date() };
    this.analyses.set(id, updated);
    return updated;
  }

  addInput(analysisId, input) {
    const analysis = this.getAnalysis(analysisId);
    if (!analysis) return null;
    const inputId = uuidv4();
    const newInput = { id: inputId, ...input, uploadedAt: new Date() };
    analysis.inputs.push(newInput);
    analysis.updatedAt = new Date();
    return newInput;
  }

  removeInput(analysisId, inputId) {
    const analysis = this.getAnalysis(analysisId);
    if (!analysis) return false;
    const initialLength = analysis.inputs.length;
    analysis.inputs = analysis.inputs.filter(input => input.id !== inputId);
    analysis.updatedAt = new Date();
    return analysis.inputs.length !== initialLength;
  }
}

module.exports = new InMemoryDB();
