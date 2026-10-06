const { v4: uuidv4 } = require('uuid');

class InMemoryDB {
  constructor() {
    this.analyses = new Map();
  }

  createAnalysis(data = {}, userId) {
    if (!userId) throw new Error('userId is required');
    const id = uuidv4();
    const analysis = {
      _id: id,
      userId,
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

  getAnalysis(id, userId) {
    const analysis = this.analyses.get(id);
    if (!analysis) return null;
    if (userId && analysis.userId !== userId) return null;
    return analysis;
  }

  getAnalysesByUser(userId) {
    return Array.from(this.analyses.values()).filter(a => a.userId === userId);
  }

  updateAnalysis(id, updates, userId) {
    const analysis = this.getAnalysis(id, userId);
    if (!analysis) return null;
    const updated = { ...analysis, ...updates, updatedAt: new Date() };
    this.analyses.set(id, updated);
    return updated;
  }

  addInput(analysisId, input, userId) {
    const analysis = this.getAnalysis(analysisId, userId);
    if (!analysis) return null;
    const inputId = uuidv4();
    const newInput = { id: inputId, ...input, uploadedAt: new Date() };
    analysis.inputs.push(newInput);
    analysis.updatedAt = new Date();
    return newInput;
  }

  removeInput(analysisId, inputId, userId) {
    const analysis = this.getAnalysis(analysisId, userId);
    if (!analysis) return false;
    const initialLength = analysis.inputs.length;
    analysis.inputs = analysis.inputs.filter(input => input.id !== inputId);
    analysis.updatedAt = new Date();
    return analysis.inputs.length !== initialLength;
  }
}

module.exports = new InMemoryDB();
