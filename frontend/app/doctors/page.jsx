'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

const SPECIALIZATIONS = [
  'All',
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

export default function DoctorsSearchPage() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchName, setSearchName] = useState('');
  const [specialization, setSpecialization] = useState('All');
  const [maxFee, setMaxFee] = useState(2000);
  const [minRating, setMinRating] = useState(0);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const params = { page, limit };
        if (searchName) params.name = searchName;
        if (specialization !== 'All') params.specialization = specialization;
        if (maxFee < 2000) params.maxFee = maxFee;
        if (minRating > 0) params.minRating = minRating;

        const res = await api.get('/doctors', { params });
        setDoctors(res.data.data);
        setTotalPages(Math.ceil(res.data.total / limit));
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search slightly
    const timeoutId = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(timeoutId);
  }, [searchName, specialization, maxFee, minRating, page]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Find a Doctor</h1>
        <p className="text-gray-500 dark:text-gray-400">Search and book appointments with verified specialists</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Search by name */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border-0 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Search by Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Doctor's name..."
                value={searchName}
                onChange={(e) => { setSearchName(e.target.value); setPage(1); }}
                className="w-full pl-12 pr-4 py-3 rounded-[1rem] border-0 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border-0 shadow-sm space-y-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Specialization</label>
              <select
                value={specialization}
                onChange={(e) => { setSpecialization(e.target.value); setPage(1); }}
                className="w-full px-4 py-3 rounded-[1rem] border-0 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              >
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Max Fee</label>
                <span className="text-sm font-black text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">₹{maxFee}{maxFee === 2000 ? '+' : ''}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="100"
                value={maxFee}
                onChange={(e) => { setMaxFee(Number(e.target.value)); setPage(1); }}
                className="w-full accent-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Minimum Rating</label>
              <div className="flex gap-2">
                {[4, 3, 0].map(rating => (
                  <button
                    key={rating}
                    onClick={() => { setMinRating(rating); setPage(1); }}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-[1rem] transition-all flex items-center justify-center gap-1.5 ${
                      minRating === rating ? 'bg-primary-500 text-white shadow-md' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {rating > 0 ? <>{rating}+ <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></> : 'Any'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
          ) : doctors.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {doctors.map(doctor => (
                  <div key={doctor._id} className="bg-white dark:bg-gray-900 rounded-[2rem] border-0 shadow-sm p-8 flex flex-col hover:shadow-md transition-all group">
                    <div className="flex items-start gap-5 mb-6">
                      <div className="w-16 h-16 rounded-[1.2rem] bg-primary-100 dark:bg-primary-900/50 overflow-hidden shrink-0 flex items-center justify-center border border-primary-200 dark:border-primary-800/50">
                        {doctor.user?.avatar ? (
                          <img src={doctor.user.avatar} alt={doctor.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary-700 dark:text-primary-400 font-bold text-2xl">
                            {doctor.user?.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1 group-hover:text-primary-500 transition-colors">Dr. {doctor.user?.name}</h3>
                        <p className="text-sm text-primary-600 dark:text-primary-400 font-bold mt-0.5">{doctor.specialization}</p>
                        <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-lg w-fit">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          <span className="font-bold text-gray-900 dark:text-white">{doctor.rating > 0 ? doctor.rating.toFixed(1) : 'New'}</span>
                          <span className="text-gray-500 dark:text-gray-500 font-medium">({doctor.totalReviews})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-[1rem]">
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Experience</p>
                        <p className="font-bold text-gray-900 dark:text-white">{doctor.experience} Years</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-[1rem]">
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Consultation</p>
                        <p className="font-bold text-gray-900 dark:text-white">₹{doctor.consultationFee}</p>
                      </div>
                    </div>

                    <Link href={`/doctors/${doctor._id}`} className="mt-auto block w-full py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-bold rounded-[1.5rem] text-center hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
                      Book Appointment
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10 gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border text-sm font-medium disabled:opacity-50">Prev</button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-primary-500 text-white' : 'border hover:bg-gray-50'}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg border text-sm font-medium disabled:opacity-50">Next</button>
                </div>
              )}
            </>
          ) : (
             <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[2rem] border-0 shadow-sm flex flex-col items-center">
               <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No doctors found</h3>
               <p className="text-gray-500 dark:text-gray-400 font-medium">Try adjusting your filters to find more results.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
