import React from 'react';
import { Link } from 'react-router-dom';

export default function Documentation() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Header simplified */}
      <header className="bg-vp-navy text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-vp-cyan">VisitePulse Docs</Link>
            <Link to="/" className="text-sm text-slate-300 hover:text-white transition-colors">Retour à l'accueil</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 flex-grow">
          <div className="prose prose-slate max-w-none">
              <h1 className="text-4xl font-bold text-vp-navy mb-8">Documentation Utilisateur</h1>
              
              <div className="card p-8 bg-white border-none shadow-xl shadow-slate-200/50 mb-8">
                  <h2 className="text-2xl font-bold text-vp-navy mb-4"> 👋 Introduction</h2>
                  <p className="text-slate-600">
                      Bienvenue sur la documentation de VisitePulse. Cette plateforme permet une gestion fluide et sécurisée des visiteurs, 
                      de la prise de rendez-vous jusqu'au départ du site.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-6 bg-white border-l-4 border-vp-cyan shadow-sm">
                      <h3 className="font-bold text-lg text-vp-navy mb-2">Pour les Visiteurs</h3>
                      <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
                          <li>Prendre rendez-vous en ligne</li>
                          <li>Recevoir un QR Code d'accès</li>
                          <li>S'enregistrer à l'accueil via borne</li>
                      </ul>
                  </div>
                   <div className="card p-6 bg-white border-l-4 border-vp-mint shadow-sm">
                      <h3 className="font-bold text-lg text-vp-navy mb-2">Pour les Employés</h3>
                      <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
                          <li>Consulter son planning du jour</li>
                          <li>Recevoir des notifications d'arrivée</li>
                          <li>Historique des visites reçues</li>
                      </ul>
                  </div>
              </div>

              <div className="mt-12 space-y-8">
                  <section>
                      <h2 className="text-2xl font-bold text-vp-navy mb-4">Flux de Visite</h2>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200">
                          <ol className="space-y-4">
                              <li className="flex gap-4">
                                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">1</span>
                                  <div>
                                      <span className="font-bold text-vp-navy">Planification</span>
                                      <p className="text-sm text-slate-500">Le visiteur ou l'hôte planifie la visite.</p>
                                  </div>
                              </li>
                              <li className="flex gap-4">
                                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">2</span>
                                  <div>
                                      <span className="font-bold text-vp-navy">Validation</span>
                                      <p className="text-sm text-slate-500">Le secrétariat valide la demande (si nécessaire).</p>
                                  </div>
                              </li>
                              <li className="flex gap-4">
                                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">3</span>
                                  <div>
                                      <span className="font-bold text-vp-navy">Accueil & Enregistrement</span>
                                      <p className="text-sm text-slate-500">L'agent de sécurité scanne le QR code ou enregistre le visiteur.</p>
                                  </div>
                              </li>
                          </ol>
                      </div>
                  </section>
              </div>

          </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
          <p>Besoin d'aide supplémentaire ? Contactez le support.</p>
      </footer>
    </div>
  );
}
