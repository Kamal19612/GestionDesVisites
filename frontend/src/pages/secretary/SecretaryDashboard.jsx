import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/ui/PageHeader';

export default function SecretaryDashboard() {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('secretary.dashboard.cards.appointments.title'),
      desc: t('secretary.dashboard.cards.appointments.desc'),
      link: "/secretary/appointments",
      icon: "📅",
      color: "from-vp-cyan/20 to-vp-cyan/5",
      iconBg: "bg-vp-cyan/20",
      textColor: "text-vp-cyan"
    },
    {
      title: t('secretary.dashboard.cards.visits.title'),
      desc: t('secretary.dashboard.cards.visits.desc'),
      link: "/secretary/visits/today",
      icon: "🚪",
      color: "from-vp-mint/20 to-vp-mint/5",
      iconBg: "bg-vp-mint/20",
      textColor: "text-vp-mint"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader 
        title={t('secretary.dashboard.title')}
        subtitle={t('secretary.dashboard.subtitle')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="group relative overflow-hidden card p-6 hover:-translate-y-1">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} blur-3xl -mr-16 -mt-16 rounded-full`}></div>
            
            <div className={`${card.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6 relative z-10 shadow-inner`}>
              {card.icon}
            </div>

            <h2 className="text-xl font-bold text-vp-navy mb-2 relative z-10">{card.title}</h2>
            <p className="text-slate-500 leading-relaxed mb-6 relative z-10 text-sm">{card.desc}</p>
            
            <Link 
              to={card.link} 
              className={`inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm ${card.textColor} relative z-10 group-hover:translate-x-1 transition-transform`}
            >
              Gérer <span className="text-lg">→</span>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {/* Quick Links Section */}
        <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-vp-navy mb-4 text-center">{t('secretary.dashboard.quick_links.title')}</h3>
          <div className="flex justify-center">
            <Link to="/secretary/settings" className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-vp-cyan transition-all group flex flex-col items-center gap-2 max-w-sm w-full shadow-sm hover:shadow-lg hover:shadow-vp-cyan/5">
              <span className="text-2xl">⚙️</span>
              <p className="text-base font-black text-vp-navy group-hover:text-vp-cyan">{t('secretary.dashboard.quick_links.settings.title')}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{t('secretary.dashboard.quick_links.settings.subtitle')}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
