import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function RequireAuth({ roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
