import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import Home from '../pages/Home';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import LogoutPage from '../pages/auth/LogoutPage';
import ProfilePage from '../pages/profile/ProfilePage';
import EditProfilePage from '../pages/profile/EditProfilePage';
import BuscarPage from '../pages/anuncios/BuscarPage';
import DetallePage from '../pages/anuncios/DetallePage';
import PublicarPage from '../pages/anuncios/PublicarPage';
import MisAnunciosPage from '../pages/anuncios/MisAnunciosPage';
import EditarAnuncioPage from '../pages/anuncios/EditarAnuncioPage';
import NotFound from '../pages/NotFound';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrar" element={<RegisterPage />} />

        {/* Public anuncios routes */}
        <Route path="/anuncios" element={<BuscarPage />} />
        <Route path="/anuncios/:id" element={<DetallePage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cerrar-sesion" element={<LogoutPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/perfil/editar" element={<EditProfilePage />} />

          {/* Protected anuncios routes (arrendador) */}
          <Route path="/anuncios/publicar" element={<PublicarPage />} />
          <Route path="/anuncios/mis-anuncios" element={<MisAnunciosPage />} />
          <Route path="/anuncios/:id/editar" element={<EditarAnuncioPage />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
