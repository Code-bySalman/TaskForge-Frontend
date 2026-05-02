import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-light border-r border-border min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-primary mb-2">Menu</h2>
      </div>

      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className="block px-4 py-2 rounded-lg text-primary hover:bg-white transition-colors"
        >
          Dashboard
        </Link>

        <Link
          to="/projects"
          className="block px-4 py-2 rounded-lg text-primary hover:bg-white transition-colors"
        >
          Projects
        </Link>

        {user?.role === 'admin' && (
          <>
            <Link
              to="/projects/create"
              className="block px-4 py-2 rounded-lg text-primary hover:bg-white transition-colors"
            >
              Create Project
            </Link>
            <Link
              to="/users"
              className="block px-4 py-2 rounded-lg text-primary hover:bg-white transition-colors"
            >
              Manage Users
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
