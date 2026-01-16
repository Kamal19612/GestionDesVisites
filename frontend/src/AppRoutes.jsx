import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import App from './App';
import VisitorDashboard from './pages/visitor/VisitorDashboard';
import AppointmentRequest from './pages/visitor/AppointmentRequest';
import SecretaryDashboard from './pages/secretary/SecretaryDashboard';
import AppointmentList from './pages/secretary/AppointmentList';
import AppointmentDetails from './pages/secretary/AppointmentDetails';
import VisitsToday from './pages/secretary/VisitsToday';
import SecretarySettings from './pages/secretary/SecretarySettings';
import AgentDashboard from './pages/agent/AgentDashboard';
import OnsiteAppointment from './pages/agent/OnsiteAppointment';
import RecordVisitWithList from './pages/agent/RecordVisitWithList';
import AppointmentValidation from './pages/agent/AppointmentValidation';
import CurrentVisitors from './pages/agent/CurrentVisitors';
import VisitHistory from './pages/agent/VisitHistory';
import AdminDashboard from './pages/admin/AdminDashboard';
import StatisticsView from './pages/admin/StatisticsView';
import History from './pages/admin/statistics/History';
import AverageDuration from './pages/admin/statistics/AverageDuration';
import Departments from './pages/admin/statistics/Departments';
import DetailedReports from './pages/admin/statistics/DetailedReports';
import EmployeeDashboard from './pages/employe/EmployeeDashboard';
import EmployeeSchedule from './pages/employe/EmployeeSchedule';
import EmployeeAppointmentDetail from './pages/employe/EmployeeAppointmentDetail';
import UserManagement from './pages/admin/UserManagement';
import UserForm from './pages/admin/UserForm';
import SystemSettings from './pages/admin/SystemSettings';

const queryClient = new QueryClient();

// This component checks authentication and role, and renders MainLayout + children if authorized
function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    // Not authenticated, redirect to login
    return <Navigate to="/auth/login" replace />;
  }

  // Authenticated, now check roles if required
  // Normalize role: backend may return enum object or string. Support both.
  const resolvedRole = (() => {
    if (!user) return null;
    const r = user.role;
    if (!r) return null;
    if (typeof r === 'string') return r;
    if (typeof r === 'object' && r.name) return r.name;
    // Fallback to toString()
    try { return String(r); } catch { return null; }
  })();

  if (allowedRoles && resolvedRole && !allowedRoles.includes(resolvedRole)) {
    // User is authenticated but unauthorized role, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // Authenticated and authorized, render the MainLayout with the child route
  return (
    <MainLayout>
      <Outlet /> {/* This will render the specific page component (e.g., VisitorDashboard) */}
    </MainLayout>
  );
}

export default function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<App />} /> {/* Landing page or public home */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            <Route path="/unauthorized" element={
              <MainLayout>
                <div className="container mx-auto p-6 text-center">
                  <h1 className="text-3xl font-bold text-red-600 mb-4">Accès Non Autorisé</h1>
                  <p className="text-lg">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
                  <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">Retour à l'accueil</Link>
                </div>
              </MainLayout>
            } />

            {/* Protected Routes for Visitors */}
            <Route element={<ProtectedRoute allowedRoles={['VISITEUR']} />}>
              <Route path="/visitor" element={<VisitorDashboard />} />
              <Route path="/visitor/dashboard" element={<VisitorDashboard />} />
              <Route path="/visitor/appointments/new" element={<AppointmentRequest />} />
            </Route>

            {/* Protected Routes for Secretary */}
            <Route element={<ProtectedRoute allowedRoles={['SECRETAIRE']} />}>
              <Route path="/secretary/dashboard" element={<SecretaryDashboard />} />
              <Route path="/secretary/appointments" element={<AppointmentList />} />
              <Route path="/secretary/appointments/:id" element={<AppointmentDetails />} />
              <Route path="/secretary/visits/today" element={<VisitsToday />} />
              <Route path="/secretary/settings" element={<SecretarySettings />} />
            </Route>

            {/* Protected Routes for Security Agent */}
            <Route element={<ProtectedRoute allowedRoles={['AGENT_SECURITE']} />}>
              <Route path="/agent/dashboard" element={<AgentDashboard />} />
              <Route path="/agent/appointments/new-on-site" element={<OnsiteAppointment />} />
              <Route path="/agent/appointments/validate" element={<AppointmentValidation />} />
              <Route path="/agent/visit/record" element={<RecordVisitWithList />} />
              <Route path="/agent/current-visitors" element={<CurrentVisitors />} />
              <Route path="/agent/visit/history" element={<VisitHistory />} />
            </Route>

            {/* Protected Routes for Employee */}
            <Route element={<ProtectedRoute allowedRoles={['EMPLOYEUR']} />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/schedule" element={<EmployeeSchedule />} />
              <Route path="/employee/appointments/:id" element={<EmployeeAppointmentDetail />} />
            </Route>

            {/* Protected Routes for Admin */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/statistics" element={<StatisticsView />} />
              <Route path="/admin/statistics/history" element={<History />} />
              <Route path="/admin/statistics/average-duration" element={<AverageDuration />} />
              <Route path="/admin/statistics/departments" element={<Departments />} />
              <Route path="/admin/statistics/detailed-reports" element={<DetailedReports />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/users/new" element={<UserForm />} />
              <Route path="/admin/users/:id/edit" element={<UserForm />} />
              <Route path="/admin/settings" element={<SystemSettings />} /> {/* New route */}
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}