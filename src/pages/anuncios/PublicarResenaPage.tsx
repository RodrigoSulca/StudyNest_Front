import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Rol } from '../../types/usuario.types';
import { createResena } from '../../services/resenas.service';
import { FormularioResena } from '../../components/resenas/FormularioResena';
import { Alert } from '../../components/ui/Alert';

export default function PublicarResenaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!id) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Alert type="error" message="No listing specified." />
      </div>
    );
  }

  if (user && user.rol !== Rol.ESTUDIANTE) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Alert type="error" message="Only students can write reviews." />
        <Link
          to={`/anuncios/${id}`}
          className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Back to listing
        </Link>
      </div>
    );
  }

  const handleSubmit = async (data: {
    alojamiento_id: string;
    calificacion: number;
    comentario: string;
  }) => {
    setIsLoading(true);
    setError('');
    try {
      await createResena(data);
      navigate(`/anuncios/${id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to submit review.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={`/anuncios/${id}`}
        className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        &larr; Back to listing
      </Link>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-gray-900">Write a Review</h1>

        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        <FormularioResena
          alojamientoId={id}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/anuncios/${id}`)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
