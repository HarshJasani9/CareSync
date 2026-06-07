'use client'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getSocket } from '@/lib/socket'

export const useSocketEvents = (role) => {
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    if (role === 'patient') {
      const onAppointmentUpdated = (data) => {
        data.status === 'confirmed'
          ? toast.success(`Appointment confirmed with Dr. ${data.doctorName}`)
          : toast.error(`Appointment with Dr. ${data.doctorName} was ${data.status}`)
      }
      const onPrescriptionReady = (data) => {
        toast.success(`Prescription ready from Dr. ${data.doctorName}`, {
          description: data.diagnosis,
          action: { label: 'View', onClick: () => window.location.href = `/prescriptions/${data.prescriptionId}` }
        })
      }
      socket.on('appointment:updated', onAppointmentUpdated)
      socket.on('prescription:ready',  onPrescriptionReady)
      return () => {
        socket.off('appointment:updated', onAppointmentUpdated)
        socket.off('prescription:ready',  onPrescriptionReady)
      }
    }

    if (role === 'doctor') {
      const onAppointmentBooked = (data) => {
        toast.info(`New request from ${data.patientName}`, {
          description: `${new Date(data.date).toDateString()} · ${data.timeSlot}`,
          action: { label: 'Review', onClick: () => window.location.href = '/doctor/appointments' }
        })
      }
      socket.on('appointment:booked', onAppointmentBooked)
      return () => { socket.off('appointment:booked', onAppointmentBooked) }
    }
  }, [role])
}
