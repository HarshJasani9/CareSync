const mongoose = require('mongoose');
const User = require('./models/User');

async function testAuth() {
  try {
    await mongoose.connect('mongodb://localhost:27017/caresync');
    
    const admin = await User.findOne({ email: 'admin@caresync.com' }).select('+password');
    console.log('Admin found:', admin ? true : false);
    if (admin) {
      console.log('Password hash:', admin.password);
      const isMatch = await admin.matchPassword('adminpassword123');
      console.log('Match with "adminpassword123":', isMatch);
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

testAuth();
