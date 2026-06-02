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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your health profile</p>
        </div>
        <div className="flex gap-3">
          <Link href="/records" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm">
            Upload Record
          </Link>
          <Link href="/doctors" className="px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-sm text-sm">
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Appointments" value={appointments.length} icon="📅" color="bg-blue-50 text-blue-600" />
        <StatCard title="Upcoming" value={upcomingAppointments.length} icon="⏳" color="bg-orange-50 text-orange-600" />
        <StatCard title="Prescriptions" value={prescriptions.length} icon="💊" color="bg-teal-50 text-teal-600" />
        <StatCard title="Health Records" value={records.length} icon="📁" color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
              <Link href="/appointments" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all</Link>
            </div>
            
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-100 hover:bg-primary-50/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        {apt.doctor?.user?.avatar ? (
                          <img src={apt.doctor.user.avatar} alt="Dr." className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-700 font-bold text-lg">
                            {apt.doctor?.user?.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Dr. {apt.doctor?.user?.name}</h3>
                        <p className="text-sm text-gray-500">{apt.doctor?.specialization}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{new Date(apt.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{apt.timeSlot}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No upcoming appointments.</p>
                <Link href="/doctors" className="text-primary-600 font-medium hover:underline mt-2 inline-block">Find a doctor</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links / Recent Prescriptions */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Prescriptions</h2>
            {prescriptions.length > 0 ? (
              <div className="space-y-4">
                {prescriptions.slice(0, 3).map((px) => (
                  <div key={px._id} className="flex items-center justify-between group">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Dr. {px.doctor?.user?.name}</p>
                      <p className="text-xs text-gray-500">{new Date(px.createdAt).toLocaleDateString()}</p>
                    </div>
                    {px.pdfUrl && (
                      <a href={px.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 p-2 hover:bg-primary-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No prescriptions yet.</p>
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
