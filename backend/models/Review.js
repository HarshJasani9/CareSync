const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment is required'],
      unique: true, // One review per appointment
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

// Static method — recalculate doctor's average rating and total reviews
ReviewSchema.statics.calcAverageRating = async function (doctorId) {
  const stats = await this.aggregate([
    { $match: { doctor: doctorId } },
    {
      $group: {
        _id: '$doctor',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Doctor').findByIdAndUpdate(doctorId, {
      rating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
      totalReviews: stats[0].count,
    });
  } else {
    // No reviews left — reset to defaults
    await mongoose.model('Doctor').findByIdAndUpdate(doctorId, {
      rating: 0,
      totalReviews: 0,
    });
  }
};

// Post-save hook — recalculate after a new review is added
ReviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.doctor);
});

// Post-remove hook — recalculate after a review is deleted
ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.doctor);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
