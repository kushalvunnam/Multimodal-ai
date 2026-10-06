const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://multimodal-ai-five.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = 
      allowedOrigins.includes(origin) || 
      /^https:\/\/multimodal-ai(?:-[a-z0-9-]+)?\.vercel\.app$/.test(origin) ||
      /^https:\/\/[a-zA-Z0-9-]+--[a-zA-Z0-9-]+\.netlify\.app$/.test(origin) ||
      /^https:\/\/[a-zA-Z0-9-]+\.netlify\.app$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/analysis', analysisRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'omnisense-ai' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'An unexpected server error occurred.' } });
});

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;





