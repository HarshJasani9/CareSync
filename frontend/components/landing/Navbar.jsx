import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/90 dark:bg-gray-950/90 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* LEFT — Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Heart size={18} className="text-primary-600 fill-primary-600" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">CareSync</span>
        </Link>

        {/* RIGHT — Actions */}
        <div className="flex items-center gap-3">
          <Link 
            href="/doctors" 
            className="hidden md:block text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            For doctors
          </Link>
          <Link 
            href="/doctors" 
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Log in
          </Link>
          <Link 
            href="/doctors" 
            className="text-sm bg-primary-600 text-white rounded-lg px-4 py-1.5 hover:bg-primary-700 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
