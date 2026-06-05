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
      // Fetch profile first – this always works for authenticated doctors
      const profileRes = await api.get('/auth/me');
      const meData = profileRes.data.data;
      setDoctorProfile(meData.doctorProfile);
      setUserProfile(meData);

      // Then fetch appointments separately so a failure doesn't break the whole dashboard
      try {
        const appRes = await api.get('/appointments/my');
        setAppointments(appRes.data.data || []);
      } catch (appError) {
        console.error('Failed to load appointments:', appError);
        // Don't block the dashboard – just show zero appointments
        setAppointments([]);
      }
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Welcome, Dr. {userProfile?.name}</h1>
        <p className="text-gray-500 dark:text-dark-text-secondary mt-1">Here is what&apos;s happening with your practice today.</p>
        
        {doctorProfile && doctorProfile.status === 'verified' && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/15 border border-green-200 dark:border-green-800/40 rounded-[1.5rem] text-green-800 dark:text-green-400 text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500 dark:text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Your account is verified. You can accept and manage patient appointments.
          </div>
        )}

        {doctorProfile && doctorProfile.status === 'pending' && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/15 border border-yellow-200 dark:border-yellow-800/40 rounded-[1.5rem] text-yellow-800 dark:text-yellow-400 text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-500 dark:text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            Your account is pending verification. You cannot accept appointments until an admin approves your profile.
          </div>
        )}

        {doctorProfile && doctorProfile.status === 'rejected' && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/40 rounded-[1.5rem] text-red-800 dark:text-red-400 text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            Your account has been rejected. Please contact support for more information.
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard title="Today&apos;s Appointments" value={todaysAppointments.length} color="border-l-blue-500" iconBg="bg-blue-100 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </StatCard>
        <StatCard title="Pending Requests" value={pendingRequests.length} color="border-l-amber-500" iconBg="bg-amber-100 dark:bg-amber-900/30" iconColor="text-amber-600 dark:text-amber-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </StatCard>
        <StatCard title="Total Patients" value={uniquePatients} color="border-l-primary-500" iconBg="bg-primary-100 dark:bg-primary-900/30" iconColor="text-primary-600 dark:text-primary-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </StatCard>
        <StatCard title="Overall Rating" value={doctorProfile?.rating > 0 ? doctorProfile.rating.toFixed(1) : 'New'} color="border-l-purple-500" iconBg="bg-purple-100 dark:bg-purple-900/30" iconColor="text-purple-600 dark:text-purple-400">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        </StatCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Requests */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text-primary">Pending Requests</h2>
          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map(req => (
                <div key={req._id} className="bg-white dark:bg-dark-card p-5 rounded-[1.5rem] border-0 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-dark-sidebar overflow-hidden shrink-0">
                      {req.patient?.avatar ? (
                        <img src={req.patient.avatar} alt="P" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-sm">
                          {req.patient?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-dark-text-primary text-sm">{req.patient?.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-dark-text-secondary">{new Date(req.date).toLocaleDateString()} at {req.timeSlot}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-dark-text-secondary bg-gray-50 dark:bg-dark-bg/50 p-2.5 rounded-xl italic">
                    &quot;{req.reason}&quot;
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => handleStatusUpdate(req._id, 'confirmed')} disabled={doctorProfile?.status !== 'verified'} className="flex-1 py-2.5 text-xs font-bold bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl transition-colors disabled:opacity-50">Confirm</button>
                    <button onClick={() => handleStatusUpdate(req._id, 'rejected')} disabled={doctorProfile?.status !== 'verified'} className="flex-1 py-2.5 text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors disabled:opacity-50">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white dark:bg-dark-card rounded-[1.5rem] border-0 shadow-sm">
              <svg className="w-10 h-10 text-gray-300 dark:text-dark-text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm text-gray-500 dark:text-dark-text-secondary font-medium">No pending appointment requests.</p>
            </div>
          )}
        </div>

        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text-primary">Today&apos;s Schedule</h2>
          <div className="bg-white dark:bg-dark-card rounded-[1.5rem] border-0 shadow-sm p-6">
            {todaysAppointments.length > 0 ? (
              <div className="space-y-4">
                {todaysAppointments.map((apt) => (
                  <div key={apt._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-dark-bg/50 border border-gray-100 dark:border-dark-border">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-dark-sidebar overflow-hidden shrink-0">
                        {apt.patient?.avatar ? (
                          <img src={apt.patient.avatar} alt="P" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-lg">
                            {apt.patient?.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-dark-text-primary">{apt.patient?.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Reason: {apt.reason}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-semibold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {apt.timeSlot}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-300 dark:text-dark-text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-gray-500 dark:text-dark-text-secondary font-medium">No confirmed appointments for today.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, iconBg, iconColor, children }) {
  return (
    <div className={`bg-white dark:bg-dark-card p-5 rounded-[1.5rem] border-0 border-l-4 ${color} shadow-sm flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor} shrink-0`}>
        {children}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mt-0.5">{value}</p>
      </div>
    </div>
  );
}
