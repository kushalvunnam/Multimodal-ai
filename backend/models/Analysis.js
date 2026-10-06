const mongoose = require('mongoose');

const inputSchema = new mongoose.Schema({
  id: String,
  type: String,
  originalName: String,
  mimeType: String,
  storageReference: String,
  status: String,
  uploadedAt: Date,
  size: Number,
  metadata: mongoose.Schema.Types.Mixed
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Analysis'
  },
  inputs: [inputSchema],
  textContext: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'ready_for_processing', 'processing', 'processed', 'failed'],
    default: 'draft'
  },
  aiProvider: {
    type: String,
    default: 'gemini'
  },
  processingStatus: {
    overall: { type: String, default: 'pending' },
    progress: { type: Number, default: 0 },
    steps: mongoose.Schema.Types.Mixed,
    error: String
  },
  imageAnalysis: mongoose.Schema.Types.Mixed,
  documentAnalysis: mongoose.Schema.Types.Mixed,
  audioAnalysis: mongoose.Schema.Types.Mixed,
  textAnalysis: mongoose.Schema.Types.Mixed,
  reasoning: mongoose.Schema.Types.Mixed,
  chatHistory: [mongoose.Schema.Types.Mixed],
  customerSummary: mongoose.Schema.Types.Mixed,
  processedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Analysis', analysisSchema);
