const Analysis = require('../models/Analysis');

class DBService {
  async createAnalysis(data = {}, userId) {
    if (!userId) throw new Error('userId is required');
    const analysis = new Analysis({
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
      reasoning: null,
      chatHistory: [],
      processedAt: null
    });
    await analysis.save();
    return analysis.toObject();
  }

  async getAnalysis(id, userId) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return null; // validate ObjectId
    const query = { _id: id };
    if (userId) query.userId = userId;
    const analysis = await Analysis.findOne(query).lean();
    return analysis;
  }

  async getAnalysesByUser(userId) {
    return await Analysis.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async updateAnalysis(id, updates, userId) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
    const updated = await Analysis.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true }
    ).lean();
    return updated;
  }

  async addInput(analysisId, input, userId) {
    if (!analysisId.match(/^[0-9a-fA-F]{24}$/)) return null;
    const { v4: uuidv4 } = require('uuid');
    const inputId = uuidv4();
    const newInput = { id: inputId, ...input, uploadedAt: new Date() };
    
    const analysis = await Analysis.findOneAndUpdate(
      { _id: analysisId, userId },
      { $push: { inputs: newInput } },
      { new: true }
    ).lean();
    
    if (!analysis) return null;
    return newInput;
  }

  async removeInput(analysisId, inputId, userId) {
    if (!analysisId.match(/^[0-9a-fA-F]{24}$/)) return false;
    const result = await Analysis.updateOne(
      { _id: analysisId, userId },
      { $pull: { inputs: { id: inputId } } }
    );
    return result.modifiedCount > 0;
  }
}

module.exports = new DBService();
