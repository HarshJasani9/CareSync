const HealthRecord = require('../models/HealthRecord');
const Doctor = require('../models/Doctor');
const cloudinary = require('../config/cloudinary');
const { uploadToCloudinary } = require('../middleware/upload');

// @desc    Upload a health record (lab report, scan, old prescription)
// @route   POST /api/records
// @access  Private (patient)
const uploadRecord = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { title, type, date } = req.body;

    // Determine file type
    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';

    // Upload to Cloudinary
    const { url, public_id } = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      'carelink/health-records'
    );

    // Create health record
    const record = await HealthRecord.create({
      patient: req.user._id,
      title,
      type,
      fileUrl: url,
      fileType,
      publicId: public_id,
      date: date || Date.now(),
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all records for logged-in patient
// @route   GET /api/records/my
// @access  Private (patient)
const getMyRecords = async (req, res, next) => {
  try {
    const records = await HealthRecord.find({ patient: req.user._id }).sort({ date: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
};

// @desc    Share a record with a doctor
// @route   PATCH /api/records/:id/share
// @access  Private (patient)
const shareRecord = async (req, res, next) => {
  try {
    const { doctorId } = req.body;

    const record = await HealthRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    // Verify record belongs to this patient
    if (record.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Verify doctor exists and is verified
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || doctor.status !== 'verified') {
      return res.status(404).json({ success: false, message: 'Doctor not found or not verified' });
    }

    // Add doctor to sharedWith (avoid duplicates)
    const updatedRecord = await HealthRecord.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { sharedWith: doctorId } },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedRecord });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a health record
// @route   DELETE /api/records/:id
// @access  Private (patient)
const deleteRecord = async (req, res, next) => {
  try {
    const record = await HealthRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    // Verify record belongs to this patient
    if (record.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete from Cloudinary
    if (record.publicId) {
      const resourceType = record.fileType === 'pdf' ? 'raw' : 'image';
      try {
        await cloudinary.uploader.destroy(record.publicId, { resource_type: resourceType });
      } catch (cloudErr) {
        console.error('Cloudinary deletion failed:', cloudErr.message);
      }
    }

    await HealthRecord.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Record deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadRecord, getMyRecords, shareRecord, deleteRecord };
