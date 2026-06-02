const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const {
  uploadRecord,
  getMyRecords,
  shareRecord,
  deleteRecord,
} = require('../controllers/recordController');

const router = express.Router();

// POST /api/records — patient uploads a health record
router.post('/', protect, authorize('patient'), uploadSingle, uploadRecord);

// GET /api/records/my — patient's records
router.get('/my', protect, authorize('patient'), getMyRecords);

// PATCH /api/records/:id/share — share record with a doctor
router.patch('/:id/share', protect, authorize('patient'), shareRecord);

// DELETE /api/records/:id — delete a record
router.delete('/:id', protect, authorize('patient'), deleteRecord);

module.exports = router;
