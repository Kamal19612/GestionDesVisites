import { useQuery } from '@tanstack/react-query';
import appointmentService from '../services/appointmentService';

export const useAppointments = (statusFilter = null) => {
  const { data: appointments = [], isLoading, isError, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentService.getAllAppointments,
  });

  const filteredAppointments = statusFilter
    ? appointments.filter((appointment) => appointment.statut === statusFilter)
    : appointments;

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return {
    appointments: sortedAppointments,
    isLoading,
    isError,
    error,
  };
};
