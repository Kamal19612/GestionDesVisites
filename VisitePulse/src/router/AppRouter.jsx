import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../auth/ProtectedRoute';
import Login from '../pages/Login';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AgentDashboard from '../pages/agent/AgentDashboard';
import EmployeDashboard from '../pages/employe/EmployeDashboard';
import VisiteurDashboard from '../pages/visiteur/VisiteurDashboard';
import SecretaireDashboard from '../pages/secretaire/SecretaireDashboard';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes wrapped in Layout */}
      <Route path="/" element={<Layout />}>
        {/* Default redirect based on role is handled by ProtectedRoute check or logic inside Login */}
        <Route index element={<Navigate to="/login" replace />} /> 

        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="agent" element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <AgentDashboard />
          </ProtectedRoute>
        } />

        <Route path="employe" element={
          <ProtectedRoute allowedRoles={['EMPLOYE']}>
            <EmployeDashboard />
          </ProtectedRoute>
        } />

        <Route path="visiteur" element={
          <ProtectedRoute allowedRoles={['VISITEUR']}>
             <VisiteurDashboard />
          </ProtectedRoute>
        } />

        <Route path="secretaire" element={
          <ProtectedRoute allowedRoles={['SECRETAIRE']}>
             <SecretaireDashboard />
          </ProtectedRoute>
        } />

         {/* Add specific routes for sub-pages here */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
