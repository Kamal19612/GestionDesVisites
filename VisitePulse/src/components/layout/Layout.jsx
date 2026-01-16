import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useAuth from '../../auth/useAuth';
import Loader from '../ui/Loader';

const Layout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
