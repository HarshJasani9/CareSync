'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [hasError, setHasError] = useState(false);

  const fetchAppointments = async () => {
    try {
      setHasError(false);
      const res = await api.get('/appointments/my');
      setAppointments(res.data.data || []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      setHasError(true);
      setAppointments([]);
      // Only show toast if it's a real server error, not a network issue
      if (error.response) {
        toast.error(error.response.data?.message || 'Failed to load appointments');
      } else {
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((apt) => 
    filter === 'All' ? true : apt.status?.toLowerCase() === filter.toLowerCase()
  );

  const TABS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  const statusStyles = {
    confirmed: 'bg-green-100 dark:bg-green-900/25 text-green-800 dark:text-green-400',
    pending: 'bg-yellow-100 dark:bg-yellow-900/25 text-yellow-800 dark:text-yellow-400',
    completed: 'bg-blue-100 dark:bg-blue-900/25 text-blue-800 dark:text-blue-400',
    cancelled: 'bg-red-100 dark:bg-red-900/25 text-red-800 dark:text-red-400',
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Patient Appointments</h1>
        <p className="text-gray-500 dark:text-dark-text-secondary mt-1">Manage and view your patient sessions</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/60 dark:bg-dark-card p-1.5 rounded-[1rem] overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-bold rounded-[0.7rem] whitespace-nowrap transition-all ${
              filter === tab
                ? 'bg-white dark:bg-dark-sidebar text-gray-900 dark:text-dark-text-primary shadow-sm'
                : 'text-gray-500 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-white/50 dark:hover:bg-dark-sidebar/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Error State with Retry */}
      {hasError && appointments.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-dark-card rounded-[2rem] border-0 shadow-sm">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text-primary mb-2">Failed to load appointments</h3>
          <p className="text-gray-500 dark:text-dark-text-secondary text-sm mb-6 max-w-sm mx-auto">There was an issue connecting to the server. Please try again.</p>
          <button
            onClick={() => { setIsLoading(true); fetchAppointments(); }}
            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* List */}
      {!hasError && (
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => (
              <div key={apt._id} className="bg-white dark:bg-dark-card p-6 rounded-[1.5rem] border-0 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-[1.2rem] bg-gray-200 dark:bg-dark-sidebar overflow-hidden shrink-0">
                    {apt.patient?.avatar ? (
                      <img src={apt.patient.avatar} alt="P" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-xl">
                        {apt.patient?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-dark-text-primary text-lg">{apt.patient?.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary mb-1.5 line-clamp-1 max-w-sm">Reason: {apt.reason}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-dark-text-secondary">
                      <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-dark-bg/50 px-2.5 py-1 rounded-lg">
                        <svg className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(apt.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-dark-bg/50 px-2.5 py-1 rounded-lg">
                        <svg className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {apt.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusStyles[apt.status] || 'bg-gray-100 dark:bg-dark-sidebar text-gray-600 dark:text-dark-text-secondary'}`}>
                    {apt.status}
                  </span>
                  
                  <div className="flex gap-2">
                    {(apt.status === 'confirmed' || apt.status === 'completed') && !apt.prescription && (
                      <Link
                        href={`/doctor/prescriptions/write?appointmentId=${apt._id}`}
                        className="px-4 py-2 text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors shadow-sm"
                      >
                        Write Prescription
                      </Link>
                    )}
                    {apt.prescription && (
                      <span className="px-3 py-1.5 text-sm font-bold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-900/30">
                        ✓ Prescription Issued
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white dark:bg-dark-card rounded-[2rem] border-0 shadow-sm">
              <svg className="w-12 h-12 text-gray-300 dark:text-dark-text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-gray-500 dark:text-dark-text-secondary font-medium">No {filter !== 'All' ? filter.toLowerCase() : ''} appointments found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
