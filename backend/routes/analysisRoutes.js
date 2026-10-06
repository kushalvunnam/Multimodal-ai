const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const { requireAuth } = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

// Apply auth to all routes
router.use(requireAuth);

router.get('/', analysisController.getUserAnalyses);
router.post('/create', analysisController.createAnalysis);
router.get('/:id', analysisController.getAnalysis);
router.get('/:id/status', analysisController.getAnalysisStatus);
router.post('/:id/upload', upload, handleUploadError, analysisController.uploadFile);
router.delete('/:id/input/:inputId', analysisController.removeInput);
router.post('/:id/context', analysisController.updateContext);
router.put('/:id/status', analysisController.updateStatus);
router.post('/:id/process', analysisController.processAnalysis);
router.post('/:id/chat', analysisController.chat);
router.post('/:id/summary', analysisController.generateCustomerSummary);

module.exports = router;


