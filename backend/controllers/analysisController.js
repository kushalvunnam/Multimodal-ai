exports.getDashboardStats = async (req, res) => {
  try {
    const analyses = await db.getAnalysesByUser(req.user.id);
    const totalAnalyses = analyses.length;
    const documents = analyses.filter(a => a.inputs && a.inputs.some(i => i.type === 'document')).length;
    
    const damageDetected = analyses.filter(a => {
      if (!a.imageAnalysis) return false;
      const damages = Array.isArray(a.imageAnalysis) 
        ? a.imageAnalysis.flatMap(i => i.damage || []) 
        : (a.imageAnalysis.damage || []);
      return damages.length > 0;
    }).length;

    const confidences = [];
    analyses.forEach(a => {
      if (a.imageAnalysis && a.imageAnalysis.confidence) confidences.push(a.imageAnalysis.confidence);
      else if (Array.isArray(a.imageAnalysis)) {
        a.imageAnalysis.forEach(img => { if (img.confidence) confidences.push(img.confidence); });
      }
    });
    const avgConfidence = confidences.length 
      ? Math.round(confidences.reduce((acc, c) => acc + c, 0) / confidences.length * 100) 
      : 0;

    const recentAnalyses = analyses
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(a => {
        const findings = [];
        if (a.imageAnalysis) {
          const damages = Array.isArray(a.imageAnalysis) ? a.imageAnalysis.flatMap(i => i.damage || []) : (a.imageAnalysis.damage || []);
          if (damages.length > 0) findings.push({ label: damages[0].type || 'Damage', level: damages[0].severity === 'High' ? 'High' : 'Medium' });
        }
        let statusString = 'Draft';
        if (a.status === 'processed') statusString = 'Completed';
        else if (a.status === 'processing') statusString = 'Processing';
        else if (a.status === 'failed') statusString = 'Failed';

        return {
          id: a._id.toString().substring(0,8).toUpperCase(),
          originalId: a._id,
          type: new Date(a.createdAt).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: statusString,
          findings: findings,
          image: a.inputs && a.inputs.some(i => i.type === 'image') ? 'true' : 'false'
        };
      });

    res.json({
      success: true,
      data: {
        totalAnalyses,
        damageDetected,
        documents,
        aiConfidence: avgConfidence,
        recentAnalyses,
        usage: {
          used: totalAnalyses,
          limit: 100
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

exports.getUserAnalyses = async (req, res) => {
  try { res.json({ success: true, data: await db.getAnalysesByUser(req.user.id) }); }
  catch (error) { res.status(500).json({ success: false, error: { message: error.message } }); }
};
const db = require('../services/dbService');
const uploadService = require('../services/uploadService');
const aiService = require('../services/ai');

const SIZE_LIMITS = { image: 10 * 1024 * 1024, document: 20 * 1024 * 1024, audio: 25 * 1024 * 1024 };

const getFileType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
  return 'unknown';
};

exports.createAnalysis = async (req, res) => {
  try { res.json({ success: true, data: await db.createAnalysis(req.body, req.user.id) }); }
  catch (error) { res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } }); }
};

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No file provided.' } });
    const analysis = await db.getAnalysis(req.params.id, req.user.id);
    if (!analysis) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis not found.' } });

    const type = getFileType(file.mimetype);
    const limit = SIZE_LIMITS[type] || 5 * 1024 * 1024;
    if (file.size > limit) return res.status(400).json({ success: false, error: { code: 'FILE_TOO_LARGE', message: `${type} exceeds limit.` } });

    const storageData = await uploadService.uploadFile(file);
    const input = await db.addInput(req.params.id, { ...storageData, type, status: 'uploaded' }, req.user.id);
    res.json({ success: true, data: input });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

exports.removeInput = async (req, res) => {
  try {
    const analysis = await db.getAnalysis(req.params.id, req.user.id);
    if (!analysis) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis not found.' } });
    const input = analysis.inputs.find(i => i.id === req.params.inputId);
    if (input) {
      await uploadService.deleteFile(input.storageReference);
      await db.removeInput(req.params.id, req.params.inputId, req.user.id);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

exports.updateContext = async (req, res) => {
  try {
    const analysis = await db.updateAnalysis(req.params.id, { textContext: req.body.text }, req.user.id);
    if (!analysis) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis not found.' } });
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

exports.getAnalysis = async (req, res) => {
  try {
    const analysis = await db.getAnalysis(req.params.id, req.user.id);
    if (!analysis) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis not found.' } });
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const analysis = await db.updateAnalysis(req.params.id, { status: req.body.status }, req.user.id);
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

exports.getAnalysisStatus = async (req, res) => {
  try {
    const analysis = await db.getAnalysis(req.params.id, req.user.id);
    if (!analysis) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis not found.' } });
    res.json({ success: true, data: { status: analysis.status, progress: analysis.processingStatus?.progress || 0, steps: analysis.processingStatus?.steps || [] } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

const demoImageFindings = {
  vehicle: { make: 'Toyota', model: 'Camry' },
  damage: [{ area: 'Front Bumper', severity: 'high', description: 'Significant crush damage.' }],
  imageQuality: 'good', confidence: 0.95
};
const demoDocumentFindings = {
  claimNumber: 'CLM-2026-X99', incidentDate: 'June 12, 2026',
  vehicle: { make: 'Toyota', model: 'Camry' },
  damageDescription: 'Front bumper damage from collision.',
  entities: ['John Doe'], potentialInconsistencies: [], confidence: 0.92
};
const demoAudioFindings = {
  transcript: "I hit another car. The front collision was bad. It happened on June 14.",
  language: 'en', importantStatements: ['Front collision was bad', 'happened on June 14'],
  entities: [], confidence: 0.88
};
const demoTextFindings = {
  incidentDescription: "Customer filed a claim for front end damage.",
  entities: [], dates: [], locations: [], confidence: 0.9
};

// Turn raw visual findings into useful report signals when the cross-modal model
// returns an empty result. This keeps image-only damage inspections useful.
const buildImageFallbackReasoning = (imageAnalysis) => {
  const findings = Array.isArray(imageAnalysis) ? imageAnalysis : [imageAnalysis];
  const damages = findings.flatMap((finding, index) =>
    (finding?.damage || []).map((damage) => ({
      ...damage,
      source: finding?.source || `Image ${index + 1}`
    }))
  );

  if (!damages.length) return null;

  return {
    correlations: [],
    contradictions: [],
    missingInformation: [],
    riskSignals: damages.map((damage) => ({
      reason: `${damage.area || 'Vehicle area'} damage detected`,
      evidence: damage.description || 'Visible damage detected in the uploaded image.',
      sources: [damage.source],
      severity: damage.severity || 'medium'
    })),
    recommendations: damages.map((damage) => ({
      action: `Inspect ${damage.area || 'damaged area'}`,
      reason: damage.description || 'Confirm the visible damage and repair scope.'
    })),
    overallAssessment: {
      summary: damages.length === 1
        ? `${damages[0].area || 'Vehicle'} damage was detected in the uploaded image.`
        : `${damages.length} visible damage finding(s) were detected across the uploaded vehicle images.`,
      confidence: Math.max(...damages.map(d => Number(d.confidence) || 0), 0)
    }
  };
};

exports.processAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const analysis = await db.getAnalysis(id, userId);

    if (!analysis) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis not found.' } });
    if (analysis.status === 'processing' || analysis.status === 'processed') return res.json({ success: true, data: analysis });

    const isDemo = analysis.title === 'Demo Claim' || analysis.textContext.includes('DEMO_MODE');

    const steps = [];
    if (analysis.inputs.some(i => i.type === 'image') || isDemo) steps.push({ name: 'Image Understanding', status: 'pending' });
    if (analysis.inputs.some(i => i.type === 'document') || isDemo) steps.push({ name: 'Document Intelligence', status: 'pending' });
    if (analysis.inputs.some(i => i.type === 'audio') || isDemo) steps.push({ name: 'Voice Intelligence', status: 'pending' });
    if (analysis.textContext || isDemo) steps.push({ name: 'Text Understanding', status: 'pending' });
    if (steps.length > 0) steps.push({ name: 'Cross-Modal Reasoning', status: 'pending' });

    await db.updateAnalysis(id, { status: 'processing', processingStatus: { overall: 'processing', progress: 5, steps } }, userId);
    res.json({ success: true, message: 'Processing started' });

    (async () => {
      let currentProgress = 5;
      const stepIncrement = steps.length > 0 ? 90 / steps.length : 90;
      const updateStep = async (name, status) => {
        const a = await db.getAnalysis(id, userId);
        const s = a.processingStatus.steps.map(step => step.name === name ? { ...step, status } : step);
        await db.updateAnalysis(id, { processingStatus: { ...a.processingStatus, steps: s } }, userId);
      };

      try {
        const results = {};

        if (isDemo || analysis.inputs.some(i => i.type === 'image')) {
          await updateStep('Image Understanding', 'processing');
          if (isDemo) {
            results.imageAnalysis = demoImageFindings;
            await new Promise(r => setTimeout(r, 1000));
          } else {
            // IMPORTANT: analyze every uploaded image, not only the first one.
            // The previous implementation used images[0], so extra damage photos
            // were uploaded but silently ignored during AI processing.
            const images = analysis.inputs.filter(i => i.type === 'image');
            const imageFindings = [];
            let allDamage = [];
            
            for (const [index, image] of images.entries()) {
              try {
                const fileData = await uploadService.getFile(image.storageReference);
                const finding = await aiService.processInput('image', fileData.buffer, fileData.mimeType);
                
                if (finding && !finding.error) {
                  const currentDamage = Array.isArray(finding.damage) ? finding.damage : [];
                  allDamage = [...allDamage, ...currentDamage];
                  
                  imageFindings.push({
                    imageId: image.id,
                    filename: image.originalName || image.fileName || image.name || `Image ${index + 1}`,
                    status: "completed",
                    damage: currentDamage,
                    vehicle: finding.vehicle,
                    imageQuality: finding.imageQuality,
                    confidence: finding.confidence
                  });
                } else {
                  imageFindings.push({
                    imageId: image.id,
                    filename: image.originalName || image.fileName || image.name || `Image ${index + 1}`,
                    status: "failed",
                    error: finding?.details || "Failed to process image",
                    damage: []
                  });
                }
              } catch (err) {
                imageFindings.push({
                  imageId: image.id,
                  filename: image.originalName || image.fileName || image.name || `Image ${index + 1}`,
                  status: "failed",
                  error: err.message,
                  damage: []
                });
              }
            }
            
            results.imageAnalysis = {
              images: imageFindings,
              damage: allDamage,
              vehicle: imageFindings.find(img => img.vehicle)?.vehicle || null,
              confidence: Math.max(...imageFindings.map(img => img.confidence || 0), 0)
            };
          }
          await db.updateAnalysis(id, { imageAnalysis: results.imageAnalysis }, userId);
          currentProgress += stepIncrement;
          await updateStep('Image Understanding', 'completed');
          await db.updateAnalysis(id, { processingStatus: { ...(await db.getAnalysis(id, userId)).processingStatus, progress: currentProgress } }, userId);
        }

        if (isDemo || analysis.inputs.some(i => i.type === 'document')) {
          await updateStep('Document Intelligence', 'processing');
          if (isDemo) {
            results.documentAnalysis = demoDocumentFindings;
            await new Promise(r => setTimeout(r, 1000));
          } else {
            const docs = analysis.inputs.filter(i => i.type === 'document');
            const fileData = await uploadService.getFile(docs[0].storageReference);
            results.documentAnalysis = await aiService.processInput('document', fileData.buffer, fileData.mimeType);
          }
          await db.updateAnalysis(id, { documentAnalysis: results.documentAnalysis }, userId);
          currentProgress += stepIncrement;
          await updateStep('Document Intelligence', 'completed');
          await db.updateAnalysis(id, { processingStatus: { ...(await db.getAnalysis(id, userId)).processingStatus, progress: currentProgress } }, userId);
        }

        if (isDemo || analysis.inputs.some(i => i.type === 'audio')) {
          await updateStep('Voice Intelligence', 'processing');
          if (isDemo) {
            results.audioAnalysis = demoAudioFindings;
            await new Promise(r => setTimeout(r, 1000));
          } else {
            const audio = analysis.inputs.filter(i => i.type === 'audio');
            const fileData = await uploadService.getFile(audio[0].storageReference);
            results.audioAnalysis = await aiService.processInput('audio', fileData.buffer, fileData.mimeType);
          }
          await db.updateAnalysis(id, { audioAnalysis: results.audioAnalysis }, userId);
          currentProgress += stepIncrement;
          await updateStep('Voice Intelligence', 'completed');
          await db.updateAnalysis(id, { processingStatus: { ...(await db.getAnalysis(id, userId)).processingStatus, progress: currentProgress } }, userId);
        }

        if (isDemo || analysis.textContext) {
          await updateStep('Text Understanding', 'processing');
          if (isDemo) {
            results.textAnalysis = demoTextFindings;
            await new Promise(r => setTimeout(r, 1000));
          } else {
            results.textAnalysis = await aiService.processInput('text', null, null, analysis.textContext);
          }
          await db.updateAnalysis(id, { textAnalysis: results.textAnalysis }, userId);
          currentProgress += stepIncrement;
          await updateStep('Text Understanding', 'completed');
          await db.updateAnalysis(id, { processingStatus: { ...(await db.getAnalysis(id, userId)).processingStatus, progress: currentProgress } }, userId);
        }

        if (Object.keys(results).length > 0) {
          await updateStep('Cross-Modal Reasoning', 'processing');
          const reasoningResult = await aiService.runReasoning(results);
          const fallbackReasoning = buildImageFallbackReasoning(results.imageAnalysis);
          const hasUsefulReasoning = reasoningResult && !reasoningResult.error && (
            (reasoningResult.correlations?.length || 0) > 0 ||
            (reasoningResult.contradictions?.length || 0) > 0 ||
            (reasoningResult.missingInformation?.length || 0) > 0 ||
            (reasoningResult.riskSignals?.length || 0) > 0 ||
            (reasoningResult.recommendations?.length || 0) > 0 ||
            reasoningResult.overallAssessment?.summary
          );

          // Preserve real cross-modal reasoning when available, but never hide
          // valid image damage findings behind an empty AI reasoning response.
          const finalReasoning = hasUsefulReasoning
            ? reasoningResult
            : (fallbackReasoning || reasoningResult);

          await db.updateAnalysis(id, { reasoning: finalReasoning }, userId);
          currentProgress += stepIncrement;
          await updateStep('Cross-Modal Reasoning', 'completed');
        }

        await db.updateAnalysis(id, {
          status: 'processed', processedAt: new Date(),
          processingStatus: { ...(await db.getAnalysis(id, userId)).processingStatus, overall: 'processed', progress: 100 }
        }, userId);

      } catch (err) {
        console.error('Async processing failed', err);
        await db.updateAnalysis(id, {
          status: 'failed',
          processingStatus: { overall: 'failed', progress: currentProgress, error: err.message, steps: (await db.getAnalysis(id, userId)).processingStatus.steps }
        }, userId);
      }
    })();
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

exports.chat = async (req, res) => {
  try {
    const analysis = await db.getAnalysis(req.params.id, req.user.id);
    if (!analysis) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis not found.' } });

    const reply = await aiService.runChat(analysis, req.body.message);
    const history = analysis.chatHistory || [];
    history.push({ role: 'user', content: req.body.message }, { role: 'ai', content: reply });
    await db.updateAnalysis(req.params.id, { chatHistory: history }, req.user.id);

    res.json({ success: true, data: { message: reply } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};

exports.generateCustomerSummary = async (req, res) => {
  try {
    const analysis = await db.getAnalysis(req.params.id, req.user.id);
    if (!analysis) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis not found.' } });
    if (!analysis.reasoning) return res.status(400).json({ success: false, error: { code: 'NOT_PROCESSED', message: 'Analysis must be processed first.' } });

    const summary = await aiService.generateSummary(analysis);
    await db.updateAnalysis(req.params.id, { customerSummary: summary }, req.user.id);

    res.json({ success: true, data: { summary } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
};








