const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getDoctors,
  getDoctorById,
  updateDoctorProfile,
  updateAvailableSlots,
  getDoctorReviews,
} = require('../controllers/doctorController');

const router = express.Router();

// GET /api/doctors — public: search/browse verified doctors
router.get('/', getDoctors);

// GET /api/doctors/:id — public: single doctor profile
router.get('/:id', getDoctorById);

// PUT /api/doctors/profile — private: doctor updates own profile
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);

// PUT /api/doctors/slots — private: doctor updates available slots
router.put('/slots', protect, authorize('doctor'), updateAvailableSlots);

// GET /api/doctors/:id/reviews — public: reviews for a doctor
router.get('/:id/reviews', getDoctorReviews);

module.exports = router;
