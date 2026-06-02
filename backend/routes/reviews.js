const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { createReview, deleteReview } = require('../controllers/reviewController');

const router = express.Router();

// POST /api/reviews — patient creates a review
router.post(
  '/',
  protect,
  authorize('patient'),
  [
    body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
  ],
  validate,
  createReview
);

// DELETE /api/reviews/:id — patient deletes their review
router.delete('/:id', protect, authorize('patient'), deleteReview);

module.exports = router;
