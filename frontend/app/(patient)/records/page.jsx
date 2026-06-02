'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import { toast } from 'sonner';

// --- Validation Schemas ---
const uploadSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  type: z.string().min(1, 'Please select a record type'),
  date: z.string().min(1, 'Date is required'),
  file: z.any().refine((files) => files?.length === 1, 'File is required'),
});

const RECORD_TYPES = ['Lab', 'Prescription', 'Scan', 'Other'];
const FILTER_TABS = ['All', ...RECORD_TYPES];

export default function HealthRecordsPage() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedRecordForShare, setSelectedRecordForShare] = useState(null);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorsList, setDoctorsList] = useState([]);
  const [isSearchingDoctors, setIsSearchingDoctors] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: { title: '', type: 'Lab', date: new Date().toISOString().split('T')[0] },
  });

  const fetchRecords = async () => {
    try {
      const res = await api.get('/records/my');
      setRecords(res.data.data);
    } catch (error) {
      toast.error('Failed to load records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filter records
  const filteredRecords = records.filter(record => 
    filter === 'All' ? true : record.type === filter.toLowerCase()
  );

  // --- Upload Handler ---
  const onUploadSubmit = async (data) => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type.toLowerCase());
    formData.append('date', data.date);
    formData.append('file', data.file[0]);

    try {
      await api.post('/records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      toast.success('Record uploaded successfully!');
      setUploadModalOpen(false);
      reset();
      fetchRecords();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // --- Delete Handler ---
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this record?')) return;
    
    try {
      await api.delete(`/records/${id}`);
      toast.success('Record deleted');
      fetchRecords();
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  // --- Share Search Doctors Handler ---
  useEffect(() => {
    if (!shareModalOpen || doctorSearch.trim().length < 2) {
      setDoctorsList([]);
      return;
    }

    const searchDoctors = async () => {
      setIsSearchingDoctors(true);
      try {
        const res = await api.get(`/doctors?name=${doctorSearch}&limit=5`);
        setDoctorsList(res.data.data);
      } catch (error) {
        console.error('Doctor search failed', error);
      } finally {
        setIsSearchingDoctors(false);
      }
    };

    const delayDebounceFn = setTimeout(searchDoctors, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [doctorSearch, shareModalOpen]);

  // --- Share Action Handler ---
  const handleShare = async (doctorId) => {
    try {
      await api.patch(`/records/${selectedRecordForShare._id}/share`, { doctorId });
      toast.success('Record shared successfully!');
      setShareModalOpen(false);
      setDoctorSearch('');
      fetchRecords(); // refresh to show updated sharing info if needed
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to share record');
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
          <p className="text-gray-500 mt-1">Manage and share your medical documents securely</p>
        </div>
        <button
          onClick={() => { reset(); setUploadModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Upload Record
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl mb-8 overflow-x-auto">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecords.map((record) => (
            <div key={record._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-primary-200 transition-colors">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  record.fileType === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                }`}>
                  {record.fileType === 'pdf' ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate" title={record.title}>{record.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium uppercase tracking-wider">
                      {record.type}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                <a
                  href={record.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 text-center text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  View
                </a>
                <button
                  onClick={() => { setSelectedRecordForShare(record); setShareModalOpen(true); }}
                  className="flex-1 py-2 text-center text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Share
                </button>
                <button
                  onClick={() => handleDelete(record._id)}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
          <p className="text-gray-500">Upload your first health record to keep it secure.</p>
        </div>
      )}

      {/* --- Upload Modal --- */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upload Record</h2>
              <button onClick={() => setUploadModalOpen(false)} className="text-gray-400 hover:bg-gray-100 p-1 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(onUploadSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Blood Test Results"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-surface-muted text-sm outline-none focus:ring-2 focus:ring-primary-500"
                  {...register('title')}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Record Type</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-surface-muted text-sm outline-none focus:ring-2 focus:ring-primary-500"
                    {...register('type')}
                  >
                    {RECORD_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Record</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-surface-muted text-sm outline-none focus:ring-2 focus:ring-primary-500"
                    {...register('date')}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select File (PDF, Images)</label>
                <input
                  type="file"
                  accept=".pdf, image/*"
                  className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  {...register('file')}
                />
                {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>}
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 mt-4"
              >
                {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Document'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Share Modal --- */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Share Record</h2>
              <button onClick={() => { setShareModalOpen(false); setDoctorSearch(''); }} className="text-gray-400 hover:bg-gray-100 p-1 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 font-medium">
              Sharing: <span className="text-gray-900 font-bold">{selectedRecordForShare?.title}</span>
            </p>

            <div className="relative">
              <input
                type="text"
                placeholder="Search doctor by name..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-surface-muted text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
              {isSearchingDoctors ? (
                <div className="text-center py-4 text-sm text-gray-500">Searching...</div>
              ) : doctorsList.length > 0 ? (
                doctorsList.map(doc => (
                  <button
                    key={doc._id}
                    onClick={() => handleShare(doc._id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-primary-50 hover:border-primary-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {doc.user?.avatar ? (
                          <img src={doc.user.avatar} alt="Dr." className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-700 font-bold text-sm">
                            {doc.user?.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Dr. {doc.user?.name}</h4>
                        <p className="text-xs text-gray-500">{doc.specialization}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-primary-600 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">Share</span>
                  </button>
                ))
              ) : doctorSearch.length >= 2 ? (
                <div className="text-center py-4 text-sm text-gray-500">No doctors found</div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
