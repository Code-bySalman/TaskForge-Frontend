import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) return <Loading />;

  return user?.role === 'admin' ? children : null;
}
