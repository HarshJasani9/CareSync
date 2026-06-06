import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 border-t border-gray-100 dark:border-gray-800 text-center">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
        Your health, better managed.
      </h2>
      
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
        Join thousands of patients who've switched from phone calls and paper slips to something that actually works.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link 
          href="/doctors" 
          className="inline-flex items-center gap-2 bg-primary-600 text-white text-sm font-medium rounded-lg px-6 py-3 hover:bg-primary-700 transition-colors"
        >
          Get started free
          <ArrowRight size={15} />
        </Link>

        <Link 
          href="mailto:hello@caresync.in" 
          className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-lg px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          Talk to us
        </Link>
      </div>
    </section>
  );
}
