'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
        const doc = res.data.data.doctorProfile;
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
      setIsEditing(false);
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
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">My Profile</h1>
          <p className="text-gray-500 dark:text-dark-text-secondary mt-1">Manage your public information and availability</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* General Info */}
        <div className="bg-white dark:bg-dark-card rounded-[2rem] border-0 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-dark-border">
            <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text-primary">General Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1rem] border-0 bg-gray-50 dark:bg-dark-sidebar text-gray-900 dark:text-dark-text-primary text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 rounded-[1rem] border-0 bg-gray-50 dark:bg-dark-sidebar text-gray-900 dark:text-dark-text-primary text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    className="w-full px-4 py-3 rounded-[1rem] border-0 bg-gray-50 dark:bg-dark-sidebar text-gray-900 dark:text-dark-text-primary text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Qualifications <span className="text-gray-400 dark:text-dark-text-muted font-normal">(comma-separated)</span></label>
                <input
                  type="text"
                  value={qualificationsStr}
                  onChange={(e) => setQualificationsStr(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1rem] border-0 bg-gray-50 dark:bg-dark-sidebar text-gray-900 dark:text-dark-text-primary text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                <textarea
                  rows="4"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell patients about your expertise..."
                  className="w-full px-4 py-3 rounded-[1rem] border-0 bg-gray-50 dark:bg-dark-sidebar text-gray-900 dark:text-dark-text-primary text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-[1rem] transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-dark-sidebar text-gray-700 dark:text-dark-text-secondary font-bold rounded-[1rem] hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <InfoRow label="Specialization" value={specialization || '—'} />
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Experience" value={`${experience} Years`} />
                <InfoRow label="Consultation Fee" value={`₹${consultationFee}`} />
              </div>
              <InfoRow label="Qualifications" value={qualificationsStr || '—'} />
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-dark-text-muted uppercase tracking-wider mb-2">Bio</p>
                <p className="text-sm text-gray-700 dark:text-dark-text-secondary leading-relaxed bg-gray-50 dark:bg-dark-bg/50 p-4 rounded-[1rem]">
                  {bio || 'No bio added yet.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Availability / Weekly Schedule */}
        <div className="bg-white dark:bg-dark-card rounded-[2rem] border-0 shadow-sm p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-dark-border">
            <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text-primary">Weekly Availability</h2>
            <button
              onClick={handleSaveSlots}
              disabled={isSaving}
              className="px-4 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              Save Slots
            </button>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {DAYS.map(day => {
              const daySlots = slots.map((s, idx) => ({ ...s, originalIndex: idx })).filter(s => s.day === day);
              
              return (
                <div key={day} className="bg-gray-50 dark:bg-dark-bg/50 p-4 rounded-[1.2rem] border border-gray-100 dark:border-dark-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 dark:text-dark-text-primary w-12 text-sm">{day}</span>
                    <button
                      onClick={() => addSlot(day)}
                      className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1 rounded-lg transition-colors"
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
                            className="flex-1 px-3 py-2 text-sm rounded-lg border-0 bg-white dark:bg-dark-sidebar text-gray-900 dark:text-dark-text-primary outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                          />
                          <span className="text-gray-400 dark:text-dark-text-muted text-xs font-bold">to</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateSlot(slot.originalIndex, 'endTime', e.target.value)}
                            className="flex-1 px-3 py-2 text-sm rounded-lg border-0 bg-white dark:bg-dark-sidebar text-gray-900 dark:text-dark-text-primary outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                          />
                          <button
                            onClick={() => removeSlot(slot.originalIndex)}
                            className="p-1.5 text-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-dark-text-muted italic">Not available</p>
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

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-500 dark:text-dark-text-muted uppercase tracking-wider mb-1.5">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary bg-gray-50 dark:bg-dark-bg/50 px-4 py-2.5 rounded-[1rem]">{value}</p>
    </div>
  );
}
