'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Calendar, FileText, Download, Clock } from 'lucide-react';

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Prescriptions</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and download your digital prescriptions.</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No prescriptions found</h3>
          <p className="text-gray-500 dark:text-gray-400">You haven't received any prescriptions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Dr. {prescription.doctor?.user?.name}</h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{prescription.doctor?.specialization}</p>
                  </div>
                </div>
                {prescription.pdfUrl && (
                  <a
                    href={prescription.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors shrink-0"
                    title="Download PDF"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                </div>
                {prescription.validUntil && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Valid til {new Date(prescription.validUntil).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="mb-6 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Diagnosis</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  {prescription.diagnosis}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Medicines</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {prescription.medicines.map((med, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{med.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{med.frequency} • {med.duration}</p>
                      </div>
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-lg">
                        {med.dosage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {prescription.instructions && (
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Doctor's Notes</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{prescription.instructions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
