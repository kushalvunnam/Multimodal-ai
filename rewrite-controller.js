const fs = require('fs');

let controller = fs.readFileSync('backend/controllers/analysisController.js', 'utf8');

// Replace synchronous db.getAnalysis, etc. with await
controller = controller.replace(/db\.getAnalysesByUser/g, 'await db.getAnalysesByUser');
controller = controller.replace(/db\.createAnalysis/g, 'await db.createAnalysis');
controller = controller.replace(/db\.getAnalysis/g, 'await db.getAnalysis');
controller = controller.replace(/db\.addInput/g, 'await db.addInput');
controller = controller.replace(/db\.removeInput/g, 'await db.removeInput');
controller = controller.replace(/db\.updateAnalysis/g, 'await db.updateAnalysis');

// Ensure functions that use `await db` are async
// E.g., `exports.getDashboardStats = (req, res) => {` -> `exports.getDashboardStats = async (req, res) => {`
controller = controller.replace(/exports\.([a-zA-Z0-9_]+)\s*=\s*\(([^)]*)\)\s*=>\s*\{/g, 'exports.$1 = async ($2) => {');

// Fix the progress inner function in processAnalysis which is synchronous map
// `updateStep` needs to be async.
controller = controller.replace(/const updateStep = \(name, status\) => {/g, 'const updateStep = async (name, status) => {');
controller = controller.replace(/updateStep\(/g, 'await updateStep(');

fs.writeFileSync('backend/controllers/analysisController.js', controller);
