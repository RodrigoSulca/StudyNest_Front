import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Anuncio, EstadoAnuncio as EstadoAnuncioType } from '../../types/anuncio.types';
import { EstadoAnuncio } from '../../types/anuncio.types';
import { searchAnuncios, changeEstado, deleteAnuncio } from '../../services/anuncios.service';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const estadoStyles: Record<string, string> = {
  [EstadoAnuncio.BORRADOR]: 'bg-gray-100 text-gray-700',
  [EstadoAnuncio.ACTIVO]: 'bg-green-100 text-green-700',
  [EstadoAnuncio.INACTIVO]: 'bg-yellow-100 text-yellow-700',
  [EstadoAnuncio.SUSPENDIDO]: 'bg-red-100 text-red-700',
};

const estadoFilterOptions = [
  { value: '', label: 'All' },
  { value: EstadoAnuncio.BORRADOR, label: 'Draft' },
  { value: EstadoAnuncio.ACTIVO, label: 'Active' },
  { value: EstadoAnuncio.INACTIVO, label: 'Inactive' },
  { value: EstadoAnuncio.SUSPENDIDO, label: 'Suspended' },
];

export default function MisAnunciosPage() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [estadoFilter, setEstadoFilter] = useState('');

  const fetchMisAnuncios = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await searchAnuncios({
        limit: 100,
        ...(estadoFilter && { estado: estadoFilter }),
      });
      setAnuncios(response.anuncios);
    } catch {
      setError('Failed to load your listings.');
    } finally {
      setLoading(false);
    }
  }, [estadoFilter]);

  useEffect(() => {
    fetchMisAnuncios();
  }, [fetchMisAnuncios]);

  const handleToggleState = async (anuncio: Anuncio) => {
    setActionLoading(anuncio.id);
    setError('');
    setSuccess('');
    try {
      const newEstado: EstadoAnuncioType =
        anuncio.estado === EstadoAnuncio.ACTIVO
          ? EstadoAnuncio.INACTIVO
          : EstadoAnuncio.ACTIVO;
      const updated = await changeEstado(anuncio.id, newEstado);
      setAnuncios((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      setSuccess(`"${anuncio.titulo}" is now ${newEstado.toLowerCase()}`);
    } catch {
      setError('Failed to update listing state.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (anuncio: Anuncio) => {
    if (!window.confirm(`Delete "${anuncio.titulo}"? This action cannot be undone.`)) return;
    setActionLoading(anuncio.id);
    setError('');
    setSuccess('');
    try {
      await deleteAnuncio(anuncio.id);
      setAnuncios((prev) => prev.filter((a) => a.id !== anuncio.id));
      setSuccess(`"${anuncio.titulo}" deleted successfully.`);
    } catch {
      setError('Failed to delete listing.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
        <Link to="/anuncios/publicar">
          <Button>Publish New Listing</Button>
        </Link>
      </div>

      {success && (
        <div className="mb-4">
          <Alert type="success" message={success} onClose={() => setSuccess('')} />
        </div>
      )}
      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="estado-filter" className="text-sm font-medium text-gray-700">
          Filter by status:
        </label>
        <select
          id="estado-filter"
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          {estadoFilterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : anuncios.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium text-gray-500">No listings found</p>
          <p className="mt-1 text-sm text-gray-400">
            {estadoFilter ? 'Try a different filter' : 'Start by publishing your first listing'}
          </p>
          {!estadoFilter && (
            <Link to="/anuncios/publicar" className="mt-4 inline-block">
              <Button>Publish Listing</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {anuncios.map((anuncio) => (
            <div
              key={anuncio.id}
              className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/anuncios/${anuncio.id}`}
                    className="truncate text-base font-semibold text-gray-900 hover:text-indigo-600"
                  >
                    {anuncio.titulo}
                  </Link>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoStyles[anuncio.estado]}`}>
                    {anuncio.estado}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-indigo-600">
                  S/ {anuncio.precio.toLocaleString()}/month
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Created: {new Date(anuncio.fecha_creacion).toLocaleDateString()}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <Link to={`/anuncios/${anuncio.id}/editar`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Button
                  variant={anuncio.estado === EstadoAnuncio.ACTIVO ? 'danger' : 'primary'}
                  onClick={() => handleToggleState(anuncio)}
                  isLoading={actionLoading === anuncio.id}
                >
                  {anuncio.estado === EstadoAnuncio.ACTIVO ? 'Deactivate' : 'Activate'}
                </Button>
                {(anuncio.estado === EstadoAnuncio.BORRADOR || anuncio.estado === EstadoAnuncio.INACTIVO) && (
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(anuncio)}
                    isLoading={actionLoading === anuncio.id}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
