import React, { useState, useLayoutEffect, useRef, useReducer } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import authService from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/Form/Input'

export default function Login() {
  const { register, handleSubmit } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')
  const [successMessage, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'SET':
        return action.payload
      case 'CLEAR':
        return ''
      default:
        return state
    }
  }, '')
  const [attemptCount, setAttemptCount] = useState(0)

  const timeoutRef = useRef(null)

  useLayoutEffect(() => {
    if (location.state?.message) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      dispatch({ type: 'SET', payload: location.state.message })
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    }
  }, [location.state?.message])

  const mutation = useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: async (res) => {
      localStorage.setItem('token', res.data.token)
      const userObj = res.data.user || res.data
      if (userObj) {
        localStorage.setItem('user', JSON.stringify(userObj))
      }
      await login(userObj || {})
      setAttemptCount(0)
      const role = userObj?.role?.name || userObj?.role || null
      if (role === 'ADMIN') navigate('/admin/dashboard')
      else if (role === 'SECRETAIRE') navigate('/secretary/dashboard')
      else if (role === 'AGENT') navigate('/agent/dashboard')
      else if (role === 'EMPLOYE') navigate('/employee/dashboard')
      else navigate('/visitor')
    },
    onError: (err) => {
      const newCount = attemptCount + 1
      setAttemptCount(newCount)
      const msg = err?.response?.data?.error || 'E-mail ou mot de passe incorrect'
      setServerError(msg)
      if (newCount >= 3) {
        setServerError(msg + ' — Administrateur averti après 3 tentatives échouées')
      }
    }
  })

  const onSubmit = (data) => {
    if (!data.email || !data.password) {
      setServerError('Veuillez remplir tous les champs')
      return
    }
    setServerError('')
    mutation.mutate(data)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-[1100px] flex flex-col md:flex-row card overflow-hidden p-0 gap-0">
        {/* Left Side: Illustration & Branding */}
        <div className="hidden md:flex flex-1 bg-vp-navy p-12 flex-col justify-between relative overflow-hidden text-white border-r border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-vp-cyan/20 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-vp-mint/10 blur-[80px] -ml-24 -mb-24 rounded-full"></div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vp-cyan to-vp-mint inline-block mb-12">
              VisitePulse
            </h1>
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Ravi de vous revoir !</h2>
            <p className="text-white/60 text-lg max-w-sm">
              Connectez-vous pour accéder à votre tableau de bord et gérer vos visites en toute simplicité.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-8 md:p-16 bg-white flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10">
              <h3 className="text-3xl font-heavy text-vp-navy mb-2">Connexion</h3>
              <p className="text-slate-500">Saisissez vos identifiants ci-dessous</p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-vp-mint/10 border border-vp-mint/20 text-vp-mint rounded-2xl flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
            )}

            {serverError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 animate-shake">
                <span className="text-xl">⚠️</span>
                <span className="text-sm font-medium">{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Input 
                  label="E-mail" 
                  name="email" 
                  register={register} 
                  placeholder="nom@exemple.com"
                  className="rounded-xl border-slate-200 focus:border-vp-cyan focus:ring-vp-cyan/20 h-12"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between px-1">
                  <label className="text-sm font-semibold text-vp-navy">Mot de passe</label>
                  <Link to="/auth/forgot-password" title="Bientôt disponible" className="text-xs font-semibold text-vp-cyan hover:underline">Oublié ?</Link>
                </div>
                <Input 
                  name="password" 
                  type="password" 
                  register={register} 
                  placeholder="••••••••"
                  className="rounded-xl border-slate-200 focus:border-vp-cyan focus:ring-vp-cyan/20 h-12"
                />
              </div>

              <button 
                type="submit" 
                disabled={mutation.isPending}
                className="w-full btn-primary h-14 text-base"
              >
                {mutation.isPending ? 'Chargement...' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col gap-4 text-center">
              <p className="text-sm text-slate-500">
                Pas encore de compte ?{' '}
                <Link to="/auth/register" className="text-vp-cyan font-bold hover:underline italic">Créer un compte</Link>
              </p>
              <Link to="/" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-vp-navy transition-colors items-center gap-2 flex justify-center">
                <span>←</span> Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
