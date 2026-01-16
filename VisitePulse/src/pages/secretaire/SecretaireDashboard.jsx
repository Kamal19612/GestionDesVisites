import React, { useState, useEffect } from 'react';
import useAuth from '../../auth/useAuth';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { Check, X, Clock, Calendar, User } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import { useTranslation } from 'react-i18next';

const SecretaireDashboard = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    // ... (reste inchangé)
    const [rdvs, setRdvs] = useState([]);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchRendezVous = async () => {
        try {
            const response = await api.get('/secretaire/rendezvous/en-attente');
            setRdvs(response.data);
        } catch (error) {
            toast.error("Impossible de charger les rendez-vous."); // Peut être traduit aussi
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRendezVous();
    }, []);

    const handleAction = async (id, action) => {
        setActionLoading(id);
        try {
            if (action === 'valider') {
                await api.put(`/secretaire/rendezvous/${id}/valider`);
                toast.success(t('secretary.validated'));
            } else {
                await api.put(`/secretaire/rendezvous/${id}/refuser`);
                toast.info(t('secretary.refused'));
            }
            await fetchRendezVous();
        } catch (error) {
            toast.error("Erreur lors du traitement du rendez-vous.");
            console.error(error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">{t('secretary.title')}</h1>
                    <p className="text-slate-400">{t('secretary.subtitle')}</p>
                </div>
                <button 
                    onClick={logout}
                    className="px-4 py-2 bg-red-600/10 text-red-400 border border-red-600/20 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                >
                    {t('common.logout')}
                </button>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Clock size={20} className="text-blue-500" />
                        {t('secretary.pending')} ({rdvs.length})
                    </h2>
                </div>

                {rdvs.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        {t('secretary.noPending')}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-slate-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Visiteur</th>
                                    <th className="px-6 py-4 font-medium">Date & Heure</th>
                                    <th className="px-6 py-4 font-medium">Motif</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {rdvs.map((rdv) => (
                                    <tr key={rdv.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-700 p-2 rounded-full">
                                                    <User size={16} className="text-slate-300" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{rdv.visiteurNom || 'Anonyme'}</p>
                                                    <p className="text-xs text-slate-500">ID: {rdv.visiteurId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-sm">
                                                <span className="text-white flex items-center gap-2">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {rdv.date}
                                                </span>
                                                <span className="text-slate-400 flex items-center gap-2">
                                                    <Clock size={14} />
                                                    {rdv.heure}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {rdv.motif}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(rdv.id, 'valider')}
                                                    disabled={actionLoading === rdv.id}
                                                    className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                                                    title="Valider"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(rdv.id, 'refuser')}
                                                    disabled={actionLoading === rdv.id}
                                                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                                    title="Refuser"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecretaireDashboard;
