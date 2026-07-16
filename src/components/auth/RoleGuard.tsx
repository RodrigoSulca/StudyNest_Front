import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Rol } from '../../types/usuario.types';

interface RoleGuardProps {
  allowedRoles: Rol[];
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.rol)) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-600">
          You don't have permission to view this page.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return <Outlet />;
}
