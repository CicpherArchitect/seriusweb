import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Features from './pages/Features';
import Login from './pages/Login';
import Demo from './pages/Demo';
import Dashboard from './pages/Dashboard';
import IncidentDetails from './pages/IncidentDetails';
import NetworkResponse from './pages/NetworkResponse';
import CloudScanning from './pages/CloudScanning';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
            <Route path="/features" element={<Features />} />
            <Route path="/login" element={<Login />} />
            <Route path="/demo" element={<Demo />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/incidents/:id" 
              element={
                <ProtectedRoute>
                  <IncidentDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/network-response" 
              element={
                <ProtectedRoute>
                  <NetworkResponse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cloud-scanning" 
              element={
                <ProtectedRoute>
                  <CloudScanning />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWrapper;