import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-300" />
              <span className="ml-2 text-white text-xl font-bold">Serius.io</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to="/features" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Features
              </Link>
              <Link to="/demo" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Demo
              </Link>
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-400"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-400">
                  Sign In
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-indigo-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link to="/features" className="text-indigo-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Features
            </Link>
            <Link to="/demo" className="text-indigo-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Demo
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left bg-indigo-500 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-400"
              >
                Sign Out
              </button>
            ) : (
              <Link to="/login" className="bg-indigo-500 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-400">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;