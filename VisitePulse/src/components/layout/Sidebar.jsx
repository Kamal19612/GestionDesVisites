import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../auth/useAuth';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ShieldAlert, 
  ClipboardList 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const getLinks = (role) => {
    switch (role) {
      case 'ADMIN':
        return [
          { to: '/admin', icon: LayoutDashboard, label: t('dashboard.admin') },
          { to: '/admin/users', icon: Users, label: t('nav.users') },
          { to: '/stats', icon: ClipboardList, label: "Statistiques" } // Assuming stats route
        ];
      case 'AGENT':
        return [
          { to: '/agent', icon: ShieldAlert, label: t('dashboard.agent') },
          { to: '/agent/appointments', icon: Calendar, label: "Rendez-vous Jour" }
        ];
      case 'EMPLOYE':
        return [
          { to: '/employe', icon: Calendar, label: t('dashboard.employee') }
        ];
      case 'VISITOR':
        return [
          { to: '/visiteur', icon: Calendar, label: t('dashboard.visitor') },
          { to: '/visiteur/new', icon: ClipboardList, label: "Nouveau RDV" }
        ];
      case 'SECRETAIRE': // Adding Secretary based on codebase knowledge
         return [
           { to: '/secretaire', icon: ClipboardList, label: "Gestion Demandes" }
         ];
      default:
        return [];
    }
  };

  const links = user ? getLinks(user.role) : [];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 h-full flex flex-col">
      <div className="flex-1 py-6">
        <ul className="space-y-1 px-3">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'} // Exact match for root routes
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <link.icon size={20} />
                <span className="font-medium text-sm">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-slate-800">
         <p className="text-xs text-center text-slate-500">© 2024 VisitePulse v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
