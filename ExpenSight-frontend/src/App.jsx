import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Pages & Components
import LandingPage from './pages/LandingPage';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Upload from './pages/Upload';
import Reconcile from './pages/Reconcile';
import Settings from './pages/Settings';

// A new component to handle routing for logged-in users
const ProtectedRoute = () => {
  const { user } = useAuth();
  // If user is not logged in, redirect them to the landing page
  return user ? <MainLayout /> : <Navigate to="/" />;
};

// A new component to handle the root route
const Root = () => {
    const { user } = useAuth();
    // If user is logged in, go to dashboard. Otherwise, show landing page.
    return user ? <Navigate to="/dashboard" /> : <LandingPage />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* The root route is now handled by our new Root component */}
          <Route path="/" element={<Root />} />
          
          {/* All protected routes are nested here */}
          <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/reconcile" element={<Reconcile />} />
              <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* Fallback route, redirects to the main landing page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;