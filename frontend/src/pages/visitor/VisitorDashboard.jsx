import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate, formatTime } from '../../utils/formatters';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import appointmentService from '../../services/appointmentService';

export default function VisitorDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: rawAppointments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentService.getAppointments,
    staleTime: 0,
    refetchInterval: 30000,
  });

  const appointments = Array.isArray(rawAppointments) ? rawAppointments : (rawAppointments?.content || []);

  const deleteMutation = useMutation({
    mutationFn: (id) => appointmentService.deleteAppointment(id),
    onSuccess: () => {
      toast.success(t('common.delete') + ' effectuée'); // Simple translation for now
      refetch();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || t('common.error'));
    }
  });

  const handleDelete = (id) => {
    if (window.confirm(t('common.date') + ' ?')) { // Placeholder confirmation
      deleteMutation.mutate(id);
    }
  };

  // Stats Animation
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  useEffect(() => {
    if (appointments.length > 0) {
      setStats({
        total: appointments.length,
        pending: appointments.filter(a => a.statut === 'EN_ATTENTE').length,
        approved: appointments.filter(a => a.statut === 'APPROUVEE').length
      });
    }
  }, [appointments]);

  const columns = [
    { 
      key: 'date', 
      header: t('common.date'), 
      render: (row) => (
        <div className="space-y-1">
          <p className="text-lg font-black text-vp-navy">{formatTime(row.heure || row.time)}</p>
          <p className="text-sm font-bold text-slate-400">{formatDate(row.date)}</p>
        </div>
      )
    },
    { 
      key: 'destination', 
      header: 'Destination', // Should be in translation
      render: (row) => (
        <div className="space-y-1">
          <p className="text-lg font-bold text-vp-navy">{row.personneARencontrer || '—'}</p>
          <p className="text-xs font-black uppercase tracking-widest text-vp-cyan">{row.departement || '—'}</p>
        </div>
      )
    },
    { 
      key: 'motif', 
      header: t('common.reason'), 
      render: (row) => <p className="text-base text-slate-500 font-medium italic truncate max-w-[200px]">"{row.motif || '—'}"</p>
    },
    { 
      key: 'statut', 
      header: t('common.status'), 
      className: 'text-center',
      render: (row) => <div className="text-center"><StatusBadge status={row.statut} /></div>
    },
    {
      key: 'actions',
      header: t('common.actions'),
      className: 'text-right',
      render: (row) => (
       <div className="text-right flex justify-end gap-2">
           {/* Show Pass if Approved */}
           {row.statut === 'APPROUVEE' && (
             <Link 
               to={`/visitor/pass/${row.id}`}
               className="p-3 rounded-xl bg-vp-mint/10 text-vp-mint hover:bg-vp-mint hover:text-white transition-all"
               title="Voir le Pass d'Accès"
             >
               🎫
             </Link>
           )}
           <button
             onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
             className="p-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all"
             title={t('common.delete')}
           >
             🗑️
           </button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader 
        title={t('dashboard.welcome')}
        subtitle={t('dashboard.visitor_subtitle')}
        action={{
          label: t('action.new_request'),
          icon: '+',
          onClick: () => navigate('/visitor/appointments/new')
        }}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-8 border-none shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-vp-navy"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t('dashboard.stats.total')}</p>
          <p className="text-4xl font-black text-vp-navy group-hover:scale-110 transition-transform origin-left duration-300">{stats.total}</p>
        </div>
        <div className="card p-8 border-none shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t('dashboard.stats.pending')}</p>
          <p className="text-4xl font-black text-amber-500 group-hover:scale-110 transition-transform origin-left duration-300">{stats.pending}</p>
        </div>
        <div className="card p-8 border-none shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-vp-mint"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{t('dashboard.stats.approved')}</p>
          <p className="text-4xl font-black text-vp-mint group-hover:scale-110 transition-transform origin-left duration-300">{stats.approved}</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between">
           <h2 className="text-lg font-black text-vp-navy uppercase tracking-widest">{t('dashboard.history_title')}</h2>
           <button onClick={() => refetch()} className="text-[10px] font-black uppercase tracking-tighter text-vp-cyan hover:underline">{t('dashboard.refresh')}</button>
        </div>

        <DataTable 
          columns={columns} 
          data={appointments} 
          isLoading={isLoading}
          emptyMessage={t('dashboard.empty')}
        />
      </div>

      <div className="mt-12 text-center text-slate-400 font-medium italic text-xs">
         Tableau de bord auto-actualisé toutes les 30 secondes.
      </div>
    </div>
  );
}

