const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (patient)
const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;

    // Check doctor exists and is verified
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || doctor.status !== 'verified') {
      return res.status(404).json({ success: false, message: 'Doctor not found or not verified' });
    }

    // Check for slot conflict
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflict) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      reason,
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's appointments (patient or doctor)
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'patient') {
      query = Appointment.find({ patient: req.user._id });
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      }
      query = Appointment.find({ doctor: doctor._id });
    } else {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const appointments = await query
      .populate('patient', 'name avatar')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name avatar' },
      })
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email avatar phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email avatar' },
      })
      .populate('prescription');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Ensure requesting user owns the appointment (patient or doctor)
    const doctor = await Doctor.findOne({ user: req.user._id });
    const isPatient = appointment.patient._id.toString() === req.user._id.toString();
    const isDoctor = doctor && appointment.doctor._id.toString() === doctor._id.toString();

    if (!isPatient && !isDoctor) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this appointment' });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (doctor approves/rejects)
// @route   PATCH /api/appointments/:id/status
// @access  Private (doctor)
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Only allow pending → confirmed | rejected
    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be confirmed or rejected' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Verify this doctor owns the appointment
    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Only pending appointments can be confirmed/rejected
    if (appointment.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Cannot update appointment with status '${appointment.status}'` });
    }

    appointment.status = status;
    await appointment.save();

    // If confirmed, send email notification to patient
    if (status === 'confirmed') {
      const patient = await User.findById(appointment.patient);
      const doctorUser = await User.findById(req.user._id);

      try {
        await sendEmail({
          to: patient.email,
          subject: 'CareLink — Appointment Confirmed',
          html: `
            <h2>Your appointment has been confirmed!</h2>
            <p><strong>Doctor:</strong> ${doctorUser.name}</p>
            <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.timeSlot}</p>
            <p>Please be on time. You can view your appointment details on your dashboard.</p>
          `,
        });
      } catch (emailError) {
        // Log but don't fail the request if email fails
        console.error('Email send failed:', emailError.message);
      }
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private (patient)
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Verify the patient owns this appointment
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Can only cancel pending or confirmed appointments
    if (!['pending', 'confirmed'].includes(appointment.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel appointment with status '${appointment.status}'` });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
};
