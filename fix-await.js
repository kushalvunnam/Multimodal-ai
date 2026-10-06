const fs = require('fs');
let controller = fs.readFileSync('backend/controllers/analysisController.js', 'utf8');

controller = controller.replace(/\.\.\.await db\.getAnalysis\(id, userId\)\.processingStatus/g, '...(await db.getAnalysis(id, userId)).processingStatus');

fs.writeFileSync('backend/controllers/analysisController.js', controller);
