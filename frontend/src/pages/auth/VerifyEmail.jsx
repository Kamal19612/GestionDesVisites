import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import Input from '../../components/Form/Input';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const email = location.state?.email || '';

  const mutation = useMutation({
    mutationFn: (data) => authService.verifyEmail(email, data.code),
    onSuccess: () => {
      setSuccess(true);
      toast.success('Compte vérifié avec succès !');
      setTimeout(() => navigate('/login', { state: { message: 'Votre email a été vérifié. Vous pouvez maintenant vous connecter.' } }), 2500);
    },
    onError: (err) => {
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Code de vérification invalide';
      toast.error(errorMsg);
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-12 text-center shadow-2xl shadow-vp-mint/10 border-vp-mint/20">
          <div className="w-20 h-20 bg-vp-mint/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="text-4xl text-vp-mint font-bold italic">✓</span>
          </div>
          <h2 className="text-3xl font-black text-vp-navy mb-4">Vérification Réussie</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Votre compte est désormais actif. Nous vous redirigeons vers l'espace de connexion...
          </p>
          <div className="mt-8 flex justify-center">
             <div className="w-12 h-1 border-t-2 border-vp-mint rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50/50">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-vp-cyan/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-vp-mint/10 rounded-full blur-3xl"></div>
      </div>

      <div className="card max-w-md w-full p-8 md:p-10 shadow-2xl shadow-slate-200/50 border-none relative z-10 transition-all hover:shadow-vp-cyan/10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-vp-navy rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-vp-navy/20">
             <span className="text-2xl">📧</span>
          </div>
          <h1 className="text-3xl font-black text-vp-navy mb-3 tracking-tight">Vérification Email</h1>
          <p className="text-sm text-slate-500 font-medium">
            Entrez le code de sécurité envoyé à <br/>
            <span className="text-vp-navy font-bold italic">{email || 'votre adresse email'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Code de sécurité</label>
            <input 
              {...register('code', { required: 'Le code est requis', minLength: { value: 6, message: 'Code incomplet' } })}
              type="text"
              placeholder="0 0 0 0 0 0"
              className="w-full h-14 px-6 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 transition-all outline-none text-center text-2xl font-black tracking-[0.5em] placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-300"
            />
            {errors.code && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-2 ml-1">{errors.code.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full btn-primary h-14 flex items-center justify-center gap-3 shadow-xl shadow-vp-cyan/20"
          >
            {mutation.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Validation...
              </>
            ) : 'Vérifier mon compte'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Pas reçu le code ?</p>
          <div className="flex gap-4">
            <button className="text-[10px] font-black text-vp-cyan hover:underline uppercase tracking-tighter">Renvoyer le code</button>
            <Link to="/register" className="text-[10px] font-black text-slate-400 hover:text-vp-navy transition-colors uppercase tracking-tighter">Modifier l'email</Link>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center relative z-10">
        <Link to="/login" className="text-xs font-bold text-slate-400 hover:text-vp-navy transition-all flex items-center gap-2">
           <span>← Bureau de connexion</span>
        </Link>
      </div>
    </div>
  );
}
