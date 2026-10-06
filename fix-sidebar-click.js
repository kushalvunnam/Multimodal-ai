const fs = require('fs');
let sidebar = fs.readFileSync('frontend/src/components/layout/Sidebar.jsx', 'utf8');

sidebar = sidebar.replace(
  "onClick={() => setMobileOpen && setMobileOpen(false)} onClick={() => setMobileOpen && setMobileOpen(false)}",
  "onClick={() => setMobileOpen && setMobileOpen(false)}"
);

fs.writeFileSync('frontend/src/components/layout/Sidebar.jsx', sidebar);
