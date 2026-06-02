const Doctor = require('../models/Doctor');
const Review = require('../models/Review');

// @desc    Get all verified doctors (with filters + pagination)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const { specialization, name, minRating, maxFee, page = 1, limit = 10 } = req.query;

    // Always show only verified doctors
    const filter = { status: 'verified' };

    if (specialization) {
      filter.specialization = { $regex: specialization, $options: 'i' };
    }
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }
    if (maxFee) {
      filter.consultationFee = { $lte: Number(maxFee) };
    }

    // Build query
    let query = Doctor.find(filter).populate('user', 'name email avatar');

    // If searching by doctor name, we need to filter after populate
    // For now, use a two-step approach
    if (name) {
      // Find user IDs matching the name first
      const User = require('../models/User');
      const matchingUsers = await User.find({
        name: { $regex: name, $options: 'i' },
        role: 'doctor',
      }).select('_id');
      const userIds = matchingUsers.map((u) => u._id);
      filter.user = { $in: userIds };
      query = Doctor.find(filter).populate('user', 'name email avatar');
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Doctor.countDocuments(filter);
    const doctors = await query.skip(skip).limit(limitNum);

    res.status(200).json({
      success: true,
      count: doctors.length,
      total,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      'user',
      'name email avatar phone'
    );

    if (!doctor || doctor.status !== 'verified') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile (own profile only)
// @route   PUT /api/doctors/profile
// @access  Private (doctor)
const updateDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const allowedFields = ['specialization', 'qualifications', 'experience', 'consultationFee', 'bio'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    await doctor.save({ validateBeforeSave: true });

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Update available time slots
// @route   PUT /api/doctors/slots
// @access  Private (doctor)
const updateAvailableSlots = async (req, res, next) => {
  try {
    const { slots } = req.body;

    if (!slots || !Array.isArray(slots)) {
      return res.status(400).json({ success: false, message: 'Slots must be an array' });
    }

    // Validate: no overlapping slots on the same day
    const days = {};
    for (const slot of slots) {
      if (!days[slot.day]) {
        days[slot.day] = [];
      }

      // Check for overlap with existing slots on the same day
      for (const existing of days[slot.day]) {
        if (slot.startTime < existing.endTime && slot.endTime > existing.startTime) {
          return res.status(400).json({
            success: false,
            message: `Overlapping slots on ${slot.day}: ${slot.startTime}-${slot.endTime} conflicts with ${existing.startTime}-${existing.endTime}`,
          });
        }
      }

      days[slot.day].push(slot);
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    // Replace slots entirely
    doctor.availableSlots = slots;
    await doctor.save();

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific doctor
// @route   GET /api/doctors/:id/reviews
// @access  Public
const getDoctorReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ doctor: req.params.id })
      .populate('patient', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  updateDoctorProfile,
  updateAvailableSlots,
  getDoctorReviews,
};
