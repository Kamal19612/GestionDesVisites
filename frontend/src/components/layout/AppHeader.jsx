import React from 'react';
import logo from '../../assets/logo.jpeg';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AppHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-vp-cyan to-vp-mint rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img src={logo} alt="VisitePulse" className="relative w-10 h-10 rounded-lg object-cover shadow-sm border border-white/50" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vp-navy to-vp-navy-light tracking-tight">
                VisitePulse
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {/* Optional: Add common nav links here if needed */}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Connecté en tant que</span>
                  <span className="text-sm font-bold text-vp-navy">{user.firstName || user.email}</span>
                </div>
                <button 
                  onClick={logout} 
                  className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-vp-navy transition-colors">
                  Connexion
                </Link>
                <Link to="/auth/register" className="btn-primary">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
