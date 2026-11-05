import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const roleHome = () => '/dashboard';

export default function RoleRoute({ roles, children }) {
  const { user, isBootstrapping, loading } = useAuth();

  // Auth Bootstrap: wait for server session probe before redirecting
  if (isBootstrapping || loading) {
    return (
      <div className="full-loader">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  return children;
}
