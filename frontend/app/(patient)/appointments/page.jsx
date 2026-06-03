'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const router = useRouter();

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/my');
      setAppointments(res.data.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setIsSubmittingReview(true);
    try {
      await api.post('/reviews', {
        appointmentId: selectedAppointment._id,
        rating,
        comment,
      });
      toast.success('Review submitted successfully!');
      setReviewModalOpen(false);
      // Fetch appointments again to update state (or ideally refetch the review status)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => 
    filter === 'All' ? true : apt.status.toLowerCase() === filter.toLowerCase()
  );

  const TABS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your upcoming and past visits</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-white dark:bg-gray-900 p-2 rounded-[2rem] shadow-sm mb-8 overflow-x-auto border-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2.5 text-sm font-bold rounded-[1.5rem] whitespace-nowrap transition-all ${
              filter === tab
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid gap-6">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => (
            <div 
              key={apt._id} 
              onClick={() => router.push(`/appointments/${apt._id}`)}
              className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded-[2rem] border-0 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-primary-100 dark:bg-primary-900/50 overflow-hidden shrink-0 border border-primary-200 dark:border-primary-800/50 flex items-center justify-center">
                  {apt.doctor?.user?.avatar ? (
                    <img src={apt.doctor.user.avatar} alt="Dr." className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary-700 dark:text-primary-400 font-bold text-2xl">
                      {apt.doctor?.user?.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-xl">Dr. {apt.doctor?.user?.name}</h3>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">{apt.doctor?.specialization}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full">
                      <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(apt.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full">
                      <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {apt.timeSlot}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-center gap-4">
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  apt.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {apt.status}
                </span>
                
                <div className="flex gap-2">
                  {(apt.status === 'pending' || apt.status === 'confirmed') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel(apt._id);
                      }}
                      className="px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-[1rem] transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {apt.status === 'completed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAppointment(apt);
                        setRating(0);
                        setComment('');
                        setReviewModalOpen(true);
                      }}
                      className="px-4 py-2 text-sm font-bold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-[1rem] transition-colors"
                    >
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-[2rem] border-0 shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">No {filter !== 'All' ? filter.toLowerCase() : ''} appointments found</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 max-w-md w-full shadow-2xl border-0">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Leave a Review</h2>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <svg className={`w-10 h-10 ${rating >= star ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Comment (optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-[1rem] border-0 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-4 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  rows="3"
                  placeholder="How was your experience?"
                ></textarea>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setReviewModalOpen(false)} className="px-5 py-2.5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-[1rem] transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmittingReview} className="px-5 py-2.5 bg-primary-500 text-white font-bold rounded-[1rem] hover:bg-primary-600 transition-colors disabled:opacity-50">
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
