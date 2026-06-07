const mongoose = require('mongoose');
require('dotenv').config();

// Require models
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Prescription = require('./models/Prescription');
const HealthRecord = require('./models/HealthRecord');
const Review = require('./models/Review');

const migrate = async () => {
  const localUri = process.env.MONGO_URI || 'mongodb://localhost:27017/caresync';
  const atlasUri = process.argv[2];

  if (!atlasUri) {
    console.error('❌ ERROR: Please provide your Atlas MongoDB URI as an argument!');
    console.log('Usage: node migrateDb.js "mongodb+srv://<username>:<password>@cluster.mongodb.net/caresync"');
    process.exit(1);
  }

  try {
    console.log('🔌 Connecting to Local MongoDB...');
    const localConn = await mongoose.createConnection(localUri).asPromise();
    
    // Fetch data using local models
    console.log('📦 Fetching data from Local DB...');
    const users = await localConn.model('User', User.schema).find().select('+password').lean();
    const doctors = await localConn.model('Doctor', Doctor.schema).find().lean();
    const appointments = await localConn.model('Appointment', Appointment.schema).find().lean();
    const prescriptions = await localConn.model('Prescription', Prescription.schema).find().lean();
    const records = await localConn.model('HealthRecord', HealthRecord.schema).find().lean();
    const reviews = await localConn.model('Review', Review.schema).find().lean();

    console.log(`✅ Fetched:
      - ${users.length} Users
      - ${doctors.length} Doctors
      - ${appointments.length} Appointments
      - ${prescriptions.length} Prescriptions
      - ${records.length} Health Records
      - ${reviews.length} Reviews
    `);
    
    await localConn.close();

    console.log('\n🌐 Connecting to Atlas MongoDB...');
    const atlasConn = await mongoose.createConnection(atlasUri).asPromise();

    console.log('🧹 Clearing existing data in Atlas DB...');
    await atlasConn.model('User', User.schema).deleteMany();
    await atlasConn.model('Doctor', Doctor.schema).deleteMany();
    await atlasConn.model('Appointment', Appointment.schema).deleteMany();
    await atlasConn.model('Prescription', Prescription.schema).deleteMany();
    await atlasConn.model('HealthRecord', HealthRecord.schema).deleteMany();
    await atlasConn.model('Review', Review.schema).deleteMany();

    console.log('🚀 Migrating data to Atlas...');
    if (users.length) await atlasConn.model('User', User.schema).insertMany(users);
    if (doctors.length) await atlasConn.model('Doctor', Doctor.schema).insertMany(doctors);
    if (appointments.length) await atlasConn.model('Appointment', Appointment.schema).insertMany(appointments);
    if (prescriptions.length) await atlasConn.model('Prescription', Prescription.schema).insertMany(prescriptions);
    if (records.length) await atlasConn.model('HealthRecord', HealthRecord.schema).insertMany(records);
    if (reviews.length) await atlasConn.model('Review', Review.schema).insertMany(reviews);

    console.log('🎉 Migration Complete!');
    await atlasConn.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Failed:', err);
    process.exit(1);
  }
};

migrate();
