const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { uploadToCloudinary } = require('../middleware/upload');

// @desc    Register a new user (patient or doctor)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, specialization, qualifications, experience, consultationFee, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create user
    const user = await User.create({ name, email, password, role: role || 'patient' });

    // If registering as doctor, create Doctor profile with status 'pending'
    if (role === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization,
        qualifications: qualifications || [],
        experience,
        consultationFee,
        bio,
      });
    }

    // Generate JWT
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
  const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for:', email);
      console.log('Password provided:', password);
  
      // Find user and include password field
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        console.log('User not found in DB');
        return res.status(401).json({ success: false, message: 'Invalid credentials (User not found)' });
      }
  
      // Verify password
      const isMatch = await user.matchPassword(password);
      console.log('Password match result:', isMatch);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials (Password mismatch)' });
      }

    // Generate JWT
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    let doctorProfile = null;

    // If doctor, populate their doctor profile
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      data: { ...user.toObject(), doctorProfile },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};

    // Only allow specific fields
    const allowedFields = ['name', 'phone', 'dateOfBirth', 'bloodGroup'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    // Handle avatar upload if file is present
    if (req.file) {
      const { url } = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype,
        'caresync/avatars'
      );
      fieldsToUpdate.avatar = url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Set new password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };
