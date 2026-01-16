import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col selection:bg-vp-cyan/30">
      <AppHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vp-cyan/10 border border-vp-cyan/20 mb-6 group cursor-default">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vp-mint opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-vp-mint"></span>
                  </span>
                  <span className="text-xs font-bold text-vp-cyan uppercase tracking-wider">Solution Intelligente de Gestion</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-vp-navy mb-6 tracking-tight leading-[1.1]">
                  L'accueil de vos <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-vp-cyan to-vp-mint">
                    visiteurs réinventé
                  </span>
                </h1>
                
                <p className="text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
                  Optimisez la gestion de vos flux, renforcez la sécurité de vos locaux 
                  et offrez une expérience premium dès l'entrée de vos bâtiments.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => navigate('/auth/register')}
                    className="btn-primary text-lg px-8 py-4"
                  >
                    Démarrer gratuitement
                  </button>
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="px-8 py-4 text-lg font-semibold text-slate-600 hover:text-vp-navy transition-colors flex items-center justify-center gap-2 group"
                  >
                    Se connecter <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>

              {/* Right Illustration/Mockup */}
              <div className="flex-1 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-vp-cyan/20 to-vp-mint/20 rounded-full blur-3xl opacity-50"></div>
                <div className="relative card p-4 max-w-lg mx-auto animate-float">
                  <div className="bg-vp-navy rounded-2xl p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                      </div>
                      <div className="h-4 w-32 bg-white/10 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="h-12 bg-white/5 rounded-xl flex items-center px-4 gap-3">
                        <div className="w-6 h-6 rounded-md bg-vp-cyan/30"></div>
                        <div className="h-3 w-40 bg-white/10 rounded-full"></div>
                      </div>
                      <div className="h-12 bg-white/5 rounded-xl flex items-center px-4 gap-3">
                        <div className="w-6 h-6 rounded-md bg-vp-mint/30"></div>
                        <div className="h-3 w-32 bg-white/10 rounded-full"></div>
                      </div>
                      <div className="h-32 bg-gradient-to-br from-vp-cyan/20 to-transparent rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-white/20"></div>
                          <div className="space-y-1.5">
                            <div className="h-2 w-20 bg-white/20 rounded-full"></div>
                            <div className="h-2 w-12 bg-white/10 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="h-12 w-2 bg-white/10 rounded-t-full"></div>
                            <div className="h-16 w-2 bg-white/20 rounded-t-full"></div>
                            <div className="h-8 w-2 bg-white/10 rounded-t-full"></div>
                            <div className="h-20 w-2 bg-vp-mint/50 rounded-t-full"></div>
                            <div className="h-14 w-2 bg-white/10 rounded-t-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-10 -right-4 card p-4 animate-float [animation-delay:-2s]">
                   <div className="flex items-center gap-3">
                      <div className="bg-vp-mint/20 p-2 rounded-lg">
                        <span className="text-vp-mint">🛡️</span>
                      </div>
                      <div className="text-xs font-bold text-vp-navy uppercase">Sécurité Active</div>
                   </div>
                </div>
                <div className="absolute -bottom-6 -left-4 card p-4 animate-float [animation-delay:-4s]">
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
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-vp-navy mb-4">Conçu pour chaque collaborateur</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Une plateforme personnalisée selon les rôles pour une efficacité maximale.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Agents de Sécurité", desc: "Enregistrement rapide, vérification des accès et gestion des sorties.", icon: "👮" },
                { title: "Secrétaires", desc: "Planification simplifiée et accueil chaleureux des invités.", icon: "🧑‍💻" },
                { title: "Administrateurs", desc: "Statistiques détaillées et configuration complète du système.", icon: "📊" }
              ].map((feature, i) => (
                <div key={i} className="card group hover:-translate-y-2">
                  <div className="text-4xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-vp-navy mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-6">{feature.desc}</p>
                  <button className="text-vp-cyan font-bold text-sm uppercase tracking-wider group-hover:underline">
                    En savoir plus
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}

export default App;
