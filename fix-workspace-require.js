const fs = require('fs');
let workspace = fs.readFileSync('frontend/src/pages/AnalysisWorkspace.jsx', 'utf8');
workspace = workspace.replace("const { getAnalysis } = require('../services/api');", "");
fs.writeFileSync('frontend/src/pages/AnalysisWorkspace.jsx', workspace);
