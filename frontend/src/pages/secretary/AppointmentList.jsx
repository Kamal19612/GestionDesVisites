import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import appointmentService from '../../services/appointmentService';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate, formatTime } from '../../utils/formatters';

export default function AppointmentList() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading, isError, error } = useQuery({
    queryKey: ['secretary', 'appointments'],
    queryFn: appointmentService.getAllAppointments,
    staleTime: 0,
    refetchInterval: 30000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, action }) => {
      if (action === 'approve') return appointmentService.approveAppointment(id);
      return appointmentService.rejectAppointment(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['secretary', 'appointments'] });
      toast.success(variables.action === 'approve' ? t('secretary.appointments.approve_success') : t('secretary.appointments.reject_success'));
    },
    onError: (err) => {
      toast.error(t('common.error'));
      console.error(err);
    },
  });

  const handleApprove = (id) => updateMutation.mutate({ id, action: 'approve' });
  const handleReject = (id) => updateMutation.mutate({ id, action: 'reject' });

  const columns = [
    {
      key: 'visitor',
      header: t('secretary.appointments.visitor'),
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-vp-navy font-black text-sm transition-all shadow-sm">
            {row.visitorName?.charAt(0)}
          </div>
          <div>
             <p className="text-lg font-black text-vp-navy">{row.visitorName}</p>
             <p className="text-[10px] text-slate-400 font-bold lowercase tracking-tight">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'planning',
      header: t('secretary.appointments.planning'),
      render: (row) => (
        <div className="space-y-1">
          <p className="text-lg font-black text-slate-700">{formatTime(row.heure || row.time)}</p>
          <p className="text-sm font-bold text-slate-400">{formatDate(row.date)}</p>
        </div>
      )
    },
    {
      key: 'status',
      header: t('common.status'),
      className: 'text-center',
      render: (row) => <div className="text-center"><StatusBadge status={row.statut} /></div>
    },
    {
      key: 'actions',
      header: t('common.actions'),
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-3 items-center">
          <Link 
            to={`/secretary/appointments/${row.id}`} 
            className="text-xs font-bold text-vp-cyan hover:underline uppercase tracking-widest px-3 py-2"
          >
            {t('secretary.appointments.details')}
          </Link>
          {row.statut === 'EN_ATTENTE' && (
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); handleApprove(row.id); }} 
                disabled={updateMutation.isPending}
                className="w-8 h-8 rounded-lg bg-vp-mint/10 text-vp-mint hover:bg-vp-mint hover:text-white transition-all flex items-center justify-center text-sm shadow-sm"
                title={t('secretary.appointments.approve')}
              >
                ✓
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleReject(row.id); }} 
                disabled={updateMutation.isPending}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center text-sm shadow-sm"
                title={t('secretary.appointments.reject')}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )
    }
  ];

  if (isError) return (
    <div className="p-20 text-center text-red-500 bg-red-50/50">
      <span className="text-4xl mb-4 block">⚠️</span>
      <p className="font-bold text-lg">{t('common.error')}</p>
      <p className="text-sm opacity-70">{error.message}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader 
        title={t('secretary.appointments.title')}
        subtitle={t('secretary.appointments.subtitle')}
      />

      <div className="card p-0 overflow-hidden border-none shadow-xl shadow-slate-200/50">
        <DataTable 
          columns={columns} 
          data={appointments} 
          isLoading={isLoading} 
          emptyMessage={t('secretary.appointments.empty')}
        />
      </div>
    </div>
  );
}
