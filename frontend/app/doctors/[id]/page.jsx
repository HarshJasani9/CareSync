'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const isAuthenticated = useAuthStore(s => !!s.token);
  
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Booking State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const [docRes, revRes] = await Promise.all([
          api.get(`/doctors/${id}`),
          api.get(`/doctors/${id}/reviews`)
        ]);
        setDoctor(docRes.data.data);
        setReviews(revRes.data.data);
      } catch (error) {
        toast.error('Failed to load doctor profile');
        router.push('/doctors');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctor();
  }, [id, router]);

  // Handle booking submission
  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to book an appointment');
      router.push('/login');
      return;
    }
    
    setIsBooking(true);
    try {
      await api.post('/appointments', {
        doctorId: doctor._id,
        date: selectedDate,
        timeSlot: selectedSlot,
        reason,
      });
      toast.success('Appointment booked successfully!');
      router.push('/appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsBooking(false);
    }
  };

  // Get slots for the selected day of week
  const getAvailableSlotsForDay = () => {
    if (!selectedDate || !doctor?.availableSlots) return [];
    
    // JS Date gets day of week: 0(Sun) - 6(Sat)
    const dateObj = new Date(selectedDate);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const selectedDayName = dayNames[dateObj.getDay()];

    return doctor.availableSlots
      .filter(slot => slot.day === selectedDayName)
      .map(slot => `${slot.startTime} - ${slot.endTime}`);
  };

  const availableTimeSlots = getAvailableSlotsForDay();
  const todayStr = new Date().toISOString().split('T')[0];

  if (isLoading) return <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  if (!doctor) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Profile */}
        <div className="flex-1 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row gap-8">
             <div className="w-32 h-32 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
               {doctor.user?.avatar ? (
                 <img src={doctor.user.avatar} alt={doctor.user.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-700 font-bold text-4xl">
                   {doctor.user?.name?.charAt(0)}
                 </div>
               )}
             </div>
             <div>
               <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl font-bold text-gray-900">Dr. {doctor.user?.name}</h1>
                 <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                   Verified
                 </span>
               </div>
               <p className="text-lg text-primary-600 font-medium mb-4">{doctor.specialization}</p>
               
               <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                 <div className="flex items-center gap-1">
                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   {doctor.experience} Years Experience
                 </div>
                 <div className="flex items-center gap-1">
                   <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                   {doctor.rating > 0 ? doctor.rating.toFixed(1) : 'New'} ({doctor.totalReviews} reviews)
                 </div>
               </div>
               
               {doctor.qualifications && doctor.qualifications.length > 0 && (
                 <div className="mt-4 flex flex-wrap gap-2">
                   {doctor.qualifications.map(q => (
                     <span key={q} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg">{q}</span>
                   ))}
                 </div>
               )}
             </div>
          </div>

          {/* About */}
          {doctor.bio && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Doctor</h2>
              <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
             <h2 className="text-xl font-bold text-gray-900 mb-6">Patient Reviews</h2>
             {reviews.length > 0 ? (
               <div className="space-y-6">
                 {reviews.map(review => (
                   <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                     <div className="flex items-center gap-3 mb-2">
                       <div className="flex text-yellow-400">
                         {[...Array(5)].map((_, i) => (
                           <svg key={i} className={`w-4 h-4 ${i < review.rating ? '' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                         ))}
                       </div>
                       <span className="text-sm font-medium text-gray-900">{review.patient?.name}</span>
                       <span className="text-xs text-gray-400 ml-auto">{new Date(review.createdAt).toLocaleDateString()}</span>
                     </div>
                     {review.comment && <p className="text-gray-600 text-sm mt-2">{review.comment}</p>}
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-gray-500 italic">No reviews yet.</p>
             )}
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg sticky top-8 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Book Appointment</h2>
            <p className="text-gray-500 text-sm mb-6">Consultation Fee: <span className="font-bold text-primary-600 text-lg">₹{doctor.consultationFee}</span></p>

            <form onSubmit={handleBook} className="space-y-5">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Date</label>
                <input
                  type="date"
                  min={todayStr}
                  required
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(''); // Reset slot on date change
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Available Slots</label>
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {availableTimeSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                            selectedSlot === slot 
                              ? 'bg-primary-500 border-primary-500 text-white'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                      Doctor is not available on this day. Please select another date.
                    </p>
                  )}
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Visit</label>
                <textarea
                  required
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe your symptoms..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isBooking || !selectedDate || !selectedSlot || !reason}
                className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isBooking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
