import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function DoctorCTA() {
  return (
    <section className="py-14 border-t border-gray-100 dark:border-gray-800">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* LEFT SIDE */}
        <div className="max-w-md">
          <div className="inline-block mb-4 text-xs font-medium bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200 rounded-full px-3 py-1">
            For doctors
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            Are you a specialist? Join CareSync.
          </h2>
          
          <p className="text-sm text-gray-500 leading-relaxed">
            Set your own hours, manage your schedule, write digital prescriptions, and build a verified review profile — all without the admin overhead.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
          <Link 
            href="/doctors" 
            className="inline-flex items-center gap-2 bg-primary-600 text-white text-sm font-medium rounded-lg px-5 py-2.5 hover:bg-primary-700 transition-colors"
          >
            Apply as a doctor
            <ArrowRight size={15} />
          </Link>
          
          <span className="text-xs text-gray-400">
            Applications reviewed within 48 hours
          </span>
        </div>
        
      </div>
    </section>
  );
}
