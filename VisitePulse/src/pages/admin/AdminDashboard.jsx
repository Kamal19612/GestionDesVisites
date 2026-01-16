import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Building, Activity, ShieldCheck, Download, Plus, Search } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';
import { useTranslation } from 'react-i18next';

// Données simulées
const STATS_DATA = [
  { name: 'Validés', value: 45, color: '#22c55e' },
  { name: 'En attente', value: 12, color: '#eab308' },
  { name: 'Rejetés', value: 5, color: '#ef4444' },
  { name: 'Terminés', value: 30, color: '#3b82f6' },
];

const VISITES_PAR_JOUR = [
    { name: 'Lun', visites: 12 },
    { name: 'Mar', visites: 19 },
    { name: 'Mer', visites: 15 },
    { name: 'Jeu', visites: 22 },
    { name: 'Ven', visites: 18 },
];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-opacity-10 ${color.bg} ${color.text}`}>
        <Icon size={24} />
      </div>
      <span className="text-3xl font-bold text-white">{value}</span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
  </motion.div>
);

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [showUserModal, setShowUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ nom: '', prenom: '', email: '', motDePasse: '', role: 'EMPLOYE' });
    const [creating, setCreating] = useState(false);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await api.post('/admin/users', { ...newUser, actif: true });
            toast.success("Utilisateur créé avec succès !");
            setShowUserModal(false);
            setNewUser({ nom: '', prenom: '', email: '', motDePasse: '', role: 'EMPLOYE' });
        } catch (error) {
            toast.error("Erreur lors de la création de l'utilisateur.");
        } finally {
            setCreating(false);
        }
    };

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{t('admin.title')}</h1>
            <p className="text-slate-400 mt-1">Vue d'ensemble et gestion de la plateforme</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => setShowUserModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-blue-500/20 font-medium"
             >
                <Plus size={18} />
                {t('admin.createUser')}
            </button>
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-lg transition-all font-medium">
                <Download size={18} />
                {t('admin.report')}
            </button>
        </div>
      </div>

      {/* Cartes Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('admin.stats.visitors')} value="128" icon={Users} color={{ bg: 'bg-blue-500', text: 'text-blue-400' }} />
        <StatCard title={t('admin.stats.avgDuration')} value="45 min" icon={Activity} color={{ bg: 'bg-purple-500', text: 'text-purple-400' }} />
        <StatCard title={t('admin.stats.rejectRate')} value="4.2%" icon={ShieldCheck} color={{ bg: 'bg-red-500', text: 'text-red-400' }} />
        <StatCard title={t('admin.stats.departments')} value="6" icon={Building} color={{ bg: 'bg-orange-500', text: 'text-orange-400' }} />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-4">{t('admin.charts.statusDistribution')}</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={STATS_DATA} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                            {STATS_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-4">{t('admin.charts.weeklyVisits')}</h3>
             <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={VISITES_PAR_JOUR}>
                        <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey="visites" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>

       {/* Historique */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
            <div className="p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-white">{t('admin.history.title')}</h3>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder={t('common.search')}
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500" 
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">{t('admin.history.visitor')}</th>
                            <th className="px-6 py-4">{t('common.date')}</th>
                            <th className="px-6 py-4">{t('admin.history.agent')}</th>
                            <th className="px-6 py-4">{t('common.status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 text-slate-300">
                        {/* MOCKS */}
                        <tr className="hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">Jean Dupont</td>
                            <td className="px-6 py-4">16 Jan 09:00</td>
                            <td className="px-6 py-4">Marc (Agent)</td>
                            <td className="px-6 py-4"><span className="text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full text-xs font-medium border border-green-500/20">Terminé</span></td>
                        </tr>
                        <tr className="hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">Alice Martin</td>
                            <td className="px-6 py-4">16 Jan 10:30</td>
                            <td className="px-6 py-4">Sophie (Secrétaire)</td>
                            <td className="px-6 py-4"><span className="text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full text-xs font-medium border border-red-500/20">Rejeté</span></td>
                        </tr>
                        <tr className="hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">Lucas Bernard</td>
                            <td className="px-6 py-4">16 Jan 11:15</td>
                            <td className="px-6 py-4">Marc (Agent)</td>
                            <td className="px-6 py-4"><span className="text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded-full text-xs font-medium border border-yellow-500/20">En cours</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

      {/* Modal Création Utilisateur */}
        {showUserModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 shadow-2xl"
                >
                    <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">{t('admin.modal.title')}</h2>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">{t('admin.form.firstName')}</label>
                                <input type="text" required value={newUser.prenom} onChange={e => setNewUser({...newUser, prenom: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">{t('admin.form.lastName')}</label>
                                <input type="text" required value={newUser.nom} onChange={e => setNewUser({...newUser, nom: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">{t('admin.form.email')}</label>
                            <input type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">{t('admin.form.password')}</label>
                            <input type="password" required value={newUser.motDePasse} onChange={e => setNewUser({...newUser, motDePasse: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-300 mb-1">{t('admin.form.role')}</label>
                             <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                                 <option value="EMPLOYE">Employé</option>
                                 <option value="AGENT">Agent de Sécurité</option>
                                 <option value="SECRETAIRE">Secrétaire</option>
                                 <option value="ADMIN">Administrateur</option>
                             </select>
                        </div>
                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700">
                            <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">{t('common.cancel')}</button>
                            <button type="submit" disabled={creating} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/25">
                                {creating ? <Loader size="sm" /> : t('common.create')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
    </div>
  );
};
export default AdminDashboard;
