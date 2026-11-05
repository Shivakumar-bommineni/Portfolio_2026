import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, isBootstrapping, loading } = useAuth();

  // Push history entry so browser back button stays on protected pages
  useEffect(() => {
    if (!user) return;
    window.history.pushState(null, '', window.location.href);
    const block = () => window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', block);
    return () => window.removeEventListener('popstate', block);
  }, [user]);

  // Auth Bootstrap: while probing /api/auth/me with HttpOnly cookies, show loader
  if (isBootstrapping || loading) {
    return (
      <div className="full-loader">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
