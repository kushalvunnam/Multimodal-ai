const fs = require('fs');
let app = fs.readFileSync('frontend/src/App.jsx', 'utf8');

if (!app.includes('ErrorBoundary')) {
  app = app.replace("import { AuthProvider } from './context/AuthContext';", "import { AuthProvider } from './context/AuthContext';\nimport ErrorBoundary from './components/ErrorBoundary';");
  app = app.replace("<AuthProvider>", "<ErrorBoundary>\n      <AuthProvider>");
  app = app.replace("</AuthProvider>", "</AuthProvider>\n      </ErrorBoundary>");
  fs.writeFileSync('frontend/src/App.jsx', app);
}
