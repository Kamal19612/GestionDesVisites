import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';
import { useTranslation } from 'react-i18next';

const VisiteurDashboard = () => {
   const { t } = useTranslation();
   const [rdvs, setRdvs] = useState([]);
   const [loading, setLoading] = useState(true);
   // ...
   const [showModal, setShowModal] = useState(false);
   const [formData, setFormData] = useState({ date: '', heure: '', motif: '', type: 'PROFESSIONNEL' });
   const [submitting, setSubmitting] = useState(false);

   const fetchRdvs = async () => {
       try {
           const res = await api.get('/visiteur/rendezvous');
           setRdvs(res.data);
       } catch (err) {
           console.error(err);
           toast.error("Erreur chargement historique");
       } finally {
           setLoading(false);
       }
   };

   useEffect(() => {
       fetchRdvs();
   }, []);

   const handleSubmit = async (e) => {
       e.preventDefault();
       setSubmitting(true);
       try {
           await api.post('/visiteur/rendezvous', formData);
           toast.success(t('visitor.success'));
           setShowModal(false);
           setFormData({ date: '', heure: '', motif: '', type: 'PROFESSIONNEL' });
           fetchRdvs();
       } catch (error) {
           toast.error("Erreur lors de la demande");
       } finally {
           setSubmitting(false);
       }
   };

   if (loading) return <Loader fullScreen />;

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{t('visitor.title')}</h1>
             <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
             >
               <Plus size={18} />
               {t('visitor.newRequest')}
            </button>
         </div>

         <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
            {rdvs.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                    {t('visitor.noVisits')}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-slate-400 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Heure</th>
                            <th className="px-6 py-4 font-medium">Objet</th>
                            <th className="px-6 py-4 font-medium">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {rdvs.map((rdv) => (
                            <tr key={rdv.id} className="hover:bg-slate-700/30">
                                <td className="px-6 py-4 text-white flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-500" /> {rdv.date}
                                </td>
                                <td className="px-6 py-4 text-slate-300">
                                     <span className="flex items-center gap-2"><Clock size={14} /> {rdv.heure}</span>
                                </td>
                                <td className="px-6 py-4 text-white">{rdv.motif}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        rdv.statut === 'VALIDE' ? 'bg-green-500/10 text-green-400' :
                                        rdv.statut === 'REFUSE' ? 'bg-red-500/10 text-red-400' :
                                        'bg-yellow-500/10 text-yellow-400'
                                    }`}>
                                        {rdv.statut}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            )}
         </div>

         {/* Modal Demande */}
         {showModal && (
             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                 <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 shadow-2xl">
                     <h2 className="text-xl font-bold text-white mb-4">Planifier une visite</h2>
                     <form onSubmit={handleSubmit} className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                 <label className="block text-sm text-slate-400 mb-1">Date</label>
                                 <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                             </div>
                             <div>
                                 <label className="block text-sm text-slate-400 mb-1">Heure</label>
                                 <input type="time" required value={formData.heure} onChange={e => setFormData({...formData, heure: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                             </div>
                         </div>
                         <div>
                             <label className="block text-sm text-slate-400 mb-1">Motif</label>
                             <textarea required value={formData.motif} onChange={e => setFormData({...formData, motif: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white h-24"></textarea>
                         </div>
                         <div className="flex justify-end gap-3 mt-6">
                             <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Annuler</button>
                             <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                                 {submitting && <Loader2 className="animate-spin" size={16} />}
                                 Envoyer
                             </button>
                         </div>
                     </form>
                 </div>
             </div>
         )}
      </div>
   );
};

export default VisiteurDashboard;
