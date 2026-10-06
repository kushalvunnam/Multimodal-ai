const fs = require('fs');
let api = fs.readFileSync('frontend/src/services/api.js', 'utf8');

const newConfig = `const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('omnisense_token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});`;

api = api.replace(/const apiClient = axios\.create\(\{[\s\S]*?\}\);/, newConfig);

fs.writeFileSync('frontend/src/services/api.js', api);
