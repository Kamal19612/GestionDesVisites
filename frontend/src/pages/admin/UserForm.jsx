import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

const ROLES = ['VISITEUR', 'SECRETAIRE', 'AGENT_SECURITE', 'EMPLOYE', 'ADMIN'];

export default function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: isEdit,
    staleTime: 0,
    onSuccess: (data) => {
      if (data) {
        const [firstName, ...lastNameParts] = data.name.split(' ');
        const lastName = lastNameParts.join(' ') || '';
        reset({ firstName, lastName, email: data.email, role: data.role, whatsapp: data.whatsapp || '' });
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: (payload) => userService.createUser(payload),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['users'] }); 
      toast.success('Utilisateur créé avec succès'); 
      navigate('/admin/users'); 
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      toast.error(error?.response?.data?.message || 'Échec lors de la création');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => userService.updateUser(id, payload),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['users'] }); 
      toast.success('Utilisateur mis à jour avec succès'); 
      navigate('/admin/users'); 
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast.error(error?.response?.data?.message || 'Échec lors de la mise à jour');
    }
  });

  const onSubmit = (data) => {
    if (!isEdit && data.password !== data.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    const payload = { ...data };
    if (isEdit && (!payload.password || payload.password.trim() === '')) {
      delete payload.password;
      delete payload.confirmPassword;
    }

    if (isEdit) updateMutation.mutate({ id, payload });
    else createMutation.mutate(payload);
  };

  useEffect(() => {
    if (!isEdit) reset({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', whatsapp: '', role: 'VISITEUR' });
  }, [isEdit, reset]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link 
          to="/admin/users" 
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:border-vp-navy transition-all shadow-sm"
        >
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-vp-navy">{isEdit ? 'Modifier le compte' : 'Nouvel utilisateur'}</h1>
          <p className="text-slate-500 font-medium">Remplissez les informations ci-dessous.</p>
        </div>
      </div>

      {isEdit && isLoading ? (
        <div className="card p-20 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-vp-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium tracking-wide">Récupération des données...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="card p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
          <div className="p-8 md:p-12 space-y-8">
            
            {/* Identity Group */}
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-vp-cyan border-b border-vp-cyan/10 pb-2">Identité</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-vp-navy ml-1">Prénom</label>
                  <input 
                    {...register('firstName', { required: 'Requis', minLength: { value: 2, message: 'Min 2 car.' } })} 
                    className={`w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 transition-all outline-none ${errors.firstName ? 'border-red-300 bg-red-50/10' : ''}`}
                    placeholder="Ex: Jean"
                  />
                  {errors.firstName && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-vp-navy ml-1">Nom</label>
                  <input 
                    {...register('lastName', { required: 'Requis', minLength: { value: 2, message: 'Min 2 car.' } })} 
                    className={`w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 transition-all outline-none ${errors.lastName ? 'border-red-300 bg-red-50/10' : ''}`}
                    placeholder="Ex: Dupont"
                  />
                  {errors.lastName && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.lastName.message}</p>}
                </div>
              </div>
            </div>

            {/* Contact Group */}
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-vp-mint border-b border-vp-mint/10 pb-2">Contact & Rôle</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-vp-navy ml-1">E-mail Professionnel</label>
                  <input 
                    type="email" 
                    {...register('email', { required: 'Requis', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalide' } })} 
                    className={`w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 transition-all outline-none ${errors.email ? 'border-red-300 bg-red-50/10' : ''}`}
                    placeholder="adresse@entreprise.com"
                  />
                  {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.email.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-vp-navy ml-1">Rôle Système</label>
                  <select 
                    {...register('role', { required: 'Requis' })} 
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 transition-all outline-none appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'org.slf4j.LoggerFactory.getLogger(M19 9l-7 7-7-7\' /%3E%3C/svg%3E")' }}
                  >
                    <option value="">Sélectionner</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-vp-navy ml-1">WhatsApp</label>
                <input {...register('whatsapp')} className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 transition-all outline-none" placeholder="+212 ..." />
              </div>
            </div>

            {/* Security Group */}
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Sécurité</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-vp-navy ml-1">Mot de passe {isEdit && <span className="text-[10px] text-slate-400">(Facultatif)</span>}</label>
                  <input 
                    type="password" 
                    {...register('password', { 
                      required: isEdit ? false : 'Requis',
                      minLength: isEdit ? undefined : { value: 6, message: 'Min 6 car.' }
                    })} 
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 transition-all outline-none"
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.password.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-vp-navy ml-1">Confirmer</label>
                  <input 
                    type="password" 
                    {...register('confirmPassword', { 
                      required: isEdit ? false : 'Requis',
                      validate: (value) => !isEdit && value !== password ? 'Différent' : true
                    })} 
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 transition-all outline-none"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <button 
              type="button" 
              onClick={() => navigate('/admin/users')} 
              className="text-sm font-bold text-slate-400 hover:text-vp-navy transition-colors uppercase tracking-widest"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending} 
              className="btn-primary"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Chargement...' : isEdit ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
