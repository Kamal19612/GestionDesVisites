import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';

import settingsService from './services/settingsService';
import { useQuery } from '@tanstack/react-query';

function App() {
  const navigate = useNavigate();

  const { data: settings } = useQuery({
    queryKey: ['publicSettings'],
    queryFn: settingsService.getPublicSettings,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false
  });

  return (
    <div className="min-h-screen flex flex-col selection:bg-vp-cyan/30">
      <AppHeader organizationName={settings?.organizationName} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vp-cyan/10 border border-vp-cyan/20 mb-6 group cursor-default hover:bg-vp-cyan/20 transition-colors duration-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vp-mint opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-vp-mint"></span>
                  </span>
                  <span className="text-xs font-bold text-vp-cyan uppercase tracking-wider">Solution Intelligente de Gestion</span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-vp-navy mb-6 tracking-tight leading-[1.1]">
                  {settings?.welcomeTitle || "L'accueil de vos"} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-vp-cyan to-vp-mint animate-gradient bg-300%">
                    {settings?.welcomeSubtitle || "visiteurs réinventé"}
                  </span>
                </h1>
                
                <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {settings?.welcomeDescription || "Optimisez la gestion de vos flux, renforcez la sécurité de vos locaux et offrez une expérience premium dès l'entrée de vos bâtiments."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => navigate('/auth/register')}
                    className="btn-primary text-base px-8 py-3 shadow-lg shadow-vp-cyan/20 hover:shadow-vp-cyan/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    Démarrer gratuitement
                  </button>
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="px-8 py-3 text-base font-semibold text-slate-600 hover:text-vp-navy transition-colors flex items-center justify-center gap-2 group"
                  >
                    Se connecter <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </button>
                </div>
              </div>

              {/* Right Illustration/Mockup */}
              <div className="flex-1 relative animate-float-slow">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-vp-cyan/20 to-vp-mint/20 rounded-full blur-3xl opacity-50"></div>
                <div className="relative card p-4 max-w-lg mx-auto shadow-2xl shadow-vp-navy/10 border border-white/50 backdrop-blur-sm">
                  <div className="bg-vp-navy rounded-2xl p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                      </div>
                      <div className="h-4 w-32 bg-white/10 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Animated Mockup Elements */}
                      <div className="h-12 bg-white/5 rounded-xl flex items-center px-4 gap-3 transform hover:scale-[1.02] transition-transform duration-300 cursor-default border border-transparent hover:border-white/10">
                        <div className="w-6 h-6 rounded-md bg-vp-cyan/30"></div>
                        <div className="h-3 w-40 bg-white/10 rounded-full"></div>
                      </div>
                      <div className="h-12 bg-white/5 rounded-xl flex items-center px-4 gap-3 transform hover:scale-[1.02] transition-transform duration-300 cursor-default border border-transparent hover:border-white/10 delay-75">
                        <div className="w-6 h-6 rounded-md bg-vp-mint/30"></div>
                        <div className="h-3 w-32 bg-white/10 rounded-full"></div>
                      </div>
                      <div className="h-32 bg-gradient-to-br from-vp-cyan/20 to-transparent rounded-xl p-4 mt-6 border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-white/20"></div>
                          <div className="space-y-1.5">
                            <div className="h-2 w-20 bg-white/20 rounded-full"></div>
                            <div className="h-2 w-12 bg-white/10 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-end gap-1 px-2 h-16">
                            <div className="w-2 bg-white/10 rounded-t-full h-[40%] animate-bar-grow" style={{animationDelay: '0ms'}}></div>
                            <div className="w-2 bg-white/20 rounded-t-full h-[70%] animate-bar-grow" style={{animationDelay: '100ms'}}></div>
                            <div className="w-2 bg-white/10 rounded-t-full h-[50%] animate-bar-grow" style={{animationDelay: '200ms'}}></div>
                            <div className="w-2 bg-vp-mint/50 rounded-t-full h-[90%] animate-bar-grow" style={{animationDelay: '300ms'}}></div>
                            <div className="w-2 bg-white/10 rounded-t-full h-[60%] animate-bar-grow" style={{animationDelay: '400ms'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements with faster/different animations */}
                <div className="absolute top-10 -right-4 card p-4 animate-float [animation-delay:-2s] hover:scale-110 transition-transform cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="bg-vp-mint/20 p-2 rounded-lg">
                        <span className="text-vp-mint">🛡️</span>
                      </div>
                      <div className="text-xs font-bold text-vp-navy uppercase">Sécurité Active</div>
                   </div>
                </div>
                <div className="absolute -bottom-6 -left-4 card p-4 animate-float [animation-delay:-4s] hover:scale-110 transition-transform cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="bg-vp-cyan/20 p-2 rounded-lg">
                        <span className="text-vp-cyan">📅</span>
                      </div>
                      <div className="text-xs font-bold text-vp-navy uppercase">Rendez-vous OK</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-vp-navy mb-4">Une solution complète pour votre sécurité</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">VisitePulse transforme la gestion de votre accueil avec des outils puissants et intuitifs.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {[
                { title: "Suivi Temps Réel", desc: "Sachez exactement qui est sur site à tout moment grâce au tableau de bord en direct.", icon: "⏱️" },
                { title: "Notifications Auto", desc: "Vos employés sont notifiés instantanément par email ou SMS de l'arrivée de leurs visiteurs.", icon: "🔔" },
                { title: "Kiosque d'Accueil", desc: "Fluidifiez les entrées avec un mode borne autonome pour l'enregistrement rapide.", icon: "🖥️" },
                { title: "Analyses Précises", desc: "Comprenez les flux de visites avec des rapports détaillés et exportables.", icon: "📊" }
              ].map((feature, i) => (
                <div key={i} className="card p-6 border border-slate-100/50 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-vp-cyan/10 hover:border-vp-cyan/20 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-vp-navy mb-2 group-hover:text-vp-cyan transition-colors">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium group-hover:text-slate-600">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <AppFooter 
        organizationName={settings?.organizationName} 
        copyrightText={settings?.copyrightText}
        supportContact={settings?.supportContact}
        helpCenterUrl={settings?.helpCenterUrl}
      />
    </div>
  );
}

export default App;
