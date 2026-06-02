'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

// ─── ZOD SCHEMAS ─────────────────────────────────────────────
const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Practice',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Urology',
];

const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  specialization: z.string().min(1, 'Please select a specialization'),
  experience: z.coerce.number().min(0, 'Experience cannot be negative'),
  consultationFee: z.coerce.number().min(0, 'Fee cannot be negative'),
  qualifications: z.string().optional(),
});

const ROLE_DASHBOARDS = {
  patient: '/dashboard',
  doctor: '/doctor/dashboard',
  admin: '/admin/dashboard',
};

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [step, setStep] = useState(1); // 1 = role select, 2 = form
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Patient form
  const patientForm = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: { name: '', email: '', password: '', phone: '' },
  });

  // Doctor form
  const doctorForm = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      specialization: '',
      experience: '',
      consultationFee: '',
      qualifications: '',
    },
  });

  const activeForm = selectedRole === 'doctor' ? doctorForm : patientForm;

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        role: selectedRole,
      };

      // Convert qualifications string to array
      if (selectedRole === 'doctor' && data.qualifications) {
        payload.qualifications = data.qualifications
          .split(',')
          .map((q) => q.trim())
          .filter(Boolean);
      }

      const res = await api.post('/auth/register', payload);
      const { user, token } = res.data;

      if (selectedRole === 'patient') {
        setAuth(user, token);
        toast.success('Account created! Welcome to CareSync.');
        router.push(ROLE_DASHBOARDS.patient);
      } else {
        // Doctor registration — pending approval
        toast.success('Registration successful! Your application is under review by admin.', {
          duration: 5000,
        });
        router.push('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-primary-900">CareSync</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* ─── STEP 1: ROLE SELECTION ─── */}
          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
              <p className="text-gray-500 mb-8">How would you like to use CareSync?</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Patient Card */}
                <button
                  id="role-patient"
                  onClick={() => handleRoleSelect('patient')}
                  className="group border-2 border-gray-100 hover:border-primary-500 rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                    <svg className="w-6 h-6 text-primary-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Patient</h3>
                  <p className="text-xs text-gray-500">Book appointments, view prescriptions & records</p>
                </button>

                {/* Doctor Card */}
                <button
                  id="role-doctor"
                  onClick={() => handleRoleSelect('doctor')}
                  className="group border-2 border-gray-100 hover:border-primary-500 rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                    <svg className="w-6 h-6 text-primary-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Doctor</h3>
                  <p className="text-xs text-gray-500">Manage patients, write prescriptions & more</p>
                </button>
              </div>
            </>
          )}

          {/* ─── STEP 2: REGISTRATION FORM ─── */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => { setStep(1); setSelectedRole(null); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedRole === 'patient' ? 'Patient Registration' : 'Doctor Registration'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {selectedRole === 'doctor'
                      ? 'Your profile will be reviewed by admin before activation'
                      : 'Fill in your details to get started'}
                  </p>
                </div>
              </div>

              <form onSubmit={activeForm.handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-xl border bg-surface-muted text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                      activeForm.formState.errors.name ? 'border-red-400' : 'border-gray-200'
                    }`}
                    {...activeForm.register('name')}
                  />
                  {activeForm.formState.errors.name && (
                    <p className="mt-1 text-xs text-red-500">{activeForm.formState.errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-xl border bg-surface-muted text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                      activeForm.formState.errors.email ? 'border-red-400' : 'border-gray-200'
                    }`}
                    {...activeForm.register('email')}
                  />
                  {activeForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-500">{activeForm.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="Min. 6 characters"
                    className={`w-full px-4 py-3 rounded-xl border bg-surface-muted text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                      activeForm.formState.errors.password ? 'border-red-400' : 'border-gray-200'
                    }`}
                    {...activeForm.register('password')}
                  />
                  {activeForm.formState.errors.password && (
                    <p className="mt-1 text-xs text-red-500">{activeForm.formState.errors.password.message}</p>
                  )}
                </div>

                {/* ─── PATIENT-SPECIFIC FIELDS ─── */}
                {selectedRole === 'patient' && (
                  <div>
                    <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-surface-muted text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      {...patientForm.register('phone')}
                    />
                  </div>
                )}

                {/* ─── DOCTOR-SPECIFIC FIELDS ─── */}
                {selectedRole === 'doctor' && (
                  <>
                    {/* Specialization */}
                    <div>
                      <label htmlFor="reg-specialization" className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
                      <select
                        id="reg-specialization"
                        className={`w-full px-4 py-3 rounded-xl border bg-surface-muted text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                          doctorForm.formState.errors.specialization ? 'border-red-400' : 'border-gray-200'
                        }`}
                        {...doctorForm.register('specialization')}
                      >
                        <option value="">Select specialization</option>
                        {SPECIALIZATIONS.map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                      {doctorForm.formState.errors.specialization && (
                        <p className="mt-1 text-xs text-red-500">{doctorForm.formState.errors.specialization.message}</p>
                      )}
                    </div>

                    {/* Experience + Fee */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="reg-experience" className="block text-sm font-medium text-gray-700 mb-1.5">Experience (years)</label>
                        <input
                          id="reg-experience"
                          type="number"
                          min="0"
                          placeholder="5"
                          className={`w-full px-4 py-3 rounded-xl border bg-surface-muted text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                            doctorForm.formState.errors.experience ? 'border-red-400' : 'border-gray-200'
                          }`}
                          {...doctorForm.register('experience')}
                        />
                        {doctorForm.formState.errors.experience && (
                          <p className="mt-1 text-xs text-red-500">{doctorForm.formState.errors.experience.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="reg-fee" className="block text-sm font-medium text-gray-700 mb-1.5">Fee (₹)</label>
                        <input
                          id="reg-fee"
                          type="number"
                          min="0"
                          placeholder="500"
                          className={`w-full px-4 py-3 rounded-xl border bg-surface-muted text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                            doctorForm.formState.errors.consultationFee ? 'border-red-400' : 'border-gray-200'
                          }`}
                          {...doctorForm.register('consultationFee')}
                        />
                        {doctorForm.formState.errors.consultationFee && (
                          <p className="mt-1 text-xs text-red-500">{doctorForm.formState.errors.consultationFee.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Qualifications */}
                    <div>
                      <label htmlFor="reg-qualifications" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Qualifications <span className="text-gray-400">(comma-separated)</span>
                      </label>
                      <input
                        id="reg-qualifications"
                        type="text"
                        placeholder="MBBS, MD, FRCS"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-surface-muted text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        {...doctorForm.register('qualifications')}
                      />
                    </div>
                  </>
                )}

                {/* Submit */}
                <button
                  id="register-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : selectedRole === 'doctor' ? (
                    'Submit for Review'
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
