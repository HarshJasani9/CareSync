'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Search, MapPin, Star, Clock, Filter, ChevronRight } from 'lucide-react';

const SPECIALIZATIONS = [
  'All',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'General Medicine',
];

export default function PublicDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpec, setActiveSpec] = useState('All');

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const params = { limit: 20 }; // Fetch top 20 for public view for now
        if (searchQuery) params.name = searchQuery;
        if (activeSpec !== 'All') params.specialization = activeSpec;

        const res = await api.get('/doctors', { params });
        setDoctors(res.data.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchDoctors, 400);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeSpec]);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="pt-16 pb-12 px-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight">
            Find the right <span className="text-primary-600">doctor</span> for you.
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Book appointments with verified specialists, read genuine patient reviews, and manage your health seamlessly.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex items-center bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all p-1.5">
            <div className="pl-4 pr-2">
              <Search className="text-gray-400" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search by doctor's name..."
              className="w-full py-3 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Categories / Filters Pills */}
        <div className="flex items-center overflow-x-auto pb-4 mb-6 no-scrollbar border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white mr-2 whitespace-nowrap">Specialties:</span>
            {SPECIALIZATIONS.map(spec => (
              <button
                key={spec}
                onClick={() => setActiveSpec(spec)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSpec === spec 
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-800'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map(doctor => (
              <div key={doctor._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group">
                {/* Card Header (Avatar + Basic Info) */}
                <div className="p-6 flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden flex-shrink-0 border border-primary-100 dark:border-primary-900/50">
                      {doctor.user?.avatar ? (
                        <img src={doctor.user.avatar} alt={doctor.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                          {doctor.user?.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          Dr. {doctor.user?.name?.replace(/^Dr\.?\s*/i, '')}
                        </h3>
                        <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-3">
                          {doctor.specialization}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Star size={14} className={doctor.rating > 0 ? "fill-amber-500 text-amber-500" : "text-gray-300"} />
                          <span className={doctor.rating > 0 ? "text-gray-900 dark:text-white font-semibold" : ""}>
                            {doctor.rating > 0 ? doctor.rating.toFixed(1) : 'New'}
                          </span>
                          {doctor.rating > 0 && <span className="text-gray-400">({doctor.totalReviews})</span>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-gray-400" />
                          <span>{doctor.experience} Yrs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer (Details) */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Consultation</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">₹{doctor.consultationFee}</p>
                  </div>
                  <Link 
                    href={`/doctors/${doctor._id}`} 
                    className="inline-flex items-center justify-center bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 hover:border-primary-600 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 text-gray-900 dark:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border border-gray-200 dark:border-gray-800 shadow-sm mt-4">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No specialists found</h3>
            <p className="text-gray-500">We couldn&apos;t find any doctors matching your current filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveSpec('All'); }}
              className="mt-6 text-primary-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
