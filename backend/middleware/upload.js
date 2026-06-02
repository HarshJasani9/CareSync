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

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer}  fileBuffer - The file buffer from multer memoryStorage
 * @param {String}  mimeType   - MIME type (e.g. 'image/png', 'application/pdf')
 * @param {String}  folder     - Cloudinary folder (e.g. 'caresync/records')
 * @returns {Promise<{ url: String, public_id: String }>}
 */
const uploadToCloudinary = (fileBuffer, mimeType, folder) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimeType === 'application/pdf' ? 'raw' : 'image';

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );

    stream.end(fileBuffer);
  });
};

module.exports = { uploadSingle, uploadAvatar, uploadToCloudinary };
