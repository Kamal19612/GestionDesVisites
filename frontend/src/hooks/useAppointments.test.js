import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAppointments } from './useAppointments';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import appointmentService from '../services/appointmentService';

// Mock the service
vi.mock('../services/appointmentService');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useAppointments', () => {
  it('should fetch and return appointments', async () => {
    const mockAppointments = [
      { id: 1, date: '2023-10-27', statut: 'EN_ATTENTE' },
      { id: 2, date: '2023-10-28', statut: 'APPROUVEE' },
    ];

    appointmentService.getAllAppointments.mockResolvedValue(mockAppointments);

    const { result } = renderHook(() => useAppointments(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.appointments).toHaveLength(2);
    expect(result.current.appointments[0].id).toBe(2); // Sorted by date desc
  });

  it('should filter appointments by status', async () => {
    const mockAppointments = [
      { id: 1, date: '2023-10-27', statut: 'EN_ATTENTE' },
      { id: 2, date: '2023-10-28', statut: 'APPROUVEE' },
    ];

    appointmentService.getAllAppointments.mockResolvedValue(mockAppointments);

    const { result } = renderHook(() => useAppointments('APPROUVEE'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.appointments).toHaveLength(1);
    expect(result.current.appointments[0].statut).toBe('APPROUVEE');
  });
});
