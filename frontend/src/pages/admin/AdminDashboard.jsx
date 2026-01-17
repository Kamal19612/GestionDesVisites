import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../components/ui/PageHeader';
import statisticsService from '../../services/statisticsService';

export default function AdminDashboard() {
  const { t } = useTranslation();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => statisticsService.getOverview(),
    refetchInterval: 30000
  });

  const cards = [
    {
      title: t('admin.dashboard.cards.stats.title'),
      desc: t('admin.dashboard.cards.stats.desc'),
      link: "/admin/statistics",
      icon: "📊",
      color: "from-vp-cyan/20 to-vp-cyan/5",
      iconBg: "bg-vp-cyan/20",
      textColor: "text-vp-cyan"
    },
    {
      title: t('admin.dashboard.cards.users.title'),
      desc: t('admin.dashboard.cards.users.desc'),
      link: "/admin/users",
      icon: "👥",
      color: "from-vp-mint/20 to-vp-mint/5",
      iconBg: "bg-vp-mint/20",
      textColor: "text-vp-mint"
    },
    {
      title: t('admin.dashboard.cards.settings.title'),
      desc: t('admin.dashboard.cards.settings.desc'),
      link: "/admin/settings",
      icon: "⚙️",
      color: "from-slate-200/50 to-slate-100/50",
      iconBg: "bg-slate-200",
      textColor: "text-slate-600"
    }
  ];

  const recentActivities = stats?.recentActivity || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title={t('admin.dashboard.title')}
        subtitle={t('admin.dashboard.subtitle')}
        className="mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <div key={i} className="group relative overflow-hidden card p-8 hover:-translate-y-2">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} blur-3xl -mr-16 -mt-16 rounded-full`}></div>
            
            <div className={`${card.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-8 relative z-10 shadow-inner`}>
              {card.icon}
            </div>

            <h2 className="text-2xl font-bold text-vp-navy mb-4 relative z-10">{card.title}</h2>
            <p className="text-slate-500 leading-relaxed mb-8 relative z-10">{card.desc}</p>
            
            <Link 
              to={card.link} 
              className={`inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm ${card.textColor} relative z-10 group-hover:translate-x-1 transition-transform`}
            >
              {t('admin.dashboard.action')} <span className="text-lg">→</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Summary / Recent Activity */}
      <div className="mt-16 bg-vp-navy rounded-[2.5rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-vp-cyan/10 blur-[120px] -mr-48 -mt-48 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-vp-mint/10 blur-[100px] -ml-32 -mb-32 rounded-full"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">{t('admin.dashboard.summary.title')}</h3>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              {t('admin.dashboard.summary.description')}
            </p>
            <div className="flex gap-12">
              <div>
                <p className="text-4xl font-bold mb-1 text-vp-cyan">
                    {isLoading ? "..." : stats?.activeVisits || 0}
                </p>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{t('admin.dashboard.summary.uptime')}</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-1 text-vp-mint">
                    {isLoading ? "..." : stats?.totalVisitsToday || 0}
                </p>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{t('admin.dashboard.summary.visits_today')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 min-h-[300px] flex flex-col">
             <div className="space-y-4 flex-1">
                {isLoading ? (
                    <div className="text-center py-10 text-white/20 italic">Chargement...</div>
                ) : recentActivities.length === 0 ? (
                    <div className="text-center py-10 text-white/20 italic">Aucune activité récente.</div>
                ) : (
                    recentActivities.map((act, i) => (
                      <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition-colors">
                        <div className="flex gap-3 items-center">
                          <div className="w-8 h-8 rounded-full bg-vp-cyan/20 flex items-center justify-center text-xs">👤</div>
                          <div>
                            <p className="text-sm font-bold">{act.visitorName}</p>
                            <p className="text-xs text-white/40">Entrée : {act.heureArrivee}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-white/30">{act.statut}</span>
                      </div>
                    ))
                )}
             </div>
             <div className="mt-4 pt-4 border-t border-white/5 text-center">
                 <Link to="/admin/statistics" className="text-xs font-bold text-vp-cyan uppercase tracking-widest hover:text-white transition-colors">
                    Voir les rapports complets
                 </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
