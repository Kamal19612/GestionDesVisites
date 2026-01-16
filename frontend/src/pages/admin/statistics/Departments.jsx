import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import statisticsService from '../../../services/statisticsService';

export default function Departments() {
  const { data, isLoading, isError } = useQuery({ 
    queryKey: ['statistics','departments'], 
    queryFn: () => statisticsService.getByDepartment(),
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
      <h2 className="text-xl font-bold text-red-800 mb-2">Analyse Interrompue</h2>
      <p className="text-sm text-red-600/70 font-medium mb-6">Impossible de compiler les données départementales.</p>
      <Link to="/admin/statistics" className="btn-secondary px-8">Retour au module</Link>
    </div>
  );

  const displayData = (data && Array.isArray(data)) ? data : [];
  const normalized = displayData.map(d => ({
    name: d.department || d.name || 'Inconnu',
    count: d.count || d.visits || d.total || 0
  }));

  const total = normalized.reduce((s,x)=>s + x.count, 0);
  const COLORS = ['#0f172a', '#0ea5e9', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#94a3b8'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-vp-navy p-4 rounded-xl shadow-2xl border border-white/10 backdrop-blur-md">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{payload[0].payload.name}</p>
          <p className="text-lg font-black text-vp-cyan">{payload[0].value} <span className="text-[10px] text-white/60">visites</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link 
          to="/admin/statistics" 
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:border-vp-navy transition-all shadow-sm font-bold"
        >
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-vp-navy">Analyse Sectorielle</h1>
          <p className="text-slate-500 font-medium tracking-wide italic">Répartition de l'activité par département.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Chart Primary Container */}
        <div className="lg:col-span-2 space-y-8">
           <div className="card p-8 border-none shadow-xl shadow-slate-200/40 relative overflow-hidden bg-white/80 backdrop-blur-xl">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-vp-navy">Volume par Direction</h3>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-vp-cyan animate-pulse"></div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Live Distribution</span>
                </div>
             </div>
             <ResponsiveContainer width="100%" height={320}>
               <BarChart data={normalized} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                   dy={10}
                 />
                 <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                 />
                 <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                 <Bar 
                   dataKey="count" 
                   fill="#0ea5e9" 
                   radius={[6, 6, 0, 0]}
                   barSize={40}
                 />
               </BarChart>
             </ResponsiveContainer>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card p-8 border-none shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Répartition Partielle</p>
                 <ResponsiveContainer width="100%" height={200}>
                   <PieChart>
                     <Pie
                       data={normalized}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="count"
                     >
                       {normalized.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip content={<CustomTooltip />} />
                   </PieChart>
                 </ResponsiveContainer>
              </div>

              <div className="card p-10 bg-vp-navy text-white border-none shadow-2xl shadow-vp-navy/20 flex flex-col justify-center text-center">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Total Visites Enregistrées</p>
                 <h2 className="text-6xl font-black tracking-tighter mb-2">{total}</h2>
                 <p className="text-sm font-medium text-vp-cyan italic">Toutes divisions confondues</p>
              </div>
           </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="card p-8 border-none shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-xl h-fit">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-vp-navy mb-8 border-b border-slate-100 pb-4">Classement Détaillé</h3>
           <div className="space-y-6">
             {normalized.map((d, i) => {
               const percentage = Math.round((d.count / (total || 1)) * 100);
               return (
                 <div key={d.name} className="space-y-2">
                   <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                         <span className="text-sm font-bold text-vp-navy">{d.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">{d.count} v.</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%`, backgroundColor: COLORS[i % COLORS.length] }}
                      ></div>
                   </div>
                   <p className="text-[9px] font-black text-right text-slate-300 uppercase tracking-tighter">{percentage}% de l'activité</p>
                 </div>
               );
             })}
           </div>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-vp-cyan/5 border border-vp-cyan/10 flex gap-6">
         <span className="text-2xl mt-1">💡</span>
         <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-vp-cyan mb-2">Note Stratégique</p>
            <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
              Cette répartition permet d'ajuster les ressources de sécurité en fonction des départements les plus sollicités. Un département dépassant 40% de l'activité totale peut nécessiter un guichet d'accueil dédié.
            </p>
         </div>
      </div>
    </div>
  );
}
