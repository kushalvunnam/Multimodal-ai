const multer = require('multer');

const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 'audio/webm'
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`UNSUPPORTED_FILE_TYPE:${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB absolute max, we'll validate specific types later
  }
});

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: { code: 'FILE_TOO_LARGE', message: 'File exceeds the maximum allowed size.' } });
    }
    return res.status(400).json({ success: false, error: { code: 'UPLOAD_ERROR', message: err.message } });
  } else if (err) {
    if (err.message.startsWith('UNSUPPORTED_FILE_TYPE')) {
      return res.status(400).json({ success: false, error: { code: 'UNSUPPORTED_FILE_TYPE', message: 'This file type is not supported.' } });
    }
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred during upload.' } });
  }
  next();
};

module.exports = {
  upload: upload.single('file'),
  handleUploadError
};
