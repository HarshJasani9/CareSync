/**
 * CareSync Database Seeder
 * 
 * Seeds the database with sample patients and verified doctors
 * so the app looks populated and demo-ready.
 *
 * Usage:
 *   node seed.js          — Insert seed data
 *   node seed.js --clear  — Remove all seeded data (by email pattern)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const MONGO_URI = process.env.MONGO_URI;

// ─── Common password for all seed accounts ──────────────────────
const SEED_PASSWORD = 'Test@123';

// ─── Sample Patients ────────────────────────────────────────────
const patients = [
  {
    name: 'Aarav Mehta',
    email: 'aarav.mehta@demo.com',
    phone: '9876543210',
    dateOfBirth: new Date('1998-03-15'),
    bloodGroup: 'B+',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Aarav',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@demo.com',
    phone: '9876543211',
    dateOfBirth: new Date('1995-07-22'),
    bloodGroup: 'O+',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Priya',
  },
  {
    name: 'Rohan Gupta',
    email: 'rohan.gupta@demo.com',
    phone: '9876543212',
    dateOfBirth: new Date('2000-11-08'),
    bloodGroup: 'A+',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Rohan',
  },
  {
    name: 'Ananya Reddy',
    email: 'ananya.reddy@demo.com',
    phone: '9876543213',
    dateOfBirth: new Date('1992-01-30'),
    bloodGroup: 'AB+',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Ananya',
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@demo.com',
    phone: '9876543214',
    dateOfBirth: new Date('1988-06-12'),
    bloodGroup: 'O-',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Vikram',
  },
];

// ─── Sample Doctors ─────────────────────────────────────────────
const doctors = [
  {
    user: {
      name: 'Neha Kapoor',
      email: 'neha.kapoor@demo.com',
      phone: '9988776601',
      avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Neha',
    },
    profile: {
      specialization: 'Cardiology',
      qualifications: ['MBBS', 'MD Cardiology', 'FACC'],
      experience: 12,
      consultationFee: 1500,
      bio: 'Experienced cardiologist specializing in preventive cardiology and heart failure management. Passionate about patient education and lifestyle modification for heart health.',
      rating: 4.8,
      totalReviews: 47,
      availableSlots: [
        { day: 'Mon', startTime: '09:00', endTime: '13:00' },
        { day: 'Mon', startTime: '15:00', endTime: '18:00' },
        { day: 'Wed', startTime: '09:00', endTime: '14:00' },
        { day: 'Fri', startTime: '10:00', endTime: '16:00' },
      ],
    },
  },
  {
    user: {
      name: 'Rajesh Iyer',
      email: 'rajesh.iyer@demo.com',
      phone: '9988776602',
      avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Rajesh',
    },
    profile: {
      specialization: 'Orthopedics',
      qualifications: ['MBBS', 'MS Orthopedics', 'DNB'],
      experience: 15,
      consultationFee: 1200,
      bio: 'Senior orthopedic surgeon with expertise in joint replacement and sports injury rehabilitation. Over 3000+ successful surgeries performed.',
      rating: 4.6,
      totalReviews: 83,
      availableSlots: [
        { day: 'Tue', startTime: '08:00', endTime: '12:00' },
        { day: 'Thu', startTime: '08:00', endTime: '12:00' },
        { day: 'Sat', startTime: '09:00', endTime: '13:00' },
      ],
    },
  },
  {
    user: {
      name: 'Sanya Patel',
      email: 'sanya.patel@demo.com',
      phone: '9988776603',
      avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Sanya',
    },
    profile: {
      specialization: 'Dermatology',
      qualifications: ['MBBS', 'MD Dermatology'],
      experience: 8,
      consultationFee: 800,
      bio: 'Dermatologist focused on acne management, cosmetic procedures, and skin cancer screening. Dedicated to evidence-based skincare solutions.',
      rating: 4.9,
      totalReviews: 112,
      availableSlots: [
        { day: 'Mon', startTime: '10:00', endTime: '17:00' },
        { day: 'Tue', startTime: '10:00', endTime: '17:00' },
        { day: 'Wed', startTime: '10:00', endTime: '13:00' },
        { day: 'Thu', startTime: '14:00', endTime: '18:00' },
        { day: 'Fri', startTime: '10:00', endTime: '17:00' },
      ],
    },
  },
  {
    user: {
      name: 'Arjun Nair',
      email: 'arjun.nair@demo.com',
      phone: '9988776604',
      avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Arjun',
    },
    profile: {
      specialization: 'Pediatrics',
      qualifications: ['MBBS', 'DCH', 'MD Pediatrics'],
      experience: 10,
      consultationFee: 700,
      bio: 'Compassionate pediatrician with a decade of experience in child healthcare, immunization, and developmental assessment. Makes every child feel at ease.',
      rating: 4.7,
      totalReviews: 65,
      availableSlots: [
        { day: 'Mon', startTime: '09:00', endTime: '14:00' },
        { day: 'Wed', startTime: '09:00', endTime: '14:00' },
        { day: 'Thu', startTime: '09:00', endTime: '14:00' },
        { day: 'Sat', startTime: '10:00', endTime: '13:00' },
      ],
    },
  },
  {
    user: {
      name: 'Meera Joshi',
      email: 'meera.joshi@demo.com',
      phone: '9988776605',
      avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Meera',
    },
    profile: {
      specialization: 'Psychiatry',
      qualifications: ['MBBS', 'MD Psychiatry', 'DPM'],
      experience: 7,
      consultationFee: 1000,
      bio: 'Mental health advocate specializing in anxiety disorders, depression, and cognitive behavioral therapy. Believes in a holistic approach to mental wellness.',
      rating: 4.5,
      totalReviews: 38,
      availableSlots: [
        { day: 'Tue', startTime: '11:00', endTime: '18:00' },
        { day: 'Wed', startTime: '11:00', endTime: '18:00' },
        { day: 'Fri', startTime: '11:00', endTime: '16:00' },
      ],
    },
  },
  {
    user: {
      name: 'Karan Malhotra',
      email: 'karan.malhotra@demo.com',
      phone: '9988776606',
      avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Karan',
    },
    profile: {
      specialization: 'General Practice',
      qualifications: ['MBBS', 'FCGP'],
      experience: 20,
      consultationFee: 500,
      bio: 'Family medicine specialist with 20 years of experience. Your first point of contact for all health concerns — from routine check-ups to chronic disease management.',
      rating: 4.4,
      totalReviews: 210,
      availableSlots: [
        { day: 'Mon', startTime: '08:00', endTime: '18:00' },
        { day: 'Tue', startTime: '08:00', endTime: '18:00' },
        { day: 'Wed', startTime: '08:00', endTime: '18:00' },
        { day: 'Thu', startTime: '08:00', endTime: '18:00' },
        { day: 'Fri', startTime: '08:00', endTime: '18:00' },
        { day: 'Sat', startTime: '09:00', endTime: '13:00' },
      ],
    },
  },
  {
    user: {
      name: 'Ishita Banerjee',
      email: 'ishita.banerjee@demo.com',
      phone: '9988776607',
      avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Ishita',
    },
    profile: {
      specialization: 'Neurology',
      qualifications: ['MBBS', 'DM Neurology'],
      experience: 9,
      consultationFee: 1800,
      bio: 'Neurologist with expertise in epilepsy, stroke management, and neurodegenerative disorders. Committed to improving quality of life through precise diagnoses.',
      rating: 4.3,
      totalReviews: 29,
      availableSlots: [
        { day: 'Mon', startTime: '10:00', endTime: '15:00' },
        { day: 'Thu', startTime: '10:00', endTime: '15:00' },
        { day: 'Fri', startTime: '10:00', endTime: '15:00' },
      ],
    },
  },
  {
    user: {
      name: 'Aditya Verma',
      email: 'aditya.verma@demo.com',
      phone: '9988776608',
      avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Aditya',
    },
    profile: {
      specialization: 'Gastroenterology',
      qualifications: ['MBBS', 'MD Internal Medicine', 'DM Gastroenterology'],
      experience: 11,
      consultationFee: 1400,
      bio: 'Gastroenterologist specializing in liver diseases, endoscopy, and inflammatory bowel disorders. Focused on minimally invasive diagnostic procedures.',
      rating: 4.6,
      totalReviews: 54,
      availableSlots: [
        { day: 'Tue', startTime: '09:00', endTime: '14:00' },
        { day: 'Wed', startTime: '14:00', endTime: '19:00' },
        { day: 'Sat', startTime: '09:00', endTime: '14:00' },
      ],
    },
  },
];

// ─── Seed Function ──────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected for seeding\n');

    // ── Seed Patients ──────────────────────────────────────────
    console.log('🏥 Seeding patients...');
    for (const p of patients) {
      const exists = await User.findOne({ email: p.email });
      if (exists) {
        console.log(`   ⏭  Skipped (exists): ${p.name}`);
        continue;
      }

      await User.create({
        ...p,
        role: 'patient',
        password: SEED_PASSWORD,
        isVerified: true,
      });
      console.log(`   ✅ Created patient: ${p.name}`);
    }

    // ── Seed Doctors ───────────────────────────────────────────
    console.log('\n👨‍⚕️ Seeding doctors...');
    for (const d of doctors) {
      const exists = await User.findOne({ email: d.user.email });
      if (exists) {
        console.log(`   ⏭  Skipped (exists): ${d.user.name}`);
        continue;
      }

      // Create user account
      const user = await User.create({
        ...d.user,
        role: 'doctor',
        password: SEED_PASSWORD,
        isVerified: true,
      });

      // Create doctor profile (auto-verified)
      await Doctor.create({
        user: user._id,
        ...d.profile,
        status: 'verified',
      });

      console.log(`   ✅ Created doctor: Dr. ${d.user.name} (${d.profile.specialization})`);
    }

    console.log('\n🎉 Seeding complete!');
    console.log(`\n📋 Login credentials for all seed accounts:`);
    console.log(`   Email:    <name>@demo.com (see list above)`);
    console.log(`   Password: ${SEED_PASSWORD}\n`);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// ─── Clear Function ─────────────────────────────────────────────
const clearSeededData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Collect all seeded user emails
    const seededEmails = [
      ...patients.map((p) => p.email),
      ...doctors.map((d) => d.user.email),
    ];

    // Find users
    const users = await User.find({ email: { $in: seededEmails } });
    const userIds = users.map((u) => u._id);

    // Remove doctor profiles linked to seeded users
    const docResult = await Doctor.deleteMany({ user: { $in: userIds } });
    console.log(`🗑  Removed ${docResult.deletedCount} doctor profiles`);

    // Remove user accounts
    const userResult = await User.deleteMany({ email: { $in: seededEmails } });
    console.log(`🗑  Removed ${userResult.deletedCount} user accounts`);

    console.log('\n✅ Seed data cleared!');
  } catch (error) {
    console.error('❌ Clear error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// ─── Run ────────────────────────────────────────────────────────
if (process.argv.includes('--clear')) {
  clearSeededData();
} else {
  seedDatabase();
}
