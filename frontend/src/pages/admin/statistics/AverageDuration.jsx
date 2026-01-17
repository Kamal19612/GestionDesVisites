import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import statisticsService from '../../../services/statisticsService';

export default function AverageDuration() {
  const { data, isLoading, isError } = useQuery({ 
    queryKey: ['statistics','average-duration'], 
    queryFn: () => statisticsService.getAverageDuration(),
    staleTime: 0,
    refetchInterval: 30000,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin w-12 h-12 border-4 border-vp-cyan border-t-transparent rounded-full"></div>
    </div>
  );

  if (isError) return (
    <div className="max-w-2xl mx-auto mt-20 p-8 border-2 border-dashed border-red-200 rounded-3xl text-center bg-red-50/30">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-xl font-bold text-red-800 mb-2">Erreur de données</h2>
      <p className="text-sm text-red-600/70 font-medium mb-6">Impossible de calculer les durées de visite.</p>
      <Link to="/admin/statistics" className="btn-secondary px-8">Retour au module</Link>
    </div>
  );

  const avg = data?.averageMinutes || 0;
  const min = data?.minMinutes || 0;
  const max = data?.maxMinutes || 0;
  const count = data?.totalVisitsConsidered || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link 
          to="/admin/statistics" 
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:border-vp-navy transition-all shadow-sm font-bold"
        >
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-vp-navy">Analyse de Durée</h1>
          <p className="text-slate-500 font-medium tracking-wide italic">Mesure de la fluidité et du temps de présence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Average Card */}
        <div className="lg:col-span-2 card p-10 bg-vp-navy text-white relative overflow-hidden flex flex-col justify-between min-h-[300px] border-none shadow-2xl shadow-vp-navy/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-vp-cyan/10 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
          
          <div className="relative z-10 flex items-center justify-between">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Performance Moyenne</p>
             <span className="text-2xl">⏳</span>
          </div>

          <div className="relative z-10 py-10">
             <div className="flex items-baseline gap-4">
               <span className="text-[120px] font-black leading-none tracking-tighter">{avg}</span>
               <span className="text-2xl font-black uppercase tracking-widest text-vp-cyan">minutes</span>
             </div>
             <p className="text-white/60 font-medium mt-4 max-w-sm">
               Temps de présence moyen mesuré entre l'enregistrement de l'entrée et la clôture de la visite.
             </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-vp-mint">
             <span className="w-2 h-2 rounded-full bg-vp-mint animate-pulse"></span>
             Calculé sur {count} visites clôturées
          </div>
        </div>

        {/* Small Stats */}
        <div className="space-y-8">
           <div className="card p-8 bg-white border-none shadow-xl shadow-slate-200/40 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-vp-mint"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-vp-mint/10 flex items-center justify-center text-[8px]">⬇</span>
                Minimum Record
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-vp-navy">{min}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">min</span>
              </div>
           </div>

           <div className="card p-8 bg-white border-none shadow-xl shadow-slate-200/40 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center text-[8px]">⬆</span>
                Maximum Record
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-vp-navy">{max}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">min</span>
              </div>
           </div>
        </div>
      </div>

      <div className="card p-10 border-none shadow-xl shadow-slate-100/60 bg-slate-50/50">
         <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 rounded-3xl bg-white shadow-inner flex items-center justify-center text-4xl shrink-0">📈</div>
            <div className="space-y-4">
               <h3 className="text-xl font-black text-vp-navy">Interprétation opérationnelle</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                 Une durée moyenne élevée peut indiquer une attente prolongée en réception ou une complexité accrue des procédures de sécurité. Visez une stabilité autour de 30-45 minutes pour une fluidité optimale.
               </p>
               <div className="pt-4 flex flex-wrap gap-4">
                  <div className="px-4 py-2 bg-vp-mint/10 rounded-xl text-[10px] font-black text-vp-mint uppercase tracking-widest">0-30m: Excellent</div>
                  <div className="px-4 py-2 bg-amber-100 rounded-xl text-[10px] font-black text-amber-600 uppercase tracking-widest">30-60m: Normal</div>
                  <div className="px-4 py-2 bg-rose-100 rounded-xl text-[10px] font-black text-rose-600 uppercase tracking-widest">60m+: Attention</div>
               </div>
            </div>
         </div>
      </div>

      <div className="mt-12 text-center">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           Données calculées dynamiquement sur la base des horodatages de sortie complets.
         </p>
      </div>
    </div>
  );
}
