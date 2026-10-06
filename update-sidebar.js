const fs = require('fs');
let sidebar = fs.readFileSync('frontend/src/components/layout/Sidebar.jsx', 'utf8');

// Replace the hardcoded 65% strings
sidebar = sidebar.replace(
  "animate={{ width: '65%' }}",
  "animate={{ width: `${capacityPercent}%` }}"
);

sidebar = sidebar.replace(
  ">65% Capacity</p>",
  ">{capacityPercent}% Capacity</p>"
);

// If capacityPercent isn't defined, it means my previous script failed to inject the state too!
if (!sidebar.includes('capacityPercent')) {
  sidebar = sidebar.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';\nimport { getDashboardStats } from '../../services/api';");
  
  const stateInject = `export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [usage, setUsage] = useState({ used: 0, limit: 100 });

  useEffect(() => {
    let mounted = true;
    const fetchUsage = async () => {
      try {
        const res = await getDashboardStats();
        if (mounted && res?.success) setUsage(res.data.usage);
      } catch (e) {}
    };
    fetchUsage();
    return () => { mounted = false; };
  }, []);

  const capacityPercent = Math.min(100, Math.round((usage.used / usage.limit) * 100)) || 0;
`;
  sidebar = sidebar.replace('export default function Sidebar({ mobileOpen, setMobileOpen }) {', stateInject);
}

fs.writeFileSync('frontend/src/components/layout/Sidebar.jsx', sidebar);
