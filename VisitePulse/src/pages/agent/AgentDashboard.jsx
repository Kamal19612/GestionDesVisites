import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, LogIn, LogOut, PlusCircle, Search, User, Clock, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';
import { useTranslation } from 'react-i18next';

const ActionCard = ({ title, icon: Icon, onClick, color }) => (
  <motion.button 
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex flex-col items-center justify-center p-8 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-750 hover:border-slate-500 transition-all group w-full shadow-lg"
  >
    <div className={`mb-4 p-5 rounded-full ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors shadow-inner`}>
      <Icon size={40} className={color.replace('bg-', 'text-')} />
    </div>
    <span className="text-white font-bold text-lg">{title}</span>
    <ArrowRight className="text-slate-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
  </motion.button>
);

const AgentDashboard = () => {
    const { t } = useTranslation();
    const [mode, setMode] = useState('menu'); // menu, entree, sortie, rdv_direct
    const [formData, setFormData] = useState({ id: '', motif: '', visiteurId: '' });
    const [loading, setLoading] = useState(false);

    const handleAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'entree') {
                await api.post(`/agent/visites/${formData.id}/arrivee`);
                toast.success(t('agent.success.entry'));
            } else if (mode === 'sortie') {
                await api.post(`/agent/visites/${formData.id}/sortie`);
                toast.success(t('agent.success.exit'));
            } else if (mode === 'rdv_direct') {
                await api.post('/agent/rendezvous/direct', { 
                    visiteurId: formData.visiteurId, 
                    motif: formData.motif,
                    heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    date: new Date().toISOString().split('T')[0]
                });
                toast.success(t('agent.success.direct'));
            }
            setMode('menu');
            setFormData({ id: '', motif: '', visiteurId: '' });
        } catch (error) {
            toast.error("Erreur lors de l'opération. Vérifiez l'ID.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">{t('agent.title')}</h1>
                <p className="text-slate-400 text-lg">{t('agent.subtitle')}</p>
            </div>

            {mode === 'menu' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ActionCard 
                        title={t('agent.actions.entry')} 
                        icon={LogIn} 
                        color="bg-green-500 text-green-400" 
                        onClick={() => setMode('entree')} 
                    />
                    <ActionCard 
                        title={t('agent.actions.exit')}
                        icon={LogOut} 
                        color="bg-red-500 text-red-500" 
                        onClick={() => setMode('sortie')} 
                    />
                    <ActionCard 
                        title={t('agent.actions.directRdv')}
                        icon={PlusCircle} 
                        color="bg-blue-500 text-blue-500" 
                        onClick={() => setMode('rdv_direct')} 
                    />
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl"
                >
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-700 pb-4">
                        <div className={`p-3 rounded-lg ${mode === 'entree' ? 'bg-green-500/10 text-green-400' : mode === 'sortie' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            {mode === 'entree' && <LogIn size={24} />}
                            {mode === 'sortie' && <LogOut size={24} />}
                            {mode === 'rdv_direct' && <PlusCircle size={24} />}
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            {mode === 'entree' && t('agent.actions.entry')}
                            {mode === 'sortie' && t('agent.actions.exit')}
                            {mode === 'rdv_direct' && t('agent.actions.directRdv')}
                        </h2>
                    </div>

                    <form onSubmit={handleAction} className="space-y-6">
                        {mode !== 'rdv_direct' ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">{t('agent.forms.scan')}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        autoFocus
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-500"
                                        placeholder="Ex: #39281"
                                        required
                                    />
                                    <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('agent.forms.visitorId')}</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.visiteurId}
                                            onChange={(e) => setFormData({ ...formData, visiteurId: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('agent.forms.reason')}</label>
                                    <textarea
                                        value={formData.motif}
                                        onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        rows="3"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        
                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={() => setMode('menu')}
                                className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium border border-slate-600"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
                            >
                                {loading ? <Loader size="sm" /> : t('agent.forms.confirm')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </div>
    );
};

export default AgentDashboard;
