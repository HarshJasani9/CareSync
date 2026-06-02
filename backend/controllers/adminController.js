const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { sendEmail, doctorApprovalEmail } = require('../utils/sendEmail');

// @desc    Get all doctors with status 'pending'
// @route   GET /api/admin/doctors/pending
// @access  Private (admin)
const getPendingDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ status: 'pending' }).populate(
      'user',
      'name email phone createdAt'
    );

    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a doctor
// @route   PATCH /api/admin/doctors/:id/approve
// @access  Private (admin)
const approveOrRejectDoctor = async (req, res, next) => {
  try {
    const { action } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: "Action must be 'approve' or 'reject'" });
    }

    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (doctor.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Doctor already has status '${doctor.status}'` });
    }

    doctor.status = action === 'approve' ? 'verified' : 'rejected';
    await doctor.save();

    const isApproved = action === 'approve';
    try {
      await sendEmail({
        to: doctor.user.email,
        subject: `Your CareSync Doctor Account has been ${isApproved ? 'Approved' : 'Rejected'}`,
        html: doctorApprovalEmail({
          doctorName: doctor.user.name,
          status: doctor.status,
        }),
      });
    } catch (emailError) {
      console.error('Admin notification email failed:', emailError.message);
    }

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform-wide statistics
// @route   GET /api/admin/stats
// @access  Private (admin)
const getPlatformStats = async (req, res, next) => {
  try {
    const [totalUsers, totalDoctors, pendingDoctors, totalAppointments, appointmentsByStatus] =
      await Promise.all([
        User.countDocuments({ role: 'patient' }),
        Doctor.countDocuments({ status: 'verified' }),
        Doctor.countDocuments({ status: 'pending' }),
        Appointment.countDocuments(),
        Appointment.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        pendingDoctors,
        totalAppointments,
        appointmentsByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPendingDoctors, approveOrRejectDoctor, getPlatformStats };
