import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Redirect to where they wanted to go, or root (which redirects to dashboard)
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const user = await login(email, password);
            
            // Automatic redirection based on role
            if (user?.role) {
                switch (user.role) {
                    case 'ADMIN':
                        navigate('/admin', { replace: true });
                        break;
                    case 'SECRETAIRE':
                        navigate('/secretaire', { replace: true });
                        break;
                    case 'AGENT':
                        navigate('/agent', { replace: true });
                        break;
                    case 'EMPLOYE':
                        navigate('/employe', { replace: true });
                        break;
                    case 'VISITEUR':
                        navigate('/visiteur', { replace: true });
                        break;
                    default:
                        navigate(from, { replace: true });
                }
            } else {
                navigate(from, { replace: true });
            }
        } catch (error) {
            // Handled by AuthContext toast
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Visite<span className="text-blue-500">Pulse</span></h1>
                    <p className="text-slate-400">Connectez-vous à votre espace</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                                placeholder="nom@entreprise.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Mot de passe</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                Se connecter <ArrowRight size={18} className="ml-2" />
                            </>
                        )}
                    </button>
                    
                    <div className="text-center mt-4">
                        <a href="#" className="text-sm text-blue-400 hover:text-blue-300">Mot de passe oublié ?</a>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
