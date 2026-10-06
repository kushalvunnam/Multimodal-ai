const fs = require('fs');
const file = 'backend/server.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(""const dotenv = require('dotenv');"", ""const dotenv = require('dotenv');\nconst mongoose = require('mongoose');\nconst cookieParser = require('cookie-parser');\nconst authRoutes = require('./routes/authRoutes');"");

const dbConnection = mongoose.connect(process.env.MONGODB_URI)\n  .then(() => console.log('MongoDB connected'))\n  .catch(err => console.error('MongoDB connection error:', err));\n;
if (!content.includes('mongoose.connect')) {
  content = content.replace('const app = express();', dbConnection + '\nconst app = express();');
}

if (!content.includes('app.use(cookieParser())')) {
  content = content.replace('app.use(express.json());', ""app.use(express.json());\napp.use(cookieParser());"");
}

if (!content.includes('/api/auth')) {
  content = content.replace(""app.use('/api/analysis', analysisRoutes);"", ""app.use('/api/auth', authRoutes);\napp.use('/api/analysis', analysisRoutes);"");
}

fs.writeFileSync(file, content);
console.log('server.js updated');
