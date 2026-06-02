const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment reference is required'],
      unique: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient is required'],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required'],
    },
    medicines: [
      {
        name: {
          type: String,
          required: [true, 'Medicine name is required'],
        },
        dosage: {
          type: String, // e.g. '500mg'
        },
        frequency: {
          type: String, // e.g. 'Twice daily'
        },
        duration: {
          type: String, // e.g. '7 days'
        },
      },
    ],
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
    },
    instructions: {
      type: String, // Follow-up notes
    },
    pdfUrl: {
      type: String, // Cloudinary URL, added after PDF generation
    },
    validUntil: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', PrescriptionSchema);
