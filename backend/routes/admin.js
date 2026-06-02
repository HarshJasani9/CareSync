const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getPendingDoctors,
  approveOrRejectDoctor,
  getPlatformStats,
} = require('../controllers/adminController');

const router = express.Router();

// GET /api/admin/doctors/pending — list pending doctor applications
router.get('/doctors/pending', protect, authorize('admin'), getPendingDoctors);

// PATCH /api/admin/doctors/:id/approve — approve or reject a doctor
router.patch('/doctors/:id/approve', protect, authorize('admin'), approveOrRejectDoctor);

// GET /api/admin/stats — platform-wide statistics
router.get('/stats', protect, authorize('admin'), getPlatformStats);

module.exports = router;
