const fs = require('fs');
let sidebar = fs.readFileSync('frontend/src/components/layout/Sidebar.jsx', 'utf8');

sidebar = sidebar.replace('export default function Sidebar() {', 'export default function Sidebar({ mobileOpen, setMobileOpen }) {');

// Add onClick to close mobile sidebar on navigation
sidebar = sidebar.replace(
  '<NavLink',
  '<NavLink onClick={() => setMobileOpen && setMobileOpen(false)}'
);
// replace all NavLinks
sidebar = sidebar.replace(/<NavLink/g, '<NavLink onClick={() => setMobileOpen && setMobileOpen(false)}');

fs.writeFileSync('frontend/src/components/layout/Sidebar.jsx', sidebar);
