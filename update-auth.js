const fs = require('fs');
let auth = fs.readFileSync('frontend/src/context/AuthContext.jsx', 'utf8');

auth = auth.replace(
  'setUser(null);\n          setIsAuthenticated(false);',
  'localStorage.removeItem("omnisense_token");\n          setUser(null);\n          setIsAuthenticated(false);'
).replace(
  'setUser(null);\n          setIsAuthenticated(false);',
  'localStorage.removeItem("omnisense_token");\n          setUser(null);\n          setIsAuthenticated(false);'
).replace(
  'setUser(null);\n          setIsAuthenticated(false);',
  'localStorage.removeItem("omnisense_token");\n          setUser(null);\n          setIsAuthenticated(false);'
);

auth = auth.replace(
  'const login = async (credentials) => {\n    const res = await signin(credentials);\n    if (res.success) {\n      setUser(res.data?.user || res.user);\n      setIsAuthenticated(true);\n    }',
  `const login = async (credentials) => {
    const res = await signin(credentials);
    if (res.success) {
      if (res.token) localStorage.setItem('omnisense_token', res.token);
      setUser(res.data?.user || res.user);
      setIsAuthenticated(true);
    }`
);

// Fallback replace for login if the above exact match failed
if (!auth.includes("localStorage.setItem('omnisense_token'")) {
  auth = auth.replace(
    'const login = async (credentials) => {\n    const res = await signin(credentials);\n    if (res.success) {\n      setUser(res.user);\n      setIsAuthenticated(true);\n    }',
    `const login = async (credentials) => {
    const res = await signin(credentials);
    if (res.success) {
      if (res.token) localStorage.setItem('omnisense_token', res.token);
      setUser(res.user);
      setIsAuthenticated(true);
    }`
  );
  auth = auth.replace(
    'const login = async (credentials) => {\n    const res = await signin(credentials);\n    if (res.success) {\n      setUser(res.data.user);\n      setIsAuthenticated(true);\n    }',
    `const login = async (credentials) => {
    const res = await signin(credentials);
    if (res.success) {
      if (res.token) localStorage.setItem('omnisense_token', res.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
    }`
  );
}

auth = auth.replace(
  'const register = async (userData) => {\n    const res = await signup(userData);\n    if (res.success) {\n      setUser(res.data?.user || res.user);\n      setIsAuthenticated(true);\n    }',
  `const register = async (userData) => {
    const res = await signup(userData);
    if (res.success) {
      if (res.token) localStorage.setItem('omnisense_token', res.token);
      setUser(res.data?.user || res.user);
      setIsAuthenticated(true);
    }`
);

if (!auth.includes("register = async") && auth.includes('const signup = async')) {
    auth = auth.replace(
        'const signupFn = async (userData) => {\n    const res = await signup(userData);\n    if (res.success) {\n      setUser(res.data.user);\n      setIsAuthenticated(true);\n    }',
        `const signupFn = async (userData) => {
        const res = await signup(userData);
        if (res.success) {
          if (res.token) localStorage.setItem('omnisense_token', res.token);
          setUser(res.data.user);
          setIsAuthenticated(true);
        }`
      );
}

auth = auth.replace(
  'const logout = async () => {\n    try {\n      await signout();\n    } catch (e) {}\n    setUser(null);\n    setIsAuthenticated(false);\n  };',
  `const logout = async () => {
    try {
      await signout();
    } catch (e) {}
    localStorage.removeItem('omnisense_token');
    setUser(null);
    setIsAuthenticated(false);
  };`
);

fs.writeFileSync('frontend/src/context/AuthContext.jsx', auth);
