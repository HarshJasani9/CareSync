'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '@/lib/axios';
import { toast } from 'sonner';
import Link from 'next/link';

import { Suspense } from 'react';

function WritePrescriptionForm() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const router = useRouter();

  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      diagnosis: '',
      instructions: '',
      validUntil: '',
      medicines: [{ name: '', dosage: '', frequency: '', duration: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medicines'
  });

  useEffect(() => {
    if (!appointmentId) {
      toast.error('No appointment ID provided');
      router.push('/doctor/appointments');
      return;
    }

    const fetchAppointment = async () => {
      try {
        const res = await api.get(`/appointments/${appointmentId}`);
        setAppointment(res.data.data);
      } catch (error) {
        toast.error('Failed to load appointment details');
        router.push('/doctor/appointments');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId, router]);

  const onSubmit = async (data) => {
    // Validate medicines
    if (data.medicines.length === 0 || !data.medicines[0].name) {
      toast.error('Please add at least one medicine');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/prescriptions', {
        appointmentId,
        diagnosis: data.diagnosis,
        instructions: data.instructions,
        validUntil: data.validUntil || undefined,
        medicines: data.medicines.filter(m => m.name.trim() !== '') // filter out empty rows
      });
      toast.success('Prescription generated and sent to patient!');
      router.push('/doctor/appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create prescription');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/doctor/appointments" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Write Prescription</h1>
          <p className="text-gray-500 mt-1">Digital prescription generator</p>
        </div>
      </div>

      {/* Patient Info Card (Read-only) */}
      <div className="bg-primary-50 rounded-2xl p-6 mb-8 border border-primary-100 flex flex-wrap gap-x-8 gap-y-4">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">Patient</p>
          <p className="font-bold text-gray-900">{appointment?.patient?.name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">Date</p>
          <p className="font-medium text-gray-900">{appointment?.date ? new Date(appointment.date).toLocaleDateString() : ''}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">Reason for visit</p>
          <p className="font-medium text-gray-900 max-w-md">{appointment?.reason}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        
        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Diagnosis <span className="text-red-500">*</span></label>
          <textarea
            required
            rows="2"
            placeholder="E.g., Viral Pharyngitis"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            {...register('diagnosis')}
          />
        </div>

        {/* Medicines */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-bold text-gray-900">Medicines <span className="text-red-500">*</span></label>
            <button
              type="button"
              onClick={() => append({ name: '', dosage: '', frequency: '', duration: '' })}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              + Add Medicine
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((item, index) => (
              <div key={item.id} className="flex flex-wrap md:flex-nowrap gap-3 items-start">
                <div className="flex-1 min-w-[200px]">
                  <input
                    placeholder="Medicine Name (e.g., Paracetamol)"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    {...register(`medicines.${index}.name`)}
                  />
                </div>
                <div className="w-full md:w-1/4">
                  <input
                    placeholder="Dosage (e.g., 500mg)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    {...register(`medicines.${index}.dosage`)}
                  />
                </div>
                <div className="w-full md:w-1/4">
                  <input
                    placeholder="Frequency (e.g., Twice daily)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    {...register(`medicines.${index}.frequency`)}
                  />
                </div>
                <div className="w-full md:w-1/4">
                  <input
                    placeholder="Duration (e.g., 5 days)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    {...register(`medicines.${index}.duration`)}
                  />
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2.5 mt-0.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                    title="Remove"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions & Valid Until */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-900 mb-2">Instructions / Follow-up</label>
            <textarea
              rows="3"
              placeholder="e.g., Drink plenty of water, review after 3 days..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              {...register('instructions')}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Valid Until <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-surface-muted text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              {...register('validUntil')}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Generating PDF...' : 'Issue Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function WritePrescriptionPage() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>}>
      <WritePrescriptionForm />
    </Suspense>
  );
}
