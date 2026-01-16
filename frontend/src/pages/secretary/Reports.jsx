import React from 'react';
import { Link } from 'react-router-dom';

export default function Reports() {
  const reportTypes = [
    {
      title: 'Registre des Visites',
      desc: 'Historique exhaustif des entrées et sorties physiques sur site.',
      path: '/secretary/reports/visits',
      icon: '📋',
      color: 'from-vp-cyan/10 to-vp-cyan/5',
      accent: 'text-vp-cyan'
    },
    {
      title: 'Planning des Rendez-vous',
      desc: 'Analyse des demandes prévisionnelles et du taux d\'occupation.',
      path: '/secretary/reports/appointments',
      icon: '📅',
      color: 'from-vp-mint/10 to-vp-mint/5',
      accent: 'text-vp-mint'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-vp-navy mb-4">Centre de Reporting</h1>
        <p className="text-slate-500 font-medium tracking-wide italic max-w-2xl mx-auto">
          Outils d'extraction et d'analyse de données pour le secrétariat. Générez des rapports détaillés en un clic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {reportTypes.map((report) => (
          <Link 
            key={report.path} 
            to={report.path}
            className="group relative overflow-hidden card p-10 border-none shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${report.color} blur-[80px] -mr-24 -mt-24 group-hover:blur-[60px] transition-all`}></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-slate-50 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                {report.icon}
              </div>
              
              <h2 className="text-2xl font-black text-vp-navy mb-3">{report.title}</h2>
              <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8 max-w-[280px]">
                {report.desc}
              </p>
              
              <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-vp-navy group-hover:gap-4 transition-all">
                Accéder au rapport 
                <span className={report.accent}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-20 p-12 bg-vp-navy rounded-[50px] text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-vp-cyan/10 blur-[100px] -mr-32 -mb-32 rounded-full"></div>
        <div className="w-20 h-20 rounded-[30px] bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner shadow-white/10 shrink-0">
          📥
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Note de Sécurité</p>
           <h3 className="text-xl font-bold">Extraction Certifiée</h3>
           <p className="text-sm font-medium text-white/60 leading-relaxed max-w-2xl">
              Tous les exports générés via ce centre de reporting sont horodatés et signés numériquement pour garantir l'intégrité des données lors des audits de sécurité.
           </p>
        </div>
      </div>
    </div>
  );
}
