const fs = require('fs');
let sidebar = fs.readFileSync('frontend/src/components/layout/Sidebar.jsx', 'utf8');

// Add imports
sidebar = sidebar.replace(
  "import { motion } from 'framer-motion';", 
  "import { motion } from 'framer-motion';\nimport { useState, useEffect } from 'react';\nimport { getDashboardStats } from '../../services/api';"
);

// Inject state
const stateInject = `export default function Sidebar() {
  const [usage, setUsage] = useState({ used: 0, limit: 100 });

  useEffect(() => {
    let mounted = true;
    const fetchUsage = async () => {
      try {
        const res = await getDashboardStats();
        if (mounted && res?.success && res.data?.usage) {
          setUsage(res.data.usage);
        }
      } catch (e) {}
    };
    fetchUsage();
    return () => { mounted = false; };
  }, []);

  const capacityPercent = Math.min(100, Math.round((usage.used / usage.limit) * 100)) || 0;
`;

sidebar = sidebar.replace('export default function Sidebar() {', stateInject);

fs.writeFileSync('frontend/src/components/layout/Sidebar.jsx', sidebar);
