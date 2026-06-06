'use client';

import Link from 'next/link';
import { ArrowRight, Star, FileText, Download } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-10 pb-8 md:pt-16 md:pb-12">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10">
        
        {/* LEFT COLUMN */}
        <div className="max-w-lg">
          {/* Tag pill */}
          <div className="inline-block text-xs uppercase tracking-wide bg-primary-50 text-primary-900 border border-primary-100 rounded-full px-3 py-1">
            Now in India · 2,000+ verified doctors
          </div>

          {/* Headline */}
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-white">
            Healthcare that<br />
            fits your <span className="text-primary-600">schedule.</span>
          </h1>

          {/* Teal divider */}
          <div className="mt-4 mb-5 w-8 h-0.5 bg-primary-500 rounded-full" />

          {/* Subtext */}
          <p className="text-gray-500 text-base leading-relaxed max-w-full md:max-w-sm">
            Book appointments, receive digital prescriptions, and manage your health records — all in one place. No waiting rooms, no lost paperwork.
          </p>

          {/* CTA row */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link 
              href="/doctors" 
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-primary-600 text-white text-sm font-medium rounded-lg px-6 py-3 hover:bg-primary-700 transition-colors"
            >
              Find a doctor
              <ArrowRight size={15} />
            </Link>
            
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center w-full sm:w-auto border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-lg px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              See how it works
            </button>
          </div>

          {/* Social proof row */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex">
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center text-xs font-medium bg-primary-50 text-primary-900">
                RK
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center text-xs font-medium -ml-2 bg-blue-50 text-blue-900">
                PM
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center text-xs font-medium -ml-2 bg-amber-50 text-amber-900">
                SJ
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center text-xs font-medium -ml-2 bg-pink-50 text-pink-900">
                +2k
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#BA7517" stroke="none" />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Trusted by 2,000+ patients</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-3 w-full md:max-w-xs">
          
          {/* CARD 1 — Appointment card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Your next appointment
              </span>
              <span className="text-[10px] bg-primary-50 text-primary-900 rounded-full px-2 py-0.5">
                ✓ Confirmed
              </span>
            </div>

            {/* Doctor row */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-900 text-sm font-medium flex items-center justify-center flex-shrink-0">
                DR
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Dr. Reema Shah</p>
                <p className="text-xs text-gray-500">Cardiologist · Apollo</p>
              </div>
            </div>

            {/* Details row */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-5">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Date</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white mt-0.5">Thu, 12 Jun</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Time</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white mt-0.5">10:30 AM</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Mode</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white mt-0.5">In-person</span>
              </div>
            </div>
          </div>

          {/* CARD 2 — Prescription card */}
          <div className="hidden md:flex bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 items-center gap-3">
            {/* Icon box */}
            <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-primary-600" />
            </div>

            {/* Text block */}
            <div>
              <p className="text-xs font-medium text-gray-800 dark:text-gray-200">New prescription ready</p>
              <p className="text-[11px] text-gray-500">PDF ready to download</p>
            </div>

            {/* Download icon */}
            <Download size={15} className="text-gray-400 ml-auto" />
          </div>

        </div>

      </div>
    </section>
  );
}
