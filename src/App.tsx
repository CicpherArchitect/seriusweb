import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Features from './pages/Features';
import Login from './pages/Login';
import Demo from './pages/Demo';
import IncidentDetails from './pages/IncidentDetails';
import NetworkResponse from './pages/NetworkResponse';
import CloudScanning from './pages/CloudScanning';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<Features />} />
            <Route path="/login" element={<Login />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/incidents/:id" element={<IncidentDetails />} />
            <Route path="/network-response" element={<NetworkResponse />} />
            <Route path="/cloud-scanning" element={<CloudScanning />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;