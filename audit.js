const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const hooks = ['useState', 'useEffect', 'useMemo', 'useCallback', 'useRef', 'useContext'];

walkDir('frontend/src', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    const content = fs.readFileSync(filePath, 'utf8');
    let missing = [];
    hooks.forEach(hook => {
      // If the hook is used in code (e.g. `useState(` or `useState=`)
      const hookUsed = new RegExp(`\\b${hook}\\s*\\(`, 'g').test(content) || new RegExp(`\\b${hook}\\b`).test(content);
      if (hookUsed) {
        // Check if it's imported
        const isImported = new RegExp(`import\\s+{[^}]*\\b${hook}\\b[^}]*}\\s+from\\s+['"]react['"]`).test(content);
        // Sometimes imported as `import React, { useState } from 'react'`
        if (!isImported && !content.includes(`React.${hook}`)) {
          missing.push(hook);
        }
      }
    });
    if (missing.length > 0) {
      console.log(`Missing imports in ${filePath}:`, missing.join(', '));
    }
  }
});
