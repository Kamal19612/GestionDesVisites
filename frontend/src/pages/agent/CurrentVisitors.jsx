import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import visitService from '../../services/visitService'
import toast from 'react-hot-toast'

export default function CurrentVisitors() {
  const queryClient = useQueryClient()

  const { data: rawVisitors = [], isLoading, isError, error } = useQuery({
    queryKey: ['visits', 'active'],
    queryFn: () => visitService.getActiveVisits(),
    staleTime: 0,
    refetchInterval: 15000, // Faster sync for active visitors
  })

  const visitors = Array.isArray(rawVisitors) ? rawVisitors : (rawVisitors?.content || []);

  // state for immediate UI updates
  const [localVisitors, setLocalVisitors] = React.useState(visitors)

  React.useEffect(() => {
    setLocalVisitors(visitors)
  }, [visitors])

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const checkOutMutation = useMutation({
    mutationFn: (visitId) => visitService.checkoutVisit(visitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      toast.success(`Check-out enregistré`)
    },
    onError: () => toast.error('Erreur lors du check-out'),
  })

  const calculateDuration = (checkInTime) => {
    if (!checkInTime) return '...';
    try {
      // Split time if it's HH:mm
      let checkInDate = new Date();
      if (checkInTime.includes(':')) {
        const [hours, minutes] = checkInTime.split(':');
        checkInDate.setHours(parseInt(hours), parseInt(minutes));
      } else {
        checkInDate = new Date(checkInTime);
      }
      const now = new Date()
      const diffMinutes = Math.round((now - checkInDate) / 60000)
      const hrs = Math.floor(diffMinutes / 60)
      const mins = diffMinutes % 60
      return hrs > 0 ? `${hrs}h ${mins}min` : `${mins}min`
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-vp-navy mb-1">Visiteurs sur Site</h1>
          <p className="text-slate-500 font-medium tracking-wide text-sm">Suivi des présences actives.</p>
        </div>
        <div className="flex gap-4">
           <div className="card py-2.5 px-6 flex items-center gap-3 text-xs font-black text-vp-navy bg-vp-mint/10 border-vp-mint/20 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-vp-mint animate-pulse"></span>
              {visitors.length} PRÉSENTS
           </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
           <div className="animate-spin w-10 h-10 border-4 border-vp-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
           <p className="font-medium tracking-wide uppercase text-xs">Mise à jour de la liste...</p>
        </div>
      ) : isError ? (
        <div className="card p-20 text-center text-red-500">
           <p className="text-4xl mb-4">⚠️</p>
           <p className="font-bold">Erreur de chargement : {error.message}</p>
        </div>
      ) : localVisitors.length === 0 ? (
        <div className="card p-20 text-center text-slate-400">
           <p className="text-4xl mb-4">👥</p>
           <p className="font-medium uppercase text-xs tracking-[0.2em]">Aucun visiteur sur site pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visitors.map(visitor => (
            <div key={visitor.id} className="group relative overflow-hidden card p-0 border-none shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-all">
              {/* Status Header */}
              <div className="p-5 bg-vp-navy text-white transition-colors relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-vp-cyan/10 blur-2xl rounded-full -mr-12 -mt-12"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg font-black shadow-inner">
                    {visitor.visitorName?.charAt(0) || 'V'}
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] bg-vp-mint text-white shadow-lg shadow-vp-mint/30 animate-pulse">
                    SUR SITE
                  </span>
                </div>
                <h2 className="text-lg font-bold truncate relative z-10">{visitor.visitorName || 'Visiteur'}</h2>
                <p className="text-[10px] opacity-60 font-black uppercase tracking-widest relative z-10">Depuis {calculateDuration(visitor.time || visitor.HEntree)}</p>
              </div>

              {/* Info Body */}
              <div className="p-5 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Destination</p>
                    <p className="text-xs font-black text-vp-navy truncate">🏛️ {visitor.department || visitor.departement || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Contact</p>
                    <p className="text-xs font-black text-vp-navy truncate">👤 {visitor.contact || visitor.visitorPhone || 'N/A'}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-inner">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 italic border-b border-slate-200 pb-1">Motif du passage</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-bold italic line-clamp-2">"{visitor.purpose || visitor.motif || 'Aucun motif renseigné'}"</p>
                </div>

                <div className="flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  <span>Entrée : {visitor.time || visitor.HEntree || '--:--'}</span>
                  <span>ID : #{visitor.id}</span>
                </div>
              </div>

              {/* Footer Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => checkOutMutation.mutate(visitor.id)}
                  disabled={checkOutMutation.isPending}
                  className="w-full py-3.5 bg-vp-cyan hover:bg-vp-cyan/90 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-vp-cyan/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  🚀 Enregistrer Départ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
