const fs = require('fs');
const path = require('path');

const hooks = ['useState', 'useEffect', 'useMemo', 'useCallback', 'useRef', 'useContext', 'useReducer'];

function walkSync(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach((file) => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
}

const files = walkSync('frontend/src', []);
let foundIssues = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const missing = [];
  
  hooks.forEach(hook => {
    // Check if the hook is invoked, e.g. useState(
    const regexUse = new RegExp(`${hook}\\s*\\(`, 'g');
    if (regexUse.test(content)) {
      // Check if it's imported from 'react'
      const regexImport = new RegExp(`import\\s+.*\\b${hook}\\b.*from\\s+['"]react['"]`);
      if (!regexImport.test(content)) {
        missing.push(hook);
      }
    }
  });
  
  if (missing.length > 0) {
    console.log(`Missing imports in ${file}: ${missing.join(', ')}`);
    foundIssues = true;
  }
});

if (!foundIssues) {
  console.log("No missing hooks found.");
}
