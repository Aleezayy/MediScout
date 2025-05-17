import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Home, BarChart3, MapPin as MapIcon, Users, Activity, LogIn, LogOut, UserPlus, ClipboardX as ClipboardPlus, ShieldCheck } from 'lucide-react';
import DashboardPage from '@/pages/DashboardPage';
import DataExplorerPage from '@/pages/DataExplorerPage';
import VisualizationsPage from '@/pages/VisualizationsPage';
import ImpactAnalysisPage from '@/pages/ImpactAnalysisPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import PatientDashboardPage from '@/pages/PatientDashboardPage';
import HealthDataFormPage from '@/pages/HealthDataFormPage';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children ? children : <Outlet />;
};

const PublicOnlyRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to="/patient/dashboard" replace />;
  }
  return children ? children : <Outlet />;
}

const AppContent = () => {
  const { currentUser, logout } = useAuth();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group
    ${isActive
      ? 'bg-primary/10 text-primary shadow-md scale-105 border border-primary/30'
      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
    }`;
  
  const SidebarLink = ({ to, icon: Icon, label }) => (
     <NavLink to={to} className={navLinkClasses}>
        <Icon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" /> {label}
      </NavLink>
  );

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-72 p-6 space-y-4 bg-card shadow-xl flex flex-col border-r border-border">
        <Link to={currentUser ? "/patient/dashboard" : "/"} className="flex items-center space-x-3 group mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <ShieldCheck className="h-10 w-10 text-primary group-hover:animate-pulse" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
            MediScout
          </h1>
        </Link>
        
        <nav className="flex-grow space-y-2.5">
          {currentUser ? (
            <>
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient Menu</p>
              <SidebarLink to="/patient/dashboard" icon={Home} label="My Dashboard" />
              <SidebarLink to="/patient/new-entry" icon={ClipboardPlus} label="New Health Entry" />
              <p className="px-4 pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Health Worker Tools</p>
              <SidebarLink to="/admin/dashboard" icon={Activity} label="Analytics Dashboard" />
              <SidebarLink to="/admin/explore" icon={Users} label="Community Data" />
              <SidebarLink to="/admin/visualize" icon={BarChart3} label="Data Visualizations" />
              <SidebarLink to="/admin/impact" icon={MapIcon} label="Impact & Map" />
            </>
          ) : (
            <>
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Health Worker Tools</p>
              <SidebarLink to="/admin/dashboard" icon={Activity} label="Analytics Dashboard" />
              <SidebarLink to="/admin/explore" icon={Users} label="Community Data" />
              <SidebarLink to="/admin/visualize" icon={BarChart3} label="Data Visualizations" />
              <SidebarLink to="/admin/impact" icon={MapIcon} label="Impact & Map" />
            </>
          )}
        </nav>

        <div className="mt-auto space-y-2.5">
            <hr className="border-border/50 my-2"/>
          {currentUser ? (
            <Button onClick={logout} variant="outline" className="w-full justify-start text-muted-foreground hover:text-destructive hover:border-destructive/50">
              <LogOut className="mr-3 h-5 w-5" /> Logout
            </Button>
          ) : (
            <>
              <SidebarLink to="/login" icon={LogIn} label="Patient Login" />
              <SidebarLink to="/register" icon={UserPlus} label="Patient Register" />
            </>
          )}
          <p className="text-xs text-muted-foreground/70 text-center pt-2">MediScout v0.2.0</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-900/50">
        <Routes>
          {/* Public Routes for Health Workers (Admin analitycs) */}
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/explore" element={<DataExplorerPage />} />
          <Route path="/admin/visualize" element={<VisualizationsPage />} />
          <Route path="/admin/impact" element={<ImpactAnalysisPage />} />
          
          {/* Auth Routes */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Patient Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
            <Route path="/patient/new-entry" element={<HealthDataFormPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to={currentUser ? "/patient/dashboard" : "/admin/dashboard"} />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;