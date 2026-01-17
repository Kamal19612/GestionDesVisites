import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const qc = useQueryClient();

  const { data: rawUsers = [], isLoading, isError } = useQuery({ 
    queryKey: ['users'], 
    queryFn: () => userService.getUsers(),
    staleTime: 0,
    refetchInterval: 30000,
  });

  const users = Array.isArray(rawUsers) ? rawUsers : (rawUsers?.content || []);

  const deleteMutation = useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur supprimé avec succès');
    },
    onError: (err) => {
      toast.error('Échec de la suppression');
      console.error(err);
    },
  });

  const handleDelete = (userId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) return;
    deleteMutation.mutate(userId);
  };

  const getRoleBadge = (role) => {
    const roles = {
      'ADMIN': 'bg-vp-navy text-white',
      'SECRETAIRE': 'bg-vp-cyan/10 text-vp-cyan border-vp-cyan/20',
      'AGENT_SECURITE': 'bg-vp-mint/10 text-vp-mint border-vp-mint/20',
      'EMPLOYEUR': 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return roles[role] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-vp-navy mb-2">Gestion des Utilisateurs</h1>
          <p className="text-slate-500">Administrez les comptes et les permissions du personnel.</p>
        </div>
        <Link to="/admin/users/new" className="btn-primary flex items-center gap-2">
          <span className="text-xl">+</span> Nouvel Utilisateur
        </Link>
      </div>

      <div className="card p-0 overflow-hidden border-none shadow-xl shadow-slate-200/50">
        {isLoading ? (
          <div className="p-20 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-vp-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400 font-medium">Chargement des comptes...</p>
          </div>
        ) : isError ? (
          <div className="p-20 text-center text-red-500 bg-red-50/50">
            <span className="text-4xl mb-4 block">⚠️</span>
            <p className="font-bold">Erreur de chargement</p>
            <p className="text-sm opacity-70">Impossible de récupérer la liste des utilisateurs.</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-20 text-center">
            <span className="text-4xl mb-4 block">👻</span>
            <p className="text-slate-500 font-medium">Aucun utilisateur enregistré pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Utilisateur</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Rôle</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-vp-navy to-slate-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-vp-navy group-hover:text-vp-cyan transition-colors">{user.name || 'Sans nom'}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/admin/users/${user.id}/edit`} 
                          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-vp-cyan/10 hover:text-vp-cyan transition-all"
                          title="Modifier"
                        >
                          ✏️
                        </Link>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500 transition-all"
                          title="Supprimer"
                        >
                          🗑️
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
}
