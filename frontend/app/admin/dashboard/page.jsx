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
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Format data for Recharts PieChart
  const chartData = stats.appointmentsByStatus.map(statusData => ({
    name: statusData._id.charAt(0).toUpperCase() + statusData._id.slice(1),
    value: statusData.count,
    color: COLORS[statusData._id] || '#6B7280' // default gray if unknown
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time statistics for CareSync</p>
        </div>
        {stats.pendingDoctors > 0 && (
          <Link
            href="/admin/doctors/pending"
            className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-800 dark:bg-white hover:bg-primary-900 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold rounded-[1.5rem] transition-all shadow-sm hover:-translate-y-0.5"
          >
            Review Pending Doctors
            <span className="bg-red-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">{stats.pendingDoctors}</span>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients" value={stats.totalUsers} icon="👥" colorTheme="blue" />
        <StatCard title="Verified Doctors" value={stats.totalDoctors} icon="👨‍⚕️" colorTheme="green" />
        <StatCard title="Pending Approvals" value={stats.pendingDoctors} icon="⏳" colorTheme="yellow" alert={stats.pendingDoctors > 0} />
        <StatCard title="Total Appointments" value={stats.totalAppointments} icon="📅" colorTheme="purple" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border-0 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Appointment Distribution</h2>
          
          {chartData.length > 0 ? (
            <div className="h-[300px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', backgroundColor: '#1F2937', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              No appointment data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, colorTheme, alert }) {
  // Soothing Helanthus-inspired pastel themes
  const themeClasses = {
    blue: 'bg-[#E3F2FD] dark:bg-blue-900/30 text-blue-900 dark:text-blue-100',
    green: 'bg-[#E8F5E9] dark:bg-green-900/30 text-green-900 dark:text-green-100',
    yellow: 'bg-[#FFF3E0] dark:bg-orange-900/30 text-orange-900 dark:text-orange-100',
    purple: 'bg-[#F3E5F5] dark:bg-purple-900/30 text-purple-900 dark:text-purple-100',
    pink: 'bg-[#FCE4EC] dark:bg-pink-900/30 text-pink-900 dark:text-pink-100',
  };
  
  const iconColors = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-orange-600 dark:text-orange-400',
    purple: 'text-purple-600 dark:text-purple-400',
    pink: 'text-pink-600 dark:text-pink-400',
  };

  // Re-mapping colors for variety
  const mappedTheme = colorTheme === 'yellow' ? 'pink' : colorTheme === 'purple' ? 'green' : colorTheme;
  const finalTheme = alert ? 'yellow' : mappedTheme;

  return (
    <div className={`p-6 rounded-[2rem] ${themeClasses[finalTheme]} flex flex-col justify-between min-h-[140px] relative overflow-hidden transition-transform hover:-translate-y-1 shadow-sm dark:shadow-none dark:border dark:border-gray-800/50`}>
      {alert && <div className="absolute top-0 right-0 w-2 h-full bg-red-500 animate-pulse"></div>}
      
      <div className={`text-2xl mb-4 ${iconColors[finalTheme]}`}>
        {icon}
      </div>
      <div>
        <p className={`text-sm font-medium mb-1 opacity-80`}>{title}</p>
        <div className="flex items-end gap-3">
          <p className="text-3xl font-black leading-none">{value}</p>
          {alert && <span className="bg-white/50 dark:bg-black/20 text-orange-700 dark:text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full mb-0.5">Action Needed</span>}
        </div>
      </div>
    </div>
  );
}
