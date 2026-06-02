'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-muted dark:bg-gray-950 flex flex-col font-sans selection:bg-primary-500 selection:text-white transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Care<span className="text-primary-600 dark:text-primary-500">Sync</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 font-medium">
              <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</Link>
              <Link href="/how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">How it Works</Link>
              <Link href="#doctors" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">For Doctors</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="hidden sm:block text-gray-900 dark:text-white font-semibold hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-black dark:hover:bg-gray-100 hover:shadow-xl hover:shadow-gray-900/20 dark:hover:shadow-white/10 hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
              </Link>
              <div className="pl-4 border-l border-gray-200 dark:border-gray-800 ml-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold mb-6 border border-primary-100 dark:border-primary-800 transition-colors">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                The Future of Healthcare Management
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight text-balance transition-colors">
                Healthcare that revolves around <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 dark:from-primary-400 dark:to-blue-400">you.</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl leading-relaxed text-balance transition-colors">
                CareSync connects you with top-rated specialists, secures your medical records, and delivers digital prescriptions directly to your device. Seamless, secure, and modern.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/register" 
                  className="px-8 py-4 bg-primary-500 text-white font-bold rounded-2xl hover:bg-primary-600 hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Find a Doctor
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link 
                  href="#features" 
                  className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex items-center gap-6 pt-10 border-t border-gray-200/60 dark:border-gray-800 transition-colors">
                <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-gray-950 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-sm font-bold shadow-sm overflow-hidden`}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=e5e7eb`} alt="User" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-950 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm z-10">
                    +2k
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">Trusted by thousands of patients</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 rounded-[3rem] -rotate-3 scale-105 opacity-50 z-0 transition-colors"></div>
              <img 
                src="/hero-illustration.png" 
                alt="CareSync 3D Medical Illustration" 
                className="relative z-10 w-full max-w-lg object-contain drop-shadow-2xl hover:scale-105 hover:rotate-2 transition-transform duration-700 ease-out"
              />
              
              {/* Floating Cards */}
              <div className="absolute top-10 -left-6 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 z-20 flex items-center gap-3 animate-float transition-colors">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Appointment Confirmed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dr. Sarah Jenkins • Tomorrow, 10:00 AM</p>
                </div>
              </div>
              
              <div className="absolute bottom-10 -right-6 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 z-20 flex items-center gap-3 animate-float animation-delay-2000 transition-colors">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">New Prescription</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF Ready to Download</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-primary-600 dark:text-primary-500 font-bold tracking-wide uppercase text-sm mb-3">Why Choose CareSync</h2>
            <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">Everything you need for seamless care</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">We've reimagined the healthcare experience to put you in control. No more waiting on hold or dealing with lost paper prescriptions.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />}
              title="Verified Specialists"
              description="Our rigorous vetting process ensures every doctor on CareSync is highly qualified, verified, and reviewed by real patients."
              color="text-blue-500 dark:text-blue-400"
              bgColor="bg-blue-50 dark:bg-blue-900/20"
            />
            <FeatureCard 
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
              title="Digital Prescriptions"
              description="Never lose a prescription again. Receive legally compliant, beautifully formatted PDF prescriptions directly to your account."
              color="text-primary-500 dark:text-primary-400"
              bgColor="bg-primary-50 dark:bg-primary-900/20"
            />
            <FeatureCard 
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
              title="Secure Health Vault"
              description="Upload your lab results and scans. Share them securely with your doctors, knowing your data is protected with enterprise-grade security."
              color="text-purple-500 dark:text-purple-400"
              bgColor="bg-purple-50 dark:bg-purple-900/20"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 dark:bg-black relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-primary-900/20 dark:bg-primary-900/10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to prioritize your health?</h2>
          <p className="text-xl text-gray-300 mb-10 text-balance">Join thousands of patients and doctors already experiencing the future of healthcare management.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-primary-500 text-white font-bold rounded-2xl hover:bg-primary-400 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              Join as a Patient
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              Apply as a Doctor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Care<span className="text-primary-600 dark:text-primary-500">Sync</span></span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">© 2026 CareSync Technologies. All rights reserved.</p>
        </div>
      </footer>

      {/* Custom Styles for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}

function FeatureCard({ icon, title, description, color, bgColor }) {
  return (
    <div className="group p-8 rounded-3xl bg-white dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 hover:border-primary-100 dark:hover:border-primary-900/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-2">
      <div className={`w-14 h-14 rounded-2xl ${bgColor} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}
