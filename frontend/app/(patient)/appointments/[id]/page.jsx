'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await api.get(`/appointments/${id}`);
        setAppointment(res.data.data);
      } catch (error) {
        toast.error('Failed to load appointment details');
        router.push('/appointments');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointment();
  }, [id, router]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment cancelled successfully');
      router.push('/appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  if (isLoading) {
    return <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  }

  if (!appointment) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white dark:bg-dark-card border-0 shadow-sm rounded-full flex items-center justify-center text-gray-500 dark:text-dark-text-secondary hover:text-primary-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Appointment Details</h1>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-[2rem] shadow-sm border-0 overflow-hidden mb-8">
        <div className="p-8 border-b border-gray-100 dark:border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-[1.5rem] bg-primary-100 dark:bg-dark-sidebar border border-primary-200 dark:border-dark-border overflow-hidden shrink-0 flex items-center justify-center">
              {appointment.doctor?.user?.avatar ? (
                <img src={appointment.doctor.user.avatar} alt="Dr." className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-700 dark:text-primary-400 font-bold text-3xl">
                  {appointment.doctor?.user?.name?.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Dr. {appointment.doctor?.user?.name}</h2>
              <p className="text-primary-600 dark:text-primary-400 font-bold mb-2">{appointment.doctor?.specialization}</p>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-dark-text-secondary font-medium">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-dark-sidebar/50 rounded-full">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {new Date(appointment.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-dark-sidebar/50 rounded-full">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {appointment.timeSlot}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              appointment.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {appointment.status}
            </span>
            
            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-[1rem] transition-colors"
              >
                Cancel Appointment
              </button>
            )}
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Reason for Visit</h3>
            <div className="bg-gray-50 dark:bg-dark-sidebar/30 p-5 rounded-[1.5rem]">
              <p className="text-gray-900 dark:text-dark-text-primary font-medium leading-relaxed">
                {appointment.reason || 'No reason provided.'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Doctor Notes</h3>
            <div className="bg-gray-50 dark:bg-dark-sidebar/30 p-5 rounded-[1.5rem]">
              <p className="text-gray-900 dark:text-dark-text-primary font-medium leading-relaxed">
                {appointment.notes || 'No notes available yet.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Section */}
      {appointment.status === 'completed' && appointment.prescription && (
        <div className="bg-white dark:bg-dark-card rounded-[2rem] shadow-sm border-0 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary">Prescription</h2>
            <span className="text-sm font-bold text-gray-500 dark:text-dark-text-secondary">
              Issued on {new Date(appointment.prescription.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 p-6 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-dark-text-primary text-lg">E-Prescription</h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">Digital copy of your medication</p>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Link 
                href={`/prescriptions/${appointment.prescription._id}`}
                className="flex-1 md:flex-none px-6 py-2.5 bg-white dark:bg-dark-sidebar border border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text-primary font-bold rounded-[1rem] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
              >
                View Details
              </Link>
              {appointment.prescription.pdfUrl && (
                <a 
                  href={appointment.prescription.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none px-6 py-2.5 bg-primary-500 text-white font-bold rounded-[1rem] hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
