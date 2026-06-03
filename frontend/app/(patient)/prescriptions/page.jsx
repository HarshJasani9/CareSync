'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Calendar, FileText, Download, Clock } from 'lucide-react';

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get('/prescriptions/my');
      setPrescriptions(res.data.data);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (e, prescription) => {
    e.stopPropagation();
    setDownloadingId(prescription._id);
    try {
      const res = await api.get(`/prescriptions/${prescription._id}/pdf`, {
        responseType: 'blob',
      });
      if (res.request.responseURL) {
        window.open(res.request.responseURL, '_blank');
      } else {
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prescription-${prescription._id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch {
      if (prescription.pdfUrl) {
        window.open(prescription.pdfUrl, '_blank');
      } else {
        toast.error('PDF not available for this prescription');
      }
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">My Prescriptions</h1>
        <p className="text-gray-500 dark:text-dark-text-secondary mt-1">View and download your digital prescriptions.</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dark-card rounded-[2rem] border-0 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 dark:bg-dark-sidebar rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400 dark:text-dark-text-muted" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">No prescriptions found</h3>
          <p className="text-gray-500 dark:text-dark-text-secondary font-medium">You haven't received any prescriptions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              onClick={() => router.push(`/prescriptions/${prescription._id}`)}
              className="bg-white dark:bg-dark-card p-8 rounded-[2rem] border-0 shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-[1.2rem] flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-dark-text-primary text-xl group-hover:text-primary-500 transition-colors">Dr. {prescription.doctor?.user?.name}</h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-bold mt-1">{prescription.doctor?.specialization}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDownload(e, prescription)}
                  disabled={downloadingId === prescription._id}
                  className="p-3 bg-gray-50 dark:bg-dark-sidebar text-gray-600 dark:text-dark-text-secondary hover:text-primary-600 hover:bg-primary-50 dark:hover:text-primary-400 dark:hover:bg-primary-900/30 rounded-xl transition-all shrink-0 disabled:opacity-60"
                  title="Download PDF"
                >
                  {downloadingId === prescription._id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm font-medium">
                <div className="flex items-center gap-2 text-gray-600 dark:text-dark-text-secondary bg-gray-50 dark:bg-dark-bg/50 px-4 py-2.5 rounded-[1rem]">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                </div>
                {prescription.validUntil && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-dark-text-secondary bg-gray-50 dark:bg-dark-bg/50 px-4 py-2.5 rounded-[1rem]">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span>Valid til {new Date(prescription.validUntil).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="mb-6 flex-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-dark-text-primary mb-3 uppercase tracking-wider">Diagnosis</h4>
                <p className="text-gray-700 dark:text-dark-text-secondary font-medium text-sm bg-gray-50 dark:bg-dark-bg/50 p-4 rounded-[1.5rem] border-0">
                  {prescription.diagnosis}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-dark-text-primary mb-3 uppercase tracking-wider">Medicines</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {prescription.medicines.map((med, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-dark-bg/50 rounded-[1.5rem] border border-transparent dark:border-dark-border">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-dark-text-primary text-md mb-1">{med.name}</p>
                        <p className="text-xs font-semibold text-gray-500 dark:text-dark-text-muted uppercase tracking-wide">{med.frequency} • {med.duration}</p>
                      </div>
                      <span className="text-sm font-bold text-primary-700 dark:text-primary-400 bg-white dark:bg-dark-card shadow-sm px-4 py-1.5 rounded-full border dark:border-dark-border">
                        {med.dosage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {prescription.instructions && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-border">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-dark-text-muted mb-2 uppercase tracking-wider">Doctor's Notes</h4>
                  <p className="text-sm text-gray-700 dark:text-dark-text-secondary font-medium">{prescription.instructions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
