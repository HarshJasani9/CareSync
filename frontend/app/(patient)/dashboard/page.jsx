'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appRes, preRes, recRes] = await Promise.all([
          api.get('/appointments/my'),
          api.get('/prescriptions/my'),
          api.get('/records/my'),
        ]);
        setAppointments(appRes.data.data);
        setPrescriptions(preRes.data.data);
        setRecords(recRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const upcomingAppointments = appointments
    .filter((a) => a.status === 'pending' || a.status === 'confirmed')
    .slice(0, 3);

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your health profile</p>
        </div>
        <div className="flex gap-3">
          <Link href="/records" className="px-5 py-2.5 bg-white dark:bg-dark-card border-0 text-gray-700 dark:text-dark-text-primary rounded-[1.5rem] font-semibold hover:shadow-md transition-all shadow-sm text-sm">
            Upload Record
          </Link>
          <Link href="/doctors" className="px-5 py-2.5 bg-primary-500 text-white rounded-[1.5rem] font-semibold hover:bg-primary-600 hover:shadow-md transition-all shadow-sm text-sm">
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Appointments" value={appointments.length} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} colorClass="bg-blue-50 text-blue-700" iconBg="bg-blue-100 text-blue-700" darkBorderClass="dark:border-[#4A9EFF]" darkIconClass="dark:text-[#4A9EFF] dark:bg-[#4A9EFF]/10" />
        <StatCard title="Upcoming" value={upcomingAppointments.length} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} colorClass="bg-orange-50 text-orange-700" iconBg="bg-orange-100 text-orange-700" darkBorderClass="dark:border-[#F59E0B]" darkIconClass="dark:text-[#F59E0B] dark:bg-[#F59E0B]/10" />
        <StatCard title="Prescriptions" value={prescriptions.length} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>} colorClass="bg-teal-50 text-teal-700" iconBg="bg-teal-100 text-teal-700" darkBorderClass="dark:border-[#10B981]" darkIconClass="dark:text-[#10B981] dark:bg-[#10B981]/10" />
        <StatCard title="Health Records" value={records.length} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>} colorClass="bg-purple-50 text-purple-700" iconBg="bg-purple-100 text-purple-700" darkBorderClass="dark:border-[#A78BFA]" darkIconClass="dark:text-[#A78BFA] dark:bg-[#A78BFA]/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-card rounded-[2rem] border-0 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary">Upcoming Appointments</h2>
              <Link href="/appointments" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500">View all</Link>
            </div>
            
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt._id} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-gray-50 dark:bg-dark-bg hover:bg-primary-50 dark:hover:bg-dark-sidebar transition-all border border-transparent dark:border-dark-border">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-dark-sidebar overflow-hidden shrink-0 flex items-center justify-center border border-primary-200 dark:border-dark-border">
                        {apt.doctor?.user?.avatar ? (
                          <img src={apt.doctor.user.avatar} alt="Dr." className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary-700 dark:text-primary-400 font-bold text-xl">
                            {apt.doctor?.user?.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-dark-text-primary text-lg">Dr. {apt.doctor?.user?.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-dark-text-secondary font-medium">{apt.doctor?.specialization}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-dark-text-primary">{new Date(apt.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{apt.timeSlot}</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 dark:bg-dark-bg rounded-[1.5rem] text-gray-500 dark:text-dark-text-secondary">
                <p className="font-medium">No upcoming appointments.</p>
                <Link href="/doctors" className="text-primary-600 dark:text-primary-400 font-bold hover:underline mt-2 inline-block">Find a doctor</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links / Recent Prescriptions */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-dark-card rounded-[2rem] border-0 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-6">Recent Prescriptions</h2>
            {prescriptions.length > 0 ? (
              <div className="space-y-4">
                {prescriptions.slice(0, 3).map((px) => (
                  <div key={px._id} className="flex items-center justify-between group p-4 rounded-[1.5rem] bg-gray-50 dark:bg-dark-bg hover:bg-primary-50 dark:hover:bg-dark-sidebar transition-all border border-transparent dark:border-dark-border">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-dark-text-primary text-md">Dr. {px.doctor?.user?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-dark-text-secondary font-medium">{new Date(px.createdAt).toLocaleDateString()}</p>
                    </div>
                    {px.pdfUrl && (
                      <a href={px.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 p-3 bg-white dark:bg-dark-card shadow-sm hover:shadow-md rounded-xl transition-all border dark:border-dark-border">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-dark-bg rounded-[1.5rem] text-gray-500 dark:text-dark-text-secondary border border-transparent dark:border-dark-border">
                <p className="font-medium">No prescriptions yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, colorClass, iconBg, darkBorderClass, darkIconClass }) {
  return (
    <div className={`${colorClass} dark:bg-dark-card dark:text-dark-text-primary p-6 rounded-[2rem] border-0 dark:border-l-[6px] ${darkBorderClass} shadow-sm flex flex-col justify-between transition-all hover:shadow-md`}>
      <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center mb-4 ${iconBg} ${darkIconClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold opacity-80 mb-1 dark:text-dark-text-secondary">{title}</p>
        <p className="text-4xl font-black">{value}</p>
      </div>
    </div>
  );
}
