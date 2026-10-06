const { v4: uuidv4 } = require('uuid');

// In-memory file storage for Phase 3/4
const fileStore = new Map();

const uploadFile = async (file) => {
  const storageReference = `memory://${uuidv4()}-${file.originalname}`;
  
  fileStore.set(storageReference, {
    buffer: file.buffer,
    mimeType: file.mimetype
  });
  
  return {
    storageReference,
    filename: file.originalname,
    mimeType: file.mimetype,
    size: file.size
  };
};

const getFile = async (storageReference) => {
  return fileStore.get(storageReference) || null;
};

const deleteFile = async (storageReference) => {
  fileStore.delete(storageReference);
  return true;
};

module.exports = {
  uploadFile,
  getFile,
  deleteFile
};
