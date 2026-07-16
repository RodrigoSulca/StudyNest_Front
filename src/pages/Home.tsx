import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Rol } from '../types/usuario.types';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900">
        Welcome to <span className="text-indigo-600">StudyNest</span>
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Find your perfect student housing
      </p>

      {isAuthenticated && user ? (
        <div className="mt-8 space-y-4">
          <p className="text-gray-700">
            Hello, <span className="font-semibold">{user.nombre}</span>!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {user.rol === Rol.ESTUDIANTE && (
              <Link
                to="/"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Search Listings
              </Link>
            )}
            {user.rol === Rol.ARRENDADOR && (
              <Link
                to="/"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Create Listing
              </Link>
            )}
            <Link
              to="/perfil"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View Profile
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/registrar"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}
