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
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-500 mt-1">Review and manage new doctor applications</p>
      </div>

      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {doctors.map(doctor => (
            <div key={doctor._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-gray-600">{doctor.user?.name?.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">Dr. {doctor.user?.name}</h3>
                  <p className="text-sm font-medium text-primary-600 truncate">{doctor.specialization}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{doctor.user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl text-sm border border-gray-100 flex-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience:</span>
                  <span className="font-medium text-gray-900">{doctor.experience} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Consultation Fee:</span>
                  <span className="font-medium text-gray-900">₹{doctor.consultationFee}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Qualifications:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.qualifications?.length > 0 ? doctor.qualifications.map(q => (
                      <span key={q} className="bg-white border border-gray-200 text-xs font-semibold px-2 py-0.5 rounded text-gray-700">
                        {q}
                      </span>
                    )) : <span className="text-xs italic text-gray-400">None provided</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                  onClick={() => handleAction(doctor._id, 'reject')}
                  className="py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(doctor._id, 'approve')}
                  className="py-2 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-100"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">You're all caught up!</h3>
          <p className="text-gray-500">There are no pending doctor applications to review at this time.</p>
        </div>
      )}
    </div>
  );
}
