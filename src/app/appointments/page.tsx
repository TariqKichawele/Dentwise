'use client';

import Navbar from '@/components/Navbar';
import { useBookAppointment, useUserAppointments } from '@/hooks/use-appointments';
import React, { useState } from 'react'
import ProgressSteps from '@/components/Appointments/ProgressSteps';
import DoctorSelectionStep from '@/components/Appointments/DoctorSelectionStep';
import TimeSelectionStep from '@/components/Appointments/TimeSelectionStep';
import BookingConfirmationStep from '@/components/Appointments/BookingConfirmationStep';
import { toast } from 'sonner';
import { APPOINTMENT_TYPES } from '@/lib/utils';

const Appointments = () => {
    const [selectedDentistId, setSelectedDentistId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [currentStep, setCurrentStep] = useState(1);

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [bookedAppointment, setBookedAppointment] = useState<any>(null);

    const bookAppointmentMutation = useBookAppointment();
    const { data: userAppointments = [] } = useUserAppointments();

    const handleSelectDentist = (dentistId: string) => {
        setSelectedDentistId(dentistId);
        setSelectedDate("");
        setSelectedTime("");
        setSelectedType("");
    }

    const handleBookAppointment = async () => {
        if (!selectedDentistId || !selectedDate || !selectedTime || !selectedType) {
            toast.error("Please select a dentist, date, time, and type");
            return;
        }

        const appointmentType = APPOINTMENT_TYPES.find((type) => type.id === selectedType);

        bookAppointmentMutation.mutate(
            {
                doctorId: selectedDentistId,
                date: selectedDate,
                time: selectedTime,
                reason: appointmentType?.name,
            },
            {
                onSuccess: async (appointment) => {
                    setBookedAppointment(appointment);
                    setShowConfirmationModal(true);

                    setSelectedDentistId(null);
                    setSelectedDate("");
                    setSelectedTime("");
                    setSelectedType("");
                    setCurrentStep(1);
                },
                onError: (error) => {
                    toast.error("Failed to book appointment", {
                        description: error.message,
                    });
                },
            }
        )
    };




  return (
    <div>
        <Navbar />

        <div className='max-w-7xl mx-auto px-6 py-8 pt-24'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold mb-2'>Book an Appointment</h1>
                <p className='text-muted-foreground'>Find and book with verified dentists in your area</p>
            </div>

            <ProgressSteps currentStep={currentStep} />

            {currentStep === 1 && (
                <DoctorSelectionStep 
                    selectedDentistId={selectedDentistId}
                    onContinue={() => setCurrentStep(2)}
                    onSelectDentist={handleSelectDentist}
                />
            )}

            {currentStep === 2 && selectedDentistId && (
                <TimeSelectionStep  
                    selectedDentistId={selectedDentistId}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedType={selectedType}
                    onBack={() => setCurrentStep(1)}
                    onContinue={() => setCurrentStep(3)}
                    onDateChange={setSelectedDate}
                    onTimeChange={setSelectedTime}
                    onTypeChange={setSelectedType}
                />
            )}

            {currentStep === 3 && selectedDentistId && (
                <BookingConfirmationStep 
                    selectedDentistId={selectedDentistId}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedType={selectedType}
                    isBooking={bookAppointmentMutation.isPending}
                    onBack={() => setCurrentStep(2)}
                    onModify={() => setCurrentStep(2)}
                    onConfirm={handleBookAppointment}
                />
            )}
        </div>
    </div>
  )
}

export default Appointments