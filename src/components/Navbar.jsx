import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white border-b border-border shadow-sm">
      <div className="container flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold">
          TaskForge
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm text-gray-400">
                {user.name} {user.role === 'admin' && '(Admin)'}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
