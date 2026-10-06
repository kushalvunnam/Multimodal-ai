const fs = require('fs');
let controller = fs.readFileSync('backend/controllers/analysisController.js', 'utf8');

controller = controller.replace(/steps: await db\.getAnalysis\(id, userId\)\.processingStatus\.steps/g, 'steps: (await db.getAnalysis(id, userId)).processingStatus.steps');

fs.writeFileSync('backend/controllers/analysisController.js', controller);
