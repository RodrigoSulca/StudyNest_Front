import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Rol } from '../../types/usuario.types';
import { useState } from 'react';
import { NotificationBell } from '../notifications/NotificationBell';

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          StudyNest
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/anuncios"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Search
          </Link>
          {isAuthenticated ? (
            <>
              {user?.rol === Rol.ARRENDADOR && (
                <>
                  <Link
                    to="/anuncios/publicar"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Publish
                  </Link>
                  <Link
                    to="/anuncios/mis-anuncios"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    My Listings
                  </Link>
                </>
              )}
              <NotificationBell />
              <span className="text-sm text-gray-600">
                {user?.nombre}
              </span>
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 capitalize">
                {user?.rol === Rol.ARRENDADOR ? 'Landlord' : user?.rol === Rol.ADMIN ? 'Admin' : 'Student'}
              </span>
              <Link
                to="/perfil"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Profile
              </Link>
              <Link
                to="/cerrar-sesion"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                to="/registrar"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="text-gray-600 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 px-4 py-3 md:hidden">
          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <Link
                to="/anuncios"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setMenuOpen(false)}
              >
                Search
              </Link>
              {user?.rol === Rol.ARRENDADOR && (
                <>
                  <Link
                    to="/anuncios/publicar"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    onClick={() => setMenuOpen(false)}
                  >
                    Publish
                  </Link>
                  <Link
                    to="/anuncios/mis-anuncios"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Listings
                  </Link>
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{user?.nombre}</span>
                <NotificationBell />
              </div>
              <span className="inline-block w-fit rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 capitalize">
                {user?.rol === Rol.ARRENDADOR ? 'Landlord' : user?.rol === Rol.ADMIN ? 'Admin' : 'Student'}
              </span>
              <Link
                to="/perfil"
                className="text-sm text-gray-600 hover:text-gray-900"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/cerrar-sesion"
                className="text-sm text-gray-600 hover:text-gray-900"
                onClick={() => setMenuOpen(false)}
              >
                Logout
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/anuncios"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/registrar"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
