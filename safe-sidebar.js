const fs = require('fs');
let sidebar = fs.readFileSync('frontend/src/components/layout/Sidebar.jsx', 'utf8');

sidebar = sidebar.replace(
  "const capacityPercent = Math.min(100, Math.round((usage.used / usage.limit) * 100)) || 0;",
  "const capacityPercent = Math.min(100, Math.round(((usage?.used || 0) / (usage?.limit || 100)) * 100)) || 0;"
);

fs.writeFileSync('frontend/src/components/layout/Sidebar.jsx', sidebar);
