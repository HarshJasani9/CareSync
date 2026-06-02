'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-surface-muted flex flex-col font-sans selection:bg-primary-500 selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">Care<span className="text-primary-600">Sync</span></span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8 font-medium">
              <Link href="/#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</Link>
              <Link href="/how-it-works" className="text-primary-600 font-semibold transition-colors">How it Works</Link>
              <Link href="/#doctors" className="text-gray-600 hover:text-primary-600 transition-colors">For Doctors</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="hidden sm:block text-gray-900 font-semibold hover:text-primary-600 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
              </Link>
              <div className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-50/50"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-primary-700 text-sm font-semibold mb-6 shadow-sm border border-primary-100">
            Simple, Transparent, Fast
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            How CareSync Works
          </h1>
          <p className="text-lg text-gray-600 text-balance leading-relaxed">
            Whether you're a patient looking for care or a doctor managing your practice, we've streamlined every step of the journey so you can focus on what matters most: Health.
          </p>
        </div>
      </section>

      {/* Patient Journey Section */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-2">The Patient Journey</h2>
            <div className="w-20 h-1.5 bg-primary-500 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard 
              number="01"
              title="Find a Specialist"
              description="Use our powerful search directory to filter doctors by specialty, consultation fee, and patient ratings."
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
            />
            <StepCard 
              number="02"
              title="Book an Appointment"
              description="View the doctor's real-time availability and select a time slot that works best for your schedule."
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
            />
            <StepCard 
              number="03"
              title="Share Health Records"
              description="Securely upload your past medical reports and share them directly with your doctor before the visit."
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
            />
            <StepCard 
              number="04"
              title="Get Digital Prescriptions"
              description="After your consultation, receive a legally compliant digital PDF prescription directly in your portal."
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />}
            />
          </div>
        </div>
      </section>

      {/* Doctor Journey Section */}
      <section className="py-20 lg:py-28 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-2">The Doctor Journey</h2>
            <div className="w-20 h-1.5 bg-blue-500 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard 
              number="01"
              title="Apply & Get Verified"
              description="Register and submit your credentials. Our admin team will verify your qualifications to ensure trust."
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
              color="text-blue-500"
              bgColor="bg-blue-50"
            />
            <StepCard 
              number="02"
              title="Set Your Schedule"
              description="Use our weekly availability builder to define exactly when you want to accept patient appointments."
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
              color="text-blue-500"
              bgColor="bg-blue-50"
            />
            <StepCard 
              number="03"
              title="Manage Requests"
              description="Review incoming patient booking requests. Confirm or reject them with a single click from your dashboard."
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />}
              color="text-blue-500"
              bgColor="bg-blue-50"
            />
            <StepCard 
              number="04"
              title="Write Prescriptions"
              description="Use our intuitive form to prescribe medicines. We'll automatically generate a branded PDF and email it."
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />}
              color="text-blue-500"
              bgColor="bg-blue-50"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900/20"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-30"></div>
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl font-black text-white mb-6">Experience the process firsthand.</h2>
          <p className="text-xl text-gray-300 mb-10">Sign up today and take control of your healthcare journey in minutes.</p>
          
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white font-bold rounded-2xl hover:bg-primary-400 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-1 transition-all duration-300"
          >
            Get Started Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">Care<span className="text-primary-600">Sync</span></span>
          </div>
          <p className="text-gray-500 font-medium text-sm">© 2026 CareSync Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ number, title, description, icon, color = "text-primary-600", bgColor = "bg-primary-50" }) {
  return (
    <div className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-6 right-6 text-6xl font-black text-gray-50 group-hover:text-gray-100 transition-colors pointer-events-none select-none z-0">
        {number}
      </div>
      <div className={`relative z-10 w-14 h-14 rounded-2xl ${bgColor} ${color} flex items-center justify-center mb-6`}>
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="relative z-10 text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="relative z-10 text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
