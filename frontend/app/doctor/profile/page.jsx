'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [bio, setBio] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState(0);
  const [consultationFee, setConsultationFee] = useState(0);
  const [qualificationsStr, setQualificationsStr] = useState('');
  
  // Slots State: array of { day, startTime, endTime }
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        const doc = res.data.data.doctor;
        setProfile(doc);
        setBio(doc.bio || '');
        setSpecialization(doc.specialization || '');
        setExperience(doc.experience || 0);
        setConsultationFee(doc.consultationFee || 0);
        setQualificationsStr(doc.qualifications?.join(', ') || '');
        setSlots(doc.availableSlots || []);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/doctors/profile', {
        bio,
        specialization,
        experience: Number(experience),
        consultationFee: Number(consultationFee),
        qualifications: qualificationsStr.split(',').map(q => q.trim()).filter(Boolean)
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSlots = async () => {
    setIsSaving(true);
    try {
      await api.put('/doctors/slots', { slots });
      toast.success('Availability updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update availability');
    } finally {
      setIsSaving(false);
    }
  };

  // Slot management
  const addSlot = (day) => {
    setSlots([...slots, { day, startTime: '09:00', endTime: '17:00' }]);
  };
  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };
  const updateSlot = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your public information and availability</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* General Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">General Information</h2>
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Consultation Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Qualifications <span className="text-gray-400 font-normal">(comma-separated)</span></label>
              <input
                type="text"
                value={qualificationsStr}
                onChange={(e) => setQualificationsStr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              <textarea
                rows="4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell patients about your expertise..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              Save Profile
            </button>
          </form>
        </div>

        {/* Availability / Weekly Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Weekly Availability</h2>
            <button
              onClick={handleSaveSlots}
              disabled={isSaving}
              className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              Save Slots
            </button>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {DAYS.map(day => {
              const daySlots = slots.map((s, idx) => ({ ...s, originalIndex: idx })).filter(s => s.day === day);
              
              return (
                <div key={day} className="bg-surface-muted p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-gray-900 w-12">{day}</span>
                    <button
                      onClick={() => addSlot(day)}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 px-2.5 py-1 rounded-md"
                    >
                      + Add Slot
                    </button>
                  </div>
                  
                  {daySlots.length > 0 ? (
                    <div className="space-y-2">
                      {daySlots.map(slot => (
                        <div key={slot.originalIndex} className="flex items-center gap-2">
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateSlot(slot.originalIndex, 'startTime', e.target.value)}
                            className="flex-1 px-2 py-1.5 text-sm rounded-lg border border-gray-200 outline-none focus:border-primary-500"
                          />
                          <span className="text-gray-400">to</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateSlot(slot.originalIndex, 'endTime', e.target.value)}
                            className="flex-1 px-2 py-1.5 text-sm rounded-lg border border-gray-200 outline-none focus:border-primary-500"
                          />
                          <button
                            onClick={() => removeSlot(slot.originalIndex)}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Not available</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
