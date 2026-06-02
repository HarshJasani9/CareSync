'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  confirmed: '#10B981', // green-500
  pending: '#F59E0B',   // yellow-500
  completed: '#3B82F6', // blue-500
  cancelled: '#EF4444', // red-500
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (error) {
        toast.error('Failed to load platform statistics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;
  }

  // Format data for Recharts PieChart
  const chartData = stats.appointmentsByStatus.map(statusData => ({
    name: statusData._id.charAt(0).toUpperCase() + statusData._id.slice(1),
    value: statusData.count,
    color: COLORS[statusData._id] || '#6B7280' // default gray if unknown
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-gray-500 mt-1">Real-time statistics for CareSync</p>
        </div>
        {stats.pendingDoctors > 0 && (
          <Link
            href="/admin/doctors/pending"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            Review Pending Doctors
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.pendingDoctors}</span>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Patients" value={stats.totalUsers} icon="👥" color="bg-blue-50 text-blue-600 border-blue-100" />
        <StatCard title="Verified Doctors" value={stats.totalDoctors} icon="👨‍⚕️" color="bg-green-50 text-green-600 border-green-100" />
        <StatCard title="Pending Approvals" value={stats.pendingDoctors} icon="⏳" color="bg-yellow-50 text-yellow-600 border-yellow-100" alert={stats.pendingDoctors > 0} />
        <StatCard title="Total Appointments" value={stats.totalAppointments} icon="📅" color="bg-purple-50 text-purple-600 border-purple-100" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Appointment Distribution</h2>
          
          {chartData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              No appointment data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, alert }) {
  return (
    <div className={`p-6 rounded-2xl border ${alert ? 'border-red-200 shadow-sm bg-red-50/30' : 'bg-white border-gray-100 shadow-sm'} flex items-center gap-4 relative overflow-hidden`}>
      {alert && <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${color}`}>
        {icon}
      </div>
      <div>
        <p className={`text-sm font-medium ${alert ? 'text-red-600' : 'text-gray-500'}`}>{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
