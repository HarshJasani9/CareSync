const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const generatePrescriptionPDF = require('../utils/generatePDF');
const { uploadToCloudinary } = require('../middleware/upload');
const { sendEmail, prescriptionReadyEmail } = require('../utils/sendEmail');

// @desc    Create a prescription for a confirmed/completed appointment
// @route   POST /api/prescriptions
// @access  Private (doctor)
const createPrescription = async (req, res, next) => {
  try {
    const { appointmentId, medicines, diagnosis, instructions, validUntil } = req.body;

    // Get doctor profile
    const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    // Verify appointment exists and belongs to this doctor
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this appointment' });
    }

    if (!['confirmed', 'completed'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot write prescription for appointment with status '${appointment.status}'`,
      });
    }

    // Check if prescription already exists for this appointment
    if (appointment.prescription) {
      return res.status(400).json({ success: false, message: 'Prescription already exists for this appointment' });
    }

    // Get patient details for PDF
    const patient = await User.findById(appointment.patient);

    // Create prescription document (pdfUrl added after generation)
    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: appointment.patient,
      doctor: doctor._id,
      medicines,
      diagnosis,
      instructions,
      validUntil,
    });

    // Generate PDF
    const pdfBuffer = await generatePrescriptionPDF({
      doctorName: doctor.user.name,
      doctorSpecialization: doctor.specialization,
      doctorQualifications: doctor.qualifications,
      patientName: patient.name,
      patientDOB: patient.dateOfBirth,
      patientBloodGroup: patient.bloodGroup,
      date: new Date(),
      diagnosis,
      instructions,
      validUntil,
      medicines,
    });

    // Upload PDF to Cloudinary
    const { url: pdfUrl } = await uploadToCloudinary(
      pdfBuffer,
      'application/pdf',
      'caresync/prescriptions'
    );

    // Save PDF URL to prescription
    prescription.pdfUrl = pdfUrl;
    await prescription.save();

    // Link prescription to appointment and mark as completed
    await Appointment.findByIdAndUpdate(appointmentId, {
      prescription: prescription._id,
      status: 'completed',
    });

    // Send email to patient with PDF link
    try {
      await sendEmail({
        to: patient.email,
        subject: 'Your Prescription is Ready — CareSync',
        html: prescriptionReadyEmail({
          patientName: patient.name,
          doctorName: doctor.user.name,
          pdfUrl,
        }),
      });
    } catch (emailError) {
      console.error('Prescription email failed:', emailError.message);
    }

    req.io.to(patient._id.toString()).emit('prescription:ready', {
      prescriptionId: prescription._id,
      doctorName:     req.user.name,
      diagnosis:      prescription.diagnosis,
      pdfUrl:         prescription.pdfUrl
    });

    res.status(201).json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in patient's prescriptions
// @route   GET /api/prescriptions/my
// @access  Private (patient)
const getMyPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name avatar' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email avatar phone dateOfBirth bloodGroup')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email avatar' },
      })
      .populate('appointment');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    // Verify requester is the patient or the doctor
    const isPatient = prescription.patient._id.toString() === req.user._id.toString();
    const doctor = await Doctor.findOne({ user: req.user._id });
    const isDoctor = doctor && prescription.doctor._id.toString() === doctor._id.toString();

    if (!isPatient && !isDoctor) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this prescription' });
    }

    res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};

// @desc    Download / redirect to prescription PDF
// @route   GET /api/prescriptions/:id/pdf
// @access  Private
const downloadPrescriptionPDF = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    // Verify access
    const isPatient = prescription.patient.toString() === req.user._id.toString();
    const doctor = await Doctor.findOne({ user: req.user._id });
    const isDoctor = doctor && prescription.doctor.toString() === doctor._id.toString();

    if (!isPatient && !isDoctor) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!prescription.pdfUrl) {
      return res.status(404).json({ success: false, message: 'PDF not yet generated' });
    }

    res.redirect(prescription.pdfUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrescription,
  getMyPrescriptions,
  getPrescriptionById,
  downloadPrescriptionPDF,
};
