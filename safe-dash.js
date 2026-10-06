const fs = require('fs');
let dash = fs.readFileSync('frontend/src/pages/Dashboard.jsx', 'utf8');

dash = dash.replace(
  "dashboardData.totalAnalyses.toString()",
  "(dashboardData?.totalAnalyses || 0).toString()"
).replace(
  "dashboardData.damageDetected.toString()",
  "(dashboardData?.damageDetected || 0).toString()"
).replace(
  "dashboardData.documents.toString()",
  "(dashboardData?.documents || 0).toString()"
).replace(
  "dashboardData.aiConfidence > 0 ? `${dashboardData.aiConfidence}%` : '--'",
  "(dashboardData?.aiConfidence > 0) ? `${dashboardData.aiConfidence}%` : '--'"
);

dash = dash.replace(
  "const recent = dashboardData.recentAnalyses || [];",
  "const recent = dashboardData?.recentAnalyses || [];"
);

fs.writeFileSync('frontend/src/pages/Dashboard.jsx', dash);
