'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [appRes, profileRes] = await Promise.all([
        api.get('/appointments/my'),
        api.get('/auth/me')
      ]);
      setAppointments(appRes.data.data);
      const meData = profileRes.data.data;
      setDoctorProfile(meData.doctorProfile);
      setUserProfile(meData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const todaysAppointments = appointments.filter((a) => {
    const aptDate = new Date(a.date).toISOString().split('T')[0];
    return aptDate === todayStr && a.status === 'confirmed';
  });

  const pendingRequests = appointments.filter((a) => a.status === 'pending');
  
  // Calculate unique patients
  const uniquePatients = new Set(appointments.map(a => a.patient?._id)).size;

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {userProfile?.name}</h1>
        <p className="text-gray-500 mt-1">Here is what&apos;s happening with your practice today.</p>
        
        {doctorProfile && doctorProfile.status === 'verified' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Your account is verified. You can accept and manage patient appointments.
          </div>
        )}

        {doctorProfile && doctorProfile.status === 'pending' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            Your account is pending verification. You cannot accept appointments until an admin approves your profile.
          </div>
        )}

        {doctorProfile && doctorProfile.status === 'rejected' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            Your account has been rejected. Please contact support for more information.
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Today's Appointments" value={todaysAppointments.length} icon="📅" color="bg-blue-50 text-blue-600" />
        <StatCard title="Pending Requests" value={pendingRequests.length} icon="⏳" color="bg-orange-50 text-orange-600" />
        <StatCard title="Total Patients" value={uniquePatients} icon="👥" color="bg-purple-50 text-purple-600" />
        <StatCard title="Overall Rating" value={doctorProfile?.rating > 0 ? doctorProfile.rating.toFixed(1) : 'New'} icon="⭐" color="bg-yellow-50 text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Requests */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Pending Requests</h2>
          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map(req => (
                <div key={req._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                      {req.patient?.avatar ? (
                        <img src={req.patient.avatar} alt="P" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-700 font-bold text-sm">
                          {req.patient?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{req.patient?.name}</h3>
                      <p className="text-xs text-gray-500">{new Date(req.date).toLocaleDateString()} at {req.timeSlot}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg italic">
                    "{req.reason}"
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleStatusUpdate(req._id, 'confirmed')} disabled={doctorProfile?.status !== 'verified'} className="flex-1 py-2 text-xs font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors disabled:opacity-50">Confirm</button>
                    <button onClick={() => handleStatusUpdate(req._id, 'rejected')} disabled={doctorProfile?.status !== 'verified'} className="flex-1 py-2 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 bg-white p-6 rounded-2xl border border-gray-100 text-center">No pending appointment requests.</p>
          )}
        </div>

        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {todaysAppointments.length > 0 ? (
              <div className="space-y-4">
                {todaysAppointments.map((apt) => (
                  <div key={apt._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        {apt.patient?.avatar ? (
                          <img src={apt.patient.avatar} alt="P" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-700 font-bold text-lg">
                            {apt.patient?.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{apt.patient?.name}</h3>
                        <p className="text-sm text-gray-500">Reason: {apt.reason}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {apt.timeSlot}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p>No confirmed appointments for today.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
