import React from 'react';
import { Link } from 'react-router-dom';

export default function StatisticsView() {
  const statCards = [
    {
      title: "Historique des Visites",
      desc: "Analyse exhaustive de tous les passages sur site avec filtres temporels.",
      link: "/admin/statistics/history",
      icon: "📊",
      color: "vp-navy"
    },
    {
      title: "Durée Moyenne",
      desc: "Indicateurs de performance sur le temps de présence moyen des visiteurs.",
      link: "/admin/statistics/average-duration",
      icon: "⏱️",
      color: "vp-cyan"
    },
    {
      title: "Stats par Département",
      desc: "Répartition des visites par service et taux d'occupation.",
      link: "/admin/statistics/departments",
      icon: "🏢",
      color: "vp-mint"
    },
    {
      title: "Rapports Détaillés",
      desc: "Générateur de rapports PDF/Excel personnalisés pour les audits.",
      link: "/admin/statistics/detailed-reports",
      icon: "📄",
      color: "amber-500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-vp-navy tracking-tight">Intelligence & Données</h1>
          <p className="text-slate-500 font-medium max-w-lg">Explorez les indicateurs clés et l'activité de votre établissement à travers nos outils d'analyse avancés.</p>
        </div>
        <div className="hidden md:block">
           <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-300">
             <span className="w-2 h-2 rounded-full bg-vp-mint animate-ping"></span>
             Mise à jour en temps réel
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {statCards.map((card, idx) => (
          <Link 
            key={idx} 
            to={card.link}
            className="group relative flex flex-col p-8 md:p-10 card bg-white hover:bg-slate-50 border-none shadow-xl shadow-slate-200/50 transition-all duration-300 overflow-hidden"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-${card.color} opacity-5 rounded-full blur-3xl transition-opacity group-hover:opacity-10`}></div>
            
            <div className="flex items-start justify-between mb-8">
              <div className="text-4xl">{card.icon}</div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-vp-navy group-hover:bg-white transition-all shadow-inner font-black">→</div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black text-vp-navy tracking-tight">{card.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{card.desc}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-vp-cyan">Explorer le module</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 p-8 rounded-[40px] bg-vp-navy text-white relative overflow-hidden text-center">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-vp-cyan/20 to-transparent"></div>
         <p className="relative z-10 text-[11px] font-black uppercase tracking-[0.5em] text-white/40 mb-2">VisitePulse AI Engine</p>
         <h2 className="relative z-10 text-xl font-bold italic">Transformez vos flux de visiteurs en décisions stratégiques.</h2>
      </div>
    </div>
  );
}
