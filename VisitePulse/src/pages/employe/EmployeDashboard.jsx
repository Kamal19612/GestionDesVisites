import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/ui/Loader';
import { useTranslation } from 'react-i18next';

const EmployeDashboard = () => {
  const { t } = useTranslation();
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  
    //... (fetch inchangé)

  useEffect(() => {
    const fetchPlanning = async () => {
      try {
        const res = await api.get('/employe/rendezvous/aujourdhui');
        setRdvs(res.data);
      } catch (err) {
        console.error("Erreur chargement planning", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanning();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-white">{t('employee.title')}</h1>
            <p className="text-slate-400">{t('employee.subtitle')}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
           <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <CalendarIcon className="text-blue-500" size={20}/> 
                {t('employee.today')} ({rdvs.length})
              </h3>
              
              <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                 {rdvs.length === 0 ? (
                    <div className="relative pl-8 py-4">
                         <div className="absolute left-0 top-5 w-4 h-4 rounded-full bg-slate-600 border-4 border-slate-800"></div>
                         <p className="text-slate-500 italic">{t('employee.noRdv')}</p>
                    </div>
                 ) : rdvs.map((rdv, index) => (
                    <div key={rdv.id} className="relative pl-8">
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-800"></div>
                        <div className="bg-slate-750 p-4 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                           <div className="flex justify-between items-start mb-2">
                              <h4 className="text-white font-medium flex items-center gap-2">
                                <User size={16} className="text-slate-400"/>
                                {rdv.visiteurNom || "Visiteur Inconnu"}
                              </h4>
                              <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded font-mono">
                                {rdv.heure}
                              </span>
                           </div>
                           <p className="text-slate-400 text-sm mb-2">{rdv.motif}</p>
                           <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className={`px-2 py-0.5 rounded-full ${
                                    rdv.statut === 'VALIDE' ? 'bg-green-500/10 text-green-500' : 
                                    rdv.statut === 'EN_ATTENTE' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-700 text-slate-400'
                                }`}>
                                    {rdv.statut}
                                </span>
                           </div>
                        </div>
                     </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-fit">
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-orange-500"/>
                Notifications
           </h3>
           <div className="space-y-3">
              <div className="p-3 bg-slate-700/30 rounded border border-slate-700/50 text-sm text-slate-300">
                 Bienvenue sur votre espace employé. Les notifications d'arrivée des visiteurs s'afficheront ici.
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeDashboard;
