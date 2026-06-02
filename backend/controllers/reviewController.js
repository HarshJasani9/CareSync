const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

// @desc    Create a review for a completed appointment
// @route   POST /api/reviews
// @access  Private (patient)
const createReview = async (req, res, next) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Verify patient owns this appointment
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this appointment' });
    }

    // Only completed appointments can be reviewed
    if (appointment.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed appointments' });
    }

    // Check if review already exists (unique constraint will also catch this)
    const existingReview = await Review.findOne({ appointment: appointmentId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this appointment' });
    }

    // Create review — post-save hook auto-recalculates Doctor.rating
    const review = await Review.create({
      patient: req.user._id,
      doctor: appointment.doctor,
      appointment: appointmentId,
      rating,
      comment,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (patient)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Verify patient owns this review
    if (review.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const doctorId = review.doctor;

    // Delete review — findOneAndDelete triggers post hook for rating recalculation
    await Review.findByIdAndDelete(req.params.id);

    // Manually trigger recalculation as a safety net
    await Review.calcAverageRating(doctorId);

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, deleteReview };
