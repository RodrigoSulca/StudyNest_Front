import { useAuth } from '../../hooks/useAuth';
import { Rol } from '../../types/usuario.types';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-gray-900">{user.nombre}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-gray-900">{user.correo}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Role</label>
            <span className="mt-1 inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-sm font-medium text-indigo-700 capitalize">
              {user.rol === Rol.ARRENDADOR ? 'Landlord' : user.rol === Rol.ADMIN ? 'Admin' : 'Student'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Member Since</label>
            <p className="mt-1 text-gray-900">
              {new Date(user.fecha_registro).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="/perfil/editar"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Edit Profile
          </a>
        </div>
      </div>
    </div>
  );
}
