import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../../services/authService'
import Input from '../../components/Form/Input'
import toast from 'react-hot-toast'

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = (data) => {
    const errs = {}
    if (!data.firstName?.trim()) errs.firstName = 'Le prénom est requis'
    if (!data.lastName?.trim()) errs.lastName = 'Le nom est requis'
    if (!data.email?.trim()) errs.email = 'L\'e-mail est requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Adresse e-mail invalide'
    if (!data.password?.trim()) errs.password = 'Le mot de passe est requis'
    else if (data.password.length < 6) errs.password = 'Au moins 6 caractères'
    if (data.password !== data.confirm) errs.confirm = 'Les mots de passe ne correspondent pas'
    return errs
  }

  const mutation = useMutation({
    mutationFn: (data) => authService.register({ 
      prenom: data.firstName, 
      nom: data.lastName, 
      email: data.email, 
      telephone: data.whatsapp || null,
      motDePasse: data.password
      // confirmPassword removed as backend doesn't expect it
    }),
    onSuccess: (res) => {
      setServerError('')
      const data = res.data;
      if (data.requiresVerification) {
          navigate('/auth/verify-email', { state: { email: watch('email'), message: 'Inscription réussie ! Veuillez vérifier votre email.' } })
      } else {
          toast.success('Compte créé avec succès ! Connectez-vous.');
          navigate('/auth/login', { state: { message: 'Inscription réussie ! Connectez-vous.' } })
      }
    },
    onError: (err) => {
      const data = err?.response?.data
      
      // Handle ValidationExceptionHandler map (fields -> messages)
      if (data && typeof data === 'object' && !data.error && !data.message) {
         const validationErrors = {}
         let hasFieldErrors = false
         
         Object.keys(data).forEach(key => {
             // Map backend field names to frontend if needed (they assume to match)
             if (['firstName', 'lastName', 'email', 'password', 'whatsapp'].includes(key)) {
                 validationErrors[key] = data[key]
                 hasFieldErrors = true
             }
         })

         if (hasFieldErrors) {
             setFieldErrors(validationErrors)
             setServerError('Veuillez corriger les erreurs indiquées ci-dessous.')
             return
         }
      }

      const errorMsg = data?.error || data?.message || 'Erreur lors de l\'inscription'
      setServerError(errorMsg)
    }
  })

  const onSubmit = (data) => {
    const errs = validate(data)
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})
    setServerError('')
    mutation.mutate(data)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-[1100px] flex flex-col md:flex-row card overflow-hidden p-0 gap-0">
        
        {/* Left Side: Illustration & Branding (Sync with Login) */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-vp-navy via-vp-navy to-[#0c1222] p-12 flex-col justify-between relative overflow-hidden text-white border-r border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-vp-cyan/20 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-vp-mint/10 blur-[80px] -ml-24 -mb-24 rounded-full"></div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vp-cyan to-vp-mint inline-block mb-12">
              VisitePulse
            </h1>
            <h2 className="text-4xl font-bold mb-6 tracking-tight leading-tight">Créez votre <br/>espace sécurisé</h2>
            <p className="text-white/60 text-lg max-w-sm leading-relaxed">
              Inscrivez-vous dès aujourd'hui pour transformer la gestion de vos visiteurs et moderniser votre accueil.
            </p>
          </div>

          <div className="relative z-10 mt-auto bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-vp-mint/20 flex items-center justify-center text-2xl">💎</div>
              <div>
                <p className="font-bold text-sm">Qualité Premium</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-[10px] text-vp-cyan">★</span>)}
                </div>
              </div>
            </div>
            <p className="text-sm text-white/50">Rejoignez plus de 10 000 utilisateurs satisfaits.</p>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 bg-white flex flex-col justify-center overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h3 className="text-3xl font-heavy text-vp-navy mb-2 leading-tight">Inscription</h3>
              <p className="text-slate-500">Créez votre compte en quelques secondes</p>
            </div>

            {serverError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 animate-shake">
                <span className="text-xl">⚠️</span>
                <span className="text-sm font-medium">{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="Prénom" 
                  name="firstName" 
                  register={register} 
                  error={fieldErrors.firstName}
                  className="rounded-xl border-slate-200 focus:border-vp-cyan focus:ring-vp-cyan/20 h-11"
                />
                <Input 
                  label="Nom" 
                  name="lastName" 
                  register={register} 
                  error={fieldErrors.lastName}
                  className="rounded-xl border-slate-200 focus:border-vp-cyan focus:ring-vp-cyan/20 h-11"
                />
              </div>

              <Input 
                label="E-mail" 
                name="email" 
                register={register} 
                error={fieldErrors.email}
                placeholder="nom@exemple.com"
                className="rounded-xl border-slate-200 focus:border-vp-cyan focus:ring-vp-cyan/20 h-11"
              />

              <Input 
                label="WhatsApp (optionnel)" 
                name="whatsapp" 
                register={register} 
                placeholder="+212 ..."
                className="rounded-xl border-slate-200 focus:border-vp-cyan focus:ring-vp-cyan/20 h-11"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="Mot de passe" 
                  name="password" 
                  type="password" 
                  register={register} 
                  error={fieldErrors.password}
                  placeholder="••••••••"
                  className="rounded-xl border-slate-200 focus:border-vp-cyan focus:ring-vp-cyan/20 h-11"
                />
                <Input 
                  label="Confirmer" 
                  name="confirm" 
                  type="password" 
                  register={register} 
                  error={fieldErrors.confirm}
                  placeholder="••••••••"
                  className="rounded-xl border-slate-200 focus:border-vp-cyan focus:ring-vp-cyan/20 h-11"
                />
              </div>

              <button 
                type="submit" 
                disabled={mutation.isPending}
                className="w-full btn-primary h-12 text-sm uppercase tracking-widest font-bold mt-4"
              >
                {mutation.isPending ? 'Création...' : 'S\'inscrire maintenant'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Vous avez déjà un compte ?{' '}
                <Link to="/auth/login" className="text-vp-cyan font-bold hover:underline italic">Se connecter</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
