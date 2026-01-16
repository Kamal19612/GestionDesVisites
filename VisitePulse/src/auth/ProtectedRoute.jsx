import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from './useAuth';
import Loader from '../components/ui/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen />;
  }

  // Si pas d'utilisateur connecté -> Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si rôle spécifié mais utilisateur n'a pas le bon rôle -> Redirection Dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleDashboardMap = {
      'ADMIN': '/admin',
      'AGENT': '/agent',
      'EMPLOYE': '/employe',
      'VISITEUR': '/visiteur',
      'SECRETAIRE': '/secretaire'
    };
    
    // Redirige vers son propre dashboard, ou home si inconnu
    return <Navigate to={roleDashboardMap[user.role] || '/'} replace />;
  }

  // Autorisé
  return children;
};

export default ProtectedRoute;
