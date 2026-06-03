'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function PendingDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await api.get('/admin/doctors/pending');
      setDoctors(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch pending doctors');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    // Optimistic UI Update
    const prevDoctors = [...doctors];
    setDoctors(doctors.filter(d => d._id !== id));

    try {
      await api.patch(`/admin/doctors/${id}/approve`, { action });
      toast.success(`Doctor application ${action === 'approve' ? 'approved' : 'rejected'}`);
    } catch (error) {
      // Revert if error
      setDoctors(prevDoctors);
      toast.error(error.response?.data?.message || `Failed to ${action} doctor`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Approvals</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Review and manage new doctor applications</p>
      </div>

      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doctor => (
            <div key={doctor._id} className="bg-white dark:bg-gray-900 rounded-[2rem] border-0 shadow-sm hover:shadow-md dark:hover:shadow-none transition-all p-6 flex flex-col group">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0 border border-primary-100 dark:border-primary-800/50">
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{doctor.user?.name?.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">Dr. {doctor.user?.name}</h3>
                  <p className="text-sm font-medium text-primary-600 dark:text-primary-400 truncate">{doctor.specialization}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{doctor.user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-sm border border-gray-100 dark:border-gray-800 flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Experience</span>
                  <span className="font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-gray-700">{doctor.experience} Years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Consultation Fee</span>
                  <span className="font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-lg border border-green-100 dark:border-green-900/50">₹{doctor.consultationFee}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400 block mb-2 text-xs uppercase tracking-wide font-semibold">Qualifications</span>
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.qualifications?.length > 0 ? doctor.qualifications.map(q => (
                      <span key={q} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold px-2 py-0.5 rounded text-gray-700 dark:text-gray-300 shadow-sm">
                        {q}
                      </span>
                    )) : <span className="text-xs italic text-gray-400 dark:text-gray-500">None provided</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                  onClick={() => handleAction(doctor._id, 'reject')}
                  className="py-2.5 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors border border-red-100 dark:border-red-900/50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(doctor._id, 'approve')}
                  className="py-2.5 text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 rounded-xl transition-colors shadow-sm shadow-primary-500/20"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[2rem] border-0 shadow-sm flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-6">
             <svg className="w-10 h-10 text-primary-500 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're all caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">There are no pending doctor applications to review at this time. Great job staying on top of things!</p>
        </div>
      )}
    </div>
  );
}
