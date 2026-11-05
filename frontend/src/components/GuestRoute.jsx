import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GuestRoute({ children }) {
  const { user, isBootstrapping, loading } = useAuth();

  // Auth Bootstrap: while checking if HttpOnly session is active, show clean spinner
  if (isBootstrapping || loading) {
    return (
      <div className="full-loader">
        <div className="spinner" style={{ border: '2.5px solid var(--border)', borderTopColor: 'var(--primary)' }} />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
