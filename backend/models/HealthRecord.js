const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient is required'],
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['lab', 'prescription', 'scan', 'other'],
      required: [true, 'Please specify the record type'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image'],
      required: [true, 'File type is required'],
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for patient lookups and shared-record queries
HealthRecordSchema.index({ patient: 1 });
HealthRecordSchema.index({ sharedWith: 1 });

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
