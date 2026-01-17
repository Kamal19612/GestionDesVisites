import React from 'react';
import { Link } from 'react-router-dom';

export default function AppFooter({ organizationName, copyrightText, supportContact, helpCenterUrl }) {
  return (
    <footer className="bg-vp-navy text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-vp-cyan to-vp-mint">
              {organizationName || 'VisitePulse'}
            </h3>
            <p className="text-slate-400 max-w-sm">
              La solution intelligente pour la gestion des flux de visiteurs en entreprise. 
              Sécurité, efficacité et accueil premium réunis dans une plateforme unique.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-slate-200">Navigation</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/" className="hover:text-vp-cyan transition-colors">Accueil</Link></li>
              <li><Link to="/auth/login" className="hover:text-vp-cyan transition-colors">Connexion</Link></li>
              <li><Link to="/auth/register" className="hover:text-vp-cyan transition-colors">Inscription</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-200">Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a 
                  href={helpCenterUrl || "#"} 
                  target={helpCenterUrl ? "_blank" : undefined}
                  rel={helpCenterUrl ? "noopener noreferrer" : undefined}
                  className="hover:text-vp-cyan transition-colors"
                >
                  Centre d'aide
                </a>
              </li>
              <li><Link to="/documentation" className="hover:text-vp-cyan transition-colors">Documentation</Link></li>
              <li>
                  <a 
                    href={supportContact ? (supportContact.includes('@') ? `mailto:${supportContact}` : supportContact) : "#"} 
                    className="hover:text-vp-cyan transition-colors"
                  >
                    Contact
                  </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            {copyrightText || `© ${new Date().getFullYear()} NativIA — VisitePulse. Tous droits réservés.`}
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
