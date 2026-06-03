const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Memory storage — files stay in buffer for direct Cloudinary upload
const storage = multer.memoryStorage();

// File filter — images + PDFs
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and PDF files are allowed'), false);
  }
};

// File filter — images only (for avatar uploads)
const imageOnly = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG images are allowed'), false);
  }
};

const limits = { fileSize: 10 * 1024 * 1024 }; // 10MB max

// Pre-configured multer middlewares
const uploadSingle = multer({ storage, fileFilter, limits }).single('file');
const uploadAvatar = multer({ storage, fileFilter: imageOnly, limits }).single('avatar');

const fs = require('fs');
const path = require('path');

/**
 * Upload a file buffer to Local Storage (Bypassing Cloudinary)
 * @param {Buffer}  fileBuffer - The file buffer from multer memoryStorage
 * @param {String}  mimeType   - MIME type (e.g. 'image/png', 'application/pdf')
 * @param {String}  folder     - Cloudinary folder (e.g. 'caresync/records')
 * @returns {Promise<{ url: String, public_id: String }>}
 */
const uploadToCloudinary = (fileBuffer, mimeType, folder) => {
  return new Promise((resolve, reject) => {
    try {
      const ext = mimeType === 'application/pdf' ? '.pdf' : mimeType === 'image/png' ? '.png' : '.jpg';
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      
      // Ensure folder exists
      const uploadDir = path.join(__dirname, '../public/uploads', folder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, fileBuffer);

      // Return local URL
      const url = `http://localhost:5000/uploads/${folder}/${filename}`;
      resolve({ url, public_id: filename });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { uploadSingle, uploadAvatar, uploadToCloudinary };
