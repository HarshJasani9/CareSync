'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function PrescriptionDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [prescription, setPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await api.get(`/prescriptions/${id}`);
        setPrescription(res.data.data);
      } catch (error) {
        toast.error('Failed to load prescription');
        router.push('/prescriptions');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrescription();
  }, [id, router]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const res = await api.get(`/prescriptions/${id}/pdf`, {
        responseType: 'blob',
        maxRedirects: 0,
      });
      // If the backend redirected (returns a URL), follow it
      if (res.request.responseURL) {
        window.open(res.request.responseURL, '_blank');
      } else {
        // Direct blob download fallback
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prescription-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (error) {
      // Fallback: open the PDF URL directly if the redirect approach works
      if (prescription?.pdfUrl) {
        window.open(prescription.pdfUrl, '_blank');
      } else {
        toast.error('Failed to download PDF');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!prescription) return null;

  const doctor = prescription.doctor;
  const patient = prescription.patient;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back Button + Title */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-white dark:bg-dark-card border-0 shadow-sm rounded-full flex items-center justify-center text-gray-500 dark:text-dark-text-secondary hover:text-primary-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Prescription Details</h1>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary font-medium">
            Issued on {new Date(prescription.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Doctor & Patient Info Card */}
      <div className="bg-white dark:bg-dark-card rounded-[2rem] shadow-sm border-0 overflow-hidden mb-8">
        <div className="p-8 border-b border-gray-100 dark:border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Doctor Info */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[1.5rem] bg-primary-100 dark:bg-dark-sidebar border border-primary-200 dark:border-dark-border overflow-hidden shrink-0 flex items-center justify-center">
              {doctor?.user?.avatar ? (
                <img src={doctor.user.avatar} alt="Dr." className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-700 dark:text-primary-400 font-bold text-2xl">
                  {doctor?.user?.name?.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-dark-text-muted uppercase tracking-wider mb-1">Prescribed by</p>
              <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary">Dr. {doctor?.user?.name}</h2>
              <p className="text-primary-600 dark:text-primary-400 font-bold text-sm">{doctor?.specialization}</p>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2.5 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-[1rem] transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-wait shrink-0"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Downloading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>

        {/* Patient Info Row */}
        {patient && (
          <div className="px-8 py-5 bg-gray-50 dark:bg-dark-bg/50 border-b border-gray-100 dark:border-dark-border">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-gray-500 dark:text-dark-text-muted font-medium">Patient: </span>
                <span className="font-bold text-gray-900 dark:text-dark-text-primary">{patient.name}</span>
              </div>
              {patient.dateOfBirth && (
                <div>
                  <span className="text-gray-500 dark:text-dark-text-muted font-medium">DOB: </span>
                  <span className="font-bold text-gray-900 dark:text-dark-text-primary">{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
              {patient.bloodGroup && (
                <div>
                  <span className="text-gray-500 dark:text-dark-text-muted font-medium">Blood Group: </span>
                  <span className="font-bold text-gray-900 dark:text-dark-text-primary">{patient.bloodGroup}</span>
                </div>
              )}
              {prescription.validUntil && (
                <div>
                  <span className="text-gray-500 dark:text-dark-text-muted font-medium">Valid Until: </span>
                  <span className="font-bold text-gray-900 dark:text-dark-text-primary">{new Date(prescription.validUntil).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Diagnosis */}
        <div className="p-8 border-b border-gray-100 dark:border-dark-border">
          <h3 className="text-sm font-bold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Diagnosis</h3>
          <p className="text-gray-900 dark:text-dark-text-primary font-medium leading-relaxed bg-gray-50 dark:bg-dark-bg/50 p-5 rounded-[1.5rem]">
            {prescription.diagnosis}
          </p>
        </div>

        {/* Medicines Table */}
        <div className="p-8 border-b border-gray-100 dark:border-dark-border">
          <h3 className="text-sm font-bold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Medicines ({prescription.medicines.length})</h3>
          <div className="space-y-3">
            {prescription.medicines.map((med, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-gray-50 dark:bg-dark-bg/50 rounded-[1.5rem] border border-gray-100 dark:border-dark-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-dark-text-primary text-lg">{med.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      {med.frequency && (
                        <span className="text-xs font-bold text-gray-500 dark:text-dark-text-secondary bg-white dark:bg-dark-card px-2.5 py-1 rounded-lg border border-gray-100 dark:border-dark-border">
                          {med.frequency}
                        </span>
                      )}
                      {med.duration && (
                        <span className="text-xs font-bold text-gray-500 dark:text-dark-text-secondary bg-white dark:bg-dark-card px-2.5 py-1 rounded-lg border border-gray-100 dark:border-dark-border">
                          {med.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {med.dosage && (
                  <span className="text-sm font-bold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-full shrink-0 border border-primary-100 dark:border-primary-900/30">
                    {med.dosage}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Doctor's Instructions */}
        {prescription.instructions && (
          <div className="p-8">
            <h3 className="text-sm font-bold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Doctor&apos;s Instructions</h3>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-5 rounded-[1.5rem]">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-800 dark:text-amber-200 font-medium leading-relaxed text-sm">
                  {prescription.instructions}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
