const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
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
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'], // e.g. '10:00 AM - 10:30 AM'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for the visit'],
    },
    notes: {
      type: String, // Doctor's post-visit notes
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
    },
  },
  { timestamps: true }
);

// Compound indexes for efficient queries
AppointmentSchema.index({ patient: 1, date: 1 });
AppointmentSchema.index({ doctor: 1, date: 1 });
AppointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);
