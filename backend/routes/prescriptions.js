const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  createPrescription,
  getMyPrescriptions,
  getPrescriptionById,
  downloadPrescriptionPDF,
} = require('../controllers/prescriptionController');

const router = express.Router();

// POST /api/prescriptions — doctor creates prescription
router.post(
  '/',
  protect,
  authorize('doctor'),
  [
    body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
    body('diagnosis').notEmpty().withMessage('Diagnosis is required'),
    body('medicines')
      .isArray({ min: 1 })
      .withMessage('At least one medicine is required'),
    body('medicines.*.name').notEmpty().withMessage('Medicine name is required'),
  ],
  validate,
  createPrescription
);

// GET /api/prescriptions/my — patient's prescriptions
router.get('/my', protect, authorize('patient'), getMyPrescriptions);

// GET /api/prescriptions/:id — single prescription
router.get('/:id', protect, getPrescriptionById);

// GET /api/prescriptions/:id/pdf — redirect to PDF
router.get('/:id/pdf', protect, downloadPrescriptionPDF);

module.exports = router;
