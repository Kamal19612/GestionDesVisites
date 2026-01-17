import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import { useAuth } from '../hooks/useAuth';

export default function MainLayout({ children }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Determine home route based on user role
  const getHomeRoute = () => {
    if (!user) return '/';
    const role = typeof user.role === 'string' ? user.role : user.role?.name;
    switch (role) {
      case 'VISITEUR':
        return '/visitor/dashboard';
      case 'SECRETAIRE':
        return '/secretary/dashboard';
      case 'AGENT':
        return '/agent/dashboard';
      case 'EMPLOYE':
        return '/employee/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      {/* Dynamic Background Element */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-vp-navy/5 to-transparent pointer-events-none"></div>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        {/* Sidebar (Premium Design) */}
        <aside className="hidden md:flex flex-col w-64 mr-6">
          <div className="sticky top-6 h-[calc(100vh-8rem)] flex flex-col justify-between">
            <div className="space-y-6">
            {/* User Profile Card */}
            <div className="card p-5 border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-vp-cyan/5 blur-2xl -mr-12 -mt-12 group-hover:bg-vp-cyan/10 transition-colors"></div>
               {user ? (
                 <div className="flex items-center gap-4 relative z-10">
                   <div className="w-14 h-14 bg-gradient-to-tr from-vp-navy to-slate-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-vp-navy/20 uppercase">
                     {(user.firstName || user.email || '?')[0]}
                   </div>
                   <div>
                     <p className="font-black text-vp-navy text-base leading-tight">{user?.firstName || user?.email?.split('@')[0]}</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-vp-cyan mt-1">{user?.role?.replace('_', ' ')}</p>
                   </div>
                 </div>
               ) : (
                 <div className="text-center py-2">
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Portail Visiteur</p>
                   <Link to="/auth/login" className="btn-primary w-full py-3 inline-block">Se connecter</Link>
                 </div>
               )}
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-4">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 mb-2">Navigation Principale</p>
               <ul className="space-y-2">
                 {/* Shared Dashboard Link for all roles (dynamic destination) */}
                  <li>
                     <Link 
                       to={getHomeRoute()} 
                       className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
                         useLocation().pathname.includes('dashboard') 
                         ? 'font-bold text-vp-navy bg-slate-50' 
                         : 'hover:bg-white hover:shadow-lg text-slate-500'
                       }`}
                     >
                       <span className={`text-xl ${useLocation().pathname.includes('dashboard') ? 'scale-110' : 'group-hover:scale-110'}`}>📊</span>
                       <div className="flex flex-col">
                         <span className="text-sm">Dashboard</span>
                         <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Vue d'ensemble</span>
                       </div>
                     </Link>
                  </li>

                 {user && user.role === 'VISITEUR' && (
                   <li>
                     <Link 
                       to="/visitor/appointments/new" 
                       className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
                         useLocation().pathname.includes('/appointments/new') 
                         ? 'font-bold text-vp-navy bg-slate-50' 
                         : 'hover:bg-white hover:shadow-lg text-slate-500'
                       }`}
                     >
                       <span className="text-xl">➕</span>
                       <div className="flex flex-col">
                         <span className="text-sm">Planifier</span>
                         <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Nouveau RDV</span>
                       </div>
                     </Link>
                   </li>
                 )}
                 
                 {user && user.role === 'SECRETAIRE' && (
                   <>
                     <li>
                       <Link 
                         to="/secretary/appointments" 
                         className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
                           useLocation().pathname.includes('/secretary/appointments') 
                           ? 'font-bold text-vp-navy bg-slate-50' 
                           : 'hover:bg-white hover:shadow-lg text-slate-500'
                         }`}
                       >
                         <span className="text-xl">🗓️</span>
                         <div className="flex flex-col">
                           <span className="text-sm">Agenda</span>
                           <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Modération</span>
                         </div>
                       </Link>
                     </li>
                     <li>
                       <Link 
                         to="/secretary/visits/today" 
                         className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
                           useLocation().pathname.includes('/secretary/visits/today') 
                           ? 'font-bold text-vp-navy bg-slate-50' 
                           : 'hover:bg-white hover:shadow-lg text-slate-500'
                         }`}
                       >
                         <span className="text-xl">📋</span>
                         <div className="flex flex-col">
                           <span className="text-sm">Visites du Jour</span>
                           <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Suivi Accès</span>
                         </div>
                       </Link>
                     </li>
                     <li>
                       <Link 
                         to="/secretary/settings" 
                         className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
                           useLocation().pathname.includes('/secretary/settings') 
                           ? 'font-bold text-vp-navy bg-slate-50' 
                           : 'hover:bg-white hover:shadow-lg text-slate-500'
                         }`}
                       >
                         <span className="text-xl">⚙️</span>
                         <div className="flex flex-col">
                           <span className="text-sm">Paramètres</span>
                           <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Compte</span>
                         </div>
                       </Link>
                     </li>
                   </>
                 )}

                 {user && user.role === 'AGENT' && (
                   <>
                     <li>
                       <Link 
                         to="/agent/visit/record" 
                         className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
                           useLocation().pathname.includes('/agent/visit/record') 
                           ? 'font-bold text-vp-navy bg-slate-50' 
                           : 'hover:bg-white hover:shadow-lg text-slate-500'
                         }`}
                       >
                         <span className="text-xl">🚪</span>
                         <div className="flex flex-col">
                           <span className="text-sm">Entrées</span>
                           <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Check-in</span>
                         </div>
                       </Link>
                     </li>
                     <li>
                       <Link 
                         to="/agent/current-visitors" 
                         className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
                           useLocation().pathname.includes('/agent/current-visitors') 
                           ? 'font-bold text-vp-navy bg-slate-50' 
                           : 'hover:bg-white hover:shadow-lg text-slate-500'
                         }`}
                       >
                         <span className="text-xl relative">
                           👥
                           <span className="absolute -top-1 -right-1 w-2 h-2 bg-vp-mint rounded-full animate-ping"></span>
                         </span>
                         <div className="flex flex-col">
                           <span className="text-sm">Présents</span>
                           <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Sur site</span>
                         </div>
                       </Link>
                     </li>
                     <li className="pt-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 ml-4 mb-2">Archives</p>
                        <Link 
                          to="/agent/visit/history" 
                          className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
                            useLocation().pathname.includes('/agent/visit/history') 
                            ? 'font-bold text-vp-navy bg-slate-50' 
                            : 'hover:bg-white hover:shadow-lg text-slate-500'
                          }`}
                        >
                          <span className="text-xl">📜</span>
                          <div className="flex flex-col">
                            <span className="text-sm">Historique</span>
                            <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Régistre</span>
                          </div>
                        </Link>
                     </li>
                   </>
                 )}

                 {user && user.role === 'ADMIN' && (
                   <>
                   <li>
                     <Link 
                       to="/admin/users" 
                       className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
                         useLocation().pathname.includes('/admin/users') 
                         ? 'font-bold text-vp-navy bg-slate-50' 
                         : 'hover:bg-white hover:shadow-lg text-slate-500'
                       }`}
                     >
                       <span className="text-xl">👥</span>
                       <div className="flex flex-col">
                         <span className="text-sm">Utilisateurs</span>
                         <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Comptes</span>
                       </div>
                     </Link>
                   </li>
                   <li>
                     <Link 
                       to="/admin/statistics" 
                       className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
                         useLocation().pathname.includes('/admin/statistics') 
                         ? 'font-bold text-vp-navy bg-slate-50' 
                         : 'hover:bg-white hover:shadow-lg text-slate-500'
                       }`}
                     >
                       <span className="text-xl">📈</span>
                       <div className="flex flex-col">
                         <span className="text-sm">Statistiques</span>
                         <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Rapports</span>
                       </div>
                     </Link>
                   </li>
                   <li>
                     <Link 
                       to="/admin/settings" 
                       className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
                         useLocation().pathname.includes('/admin/settings') 
                         ? 'font-bold text-vp-navy bg-slate-50' 
                         : 'hover:bg-white hover:shadow-lg text-slate-500'
                       }`}
                     >
                       <span className={`text-xl ${useLocation().pathname.includes('/admin/settings') ? 'scale-110' : 'group-hover:scale-110'}`}>⚙️</span>
                       <div className="flex flex-col">
                         <span className="text-sm">Préférences</span>
                         <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Système</span>
                       </div>
                     </Link>
                   </li>
                   </>
                 )}
               </ul>
            </nav>
            </div>

            {/* Logout Action */}

          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1">
          {children || <Outlet />}
        </main>
      </div>

      <AppFooter />
    </div>
  );
}
