const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
} = require('../controllers/appointmentController');

const router = express.Router();

// POST /api/appointments — patient books appointment
router.post(
  '/',
  protect,
  authorize('patient'),
  [
    body('doctorId').notEmpty().withMessage('Doctor ID is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('timeSlot').notEmpty().withMessage('Time slot is required'),
    body('reason').notEmpty().withMessage('Reason for visit is required'),
  ],
  validate,
  bookAppointment
);

// GET /api/appointments/my — get logged-in user's appointments
router.get('/my', protect, getMyAppointments);

// GET /api/appointments/:id — get single appointment
router.get('/:id', protect, getAppointmentById);

// PATCH /api/appointments/:id/status — doctor confirms/rejects
router.patch('/:id/status', protect, authorize('doctor'), updateAppointmentStatus);

// DELETE /api/appointments/:id — patient cancels
router.delete('/:id', protect, authorize('patient'), cancelAppointment);

module.exports = router;
