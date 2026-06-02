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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
        <p className="text-gray-500">Search and book appointments with verified specialists</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-72 shrink-0 space-y-6">
          {/* Search by name */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Doctor's name..."
                value={searchName}
                onChange={(e) => { setSearchName(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <select
                value={specialization}
                onChange={(e) => { setSpecialization(e.target.value); setPage(1); }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              >
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Max Fee</label>
                <span className="text-sm font-semibold text-primary-600">₹{maxFee}{maxFee === 2000 ? '+' : ''}</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <div className="flex gap-2">
                {[4, 3, 0].map(rating => (
                  <button
                    key={rating}
                    onClick={() => { setMinRating(rating); setPage(1); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors flex items-center justify-center gap-1 ${
                      minRating === rating ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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
                  <div key={doctor._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col hover:border-primary-200 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden shrink-0">
                        {doctor.user?.avatar ? (
                          <img src={doctor.user.avatar} alt={doctor.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-700 font-bold text-xl">
                            {doctor.user?.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">Dr. {doctor.user?.name}</h3>
                        <p className="text-sm text-primary-600 font-medium">{doctor.specialization}</p>
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          <span className="font-semibold text-gray-900">{doctor.rating > 0 ? doctor.rating.toFixed(1) : 'New'}</span>
                          <span className="text-gray-400">({doctor.totalReviews})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Experience</p>
                        <p className="font-medium text-gray-900">{doctor.experience} Years</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Consultation</p>
                        <p className="font-medium text-gray-900">₹{doctor.consultationFee}</p>
                      </div>
                    </div>

                    <Link href={`/doctors/${doctor._id}`} className="mt-auto block w-full py-2.5 bg-primary-50 text-primary-700 font-semibold rounded-xl text-center hover:bg-primary-100 transition-colors">
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
             <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
               <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <h3 className="text-lg font-medium text-gray-900 mb-1">No doctors found</h3>
               <p className="text-gray-500">Try adjusting your filters to find more results.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
