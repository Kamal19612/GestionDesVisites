import React from 'react';
import useAuth from '../../auth/useAuth';
import { useTranslation } from 'react-i18next';
import { LogOut, User, Globe } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shadow-md z-20">
      <div className="flex items-center text-white font-bold text-xl">
        <span className="text-blue-500 mr-2">Visite</span>Pulse
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={changeLanguage}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          title="Change language"
        >
          <Globe size={18} />
          <span className="uppercase text-sm">{i18n.language}</span>
        </button>

        {user && (
          <div className="flex items-center gap-4 border-l border-slate-700 pl-4 ml-2">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-white">{user.email}</span>
              <span className="text-xs text-slate-400 capitalize">{user.role}</span>
            </div>
            
            <button 
              onClick={logout}
              className="p-2 text-slate-300 hover:text-red-400 hover:bg-slate-700 rounded-full transition-colors"
              title={t('nav.logout')}
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
