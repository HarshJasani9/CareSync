'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Menu } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/90 dark:bg-gray-950/90 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 h-12 md:h-14 flex items-center justify-between">
        {/* LEFT — Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Heart size={18} className="text-primary-600 fill-primary-600" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">CareSync</span>
        </Link>

        {/* RIGHT — Actions */}
        <div className="flex items-center gap-3">
          <Link 
            href="/register" 
            className="hidden md:block text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            For doctors
          </Link>
          <ThemeToggle />
          <Link 
            href="/login" 
            className="text-xs px-3 py-1.5 md:text-sm md:px-4 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Log in
          </Link>
          <Link 
            href="/register" 
            className="text-xs px-3 py-1.5 md:text-sm md:px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Get started
          </Link>
          <button 
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute top-12 left-0 right-0 w-full bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex flex-col gap-3 z-50 md:hidden shadow-lg">
          <Link 
            href="/register" 
            onClick={() => setIsOpen(false)} 
            className="text-sm text-gray-700 dark:text-gray-300 py-1"
          >
            For doctors
          </Link>
          <div className="h-px bg-gray-100 dark:bg-gray-800 w-full my-1"></div>
          <Link 
            href="/login" 
            onClick={() => setIsOpen(false)} 
            className="text-sm text-gray-700 dark:text-gray-300 py-1"
          >
            Log in
          </Link>
          <Link 
            href="/register" 
            onClick={() => setIsOpen(false)} 
            className="text-sm text-gray-700 dark:text-gray-300 py-1"
          >
            Get started
          </Link>
        </div>
      )}
    </nav>
  );
}
