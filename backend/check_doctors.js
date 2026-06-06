require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const User = require('./models/User');

async function checkDoctors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const doctors = await Doctor.find({}).populate('user', 'name email role');
    
    console.log(`\nTotal Doctor documents: ${doctors.length}\n`);
    
    doctors.forEach(d => {
      console.log(`Doctor._id:  ${d._id}`);
      console.log(`  User._id:  ${d.user?._id}`);
      console.log(`  Name:      ${d.user?.name}`);
      console.log(`  Email:     ${d.user?.email}`);
      console.log(`  Role:      ${d.user?.role}`);
      console.log(`  Status:    ${d.status}`);
      console.log(`  Spec:      ${d.specialization}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkDoctors();
