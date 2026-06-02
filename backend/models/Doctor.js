const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please add a specialization'],
      trim: true,
    },
    qualifications: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
    },
    consultationFee: {
      type: Number,
      min: [0, 'Fee cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    availableSlots: [
      {
        day: {
          type: String,
          enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        startTime: {
          type: String, // e.g. '09:00'
        },
        endTime: {
          type: String, // e.g. '17:00'
        },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

// Indexes for faster lookups
DoctorSchema.index({ user: 1 });
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ status: 1 });

module.exports = mongoose.model('Doctor', DoctorSchema);
