import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Rol } from '../../types/usuario.types';
import type { Anuncio } from '../../types/anuncio.types';
import { EstadoAnuncio } from '../../types/anuncio.types';
import type { Multimedia } from '../../types/multimedia.types';
import type { PromedioResponse } from '../../types/resena.types';
import { getAnuncio, changeEstado, deleteAnuncio } from '../../services/anuncios.service';
import { getPromedio } from '../../services/resenas.service';
import { getMultimediaByAnuncio } from '../../services/multimedia.service';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ListaResenas } from '../../components/resenas/ListaResenas';
import { GaleriaMultimedia } from '../../components/multimedia/GaleriaMultimedia';
import { UploadMultimedia } from '../../components/multimedia/UploadMultimedia';
import { SugerenciasAnuncio } from '../../components/ia/SugerenciasAnuncio';

const estadoStyles: Record<string, string> = {
  [EstadoAnuncio.BORRADOR]: 'bg-gray-100 text-gray-700',
  [EstadoAnuncio.ACTIVO]: 'bg-green-100 text-green-700',
  [EstadoAnuncio.INACTIVO]: 'bg-yellow-100 text-yellow-700',
  [EstadoAnuncio.SUSPENDIDO]: 'bg-red-100 text-red-700',
};

const attributeLabels: Record<string, string> = {
  wifi: 'Wi-Fi',
  mascotas: 'Pets allowed',
  limpieza_semanal: 'Weekly cleaning',
  agua: 'Water included',
  luz: 'Electricity included',
  internet: 'Internet',
  estacionamiento: 'Parking',
  terraza: 'Terrace',
};

export default function DetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [promedioData, setPromedioData] = useState<PromedioResponse | null>(null);
  const [imagenes, setImagenes] = useState<Multimedia[]>([]);

  const isOwner = user && anuncio && user.id === anuncio.arrendador_id;
  const isAdmin = user?.rol === Rol.ADMIN;
  const canEdit = isOwner;
  const canToggleState = isOwner || isAdmin;
  const canDelete = isOwner && (anuncio?.estado === EstadoAnuncio.BORRADOR || anuncio?.estado === EstadoAnuncio.INACTIVO);

  useEffect(() => {
    if (!id) return;

    const fetchAnuncio = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAnuncio(id);
        setAnuncio(data);
      } catch {
        setError('Failed to load listing details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnuncio();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getPromedio(id)
      .then(setPromedioData)
      .catch(() => {});
  }, [id]);

  const fetchMultimedia = useCallback(() => {
    if (!id) return;
    getMultimediaByAnuncio(id)
      .then(setImagenes)
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    fetchMultimedia();
  }, [fetchMultimedia]);

  const handleToggleState = async () => {
    if (!anuncio) return;
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const newEstado = anuncio.estado === EstadoAnuncio.ACTIVO
        ? EstadoAnuncio.INACTIVO
        : EstadoAnuncio.ACTIVO;
      const updated = await changeEstado(anuncio.id, newEstado);
      setAnuncio(updated);
      setSuccess(`Listing is now ${newEstado.toLowerCase()}`);
    } catch {
      setError('Failed to update listing state.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!anuncio || !window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    setActionLoading(true);
    setError('');
    try {
      await deleteAnuncio(anuncio.id);
      navigate('/anuncios/mis-anuncios');
    } catch {
      setError('Failed to delete listing.');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !anuncio) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Link to="/anuncios" className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Back to search
        </Link>
      </div>
    );
  }

  if (!anuncio) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/anuncios" className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
        &larr; Back to search
      </Link>

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

      <div className="mb-6">
        <GaleriaMultimedia
          imagenes={imagenes}
          showAdminControls={isAdmin}
          onEstadoChange={fetchMultimedia}
          onDelete={
            isOwner
              ? (deletedId) => setImagenes((prev) => prev.filter((img) => img.id !== deletedId))
              : undefined
          }
        />
      </div>

      {isOwner && id && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <UploadMultimedia anuncioId={id} onUploadComplete={fetchMultimedia} />
        </div>
      )}

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{anuncio.titulo}</h1>
          <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${estadoStyles[anuncio.estado]}`}>
            {anuncio.estado}
          </span>
        </div>

        <p className="mb-4 text-3xl font-bold text-indigo-600">
          S/ {anuncio.precio.toLocaleString()}/month
        </p>

        {anuncio.direccion && (
          <p className="mb-4 text-gray-600">
            {anuncio.direccion}
          </p>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {anuncio.tipo_contrato && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">Contract</p>
              <p className="text-sm font-medium capitalize text-gray-900">{anuncio.tipo_contrato}</p>
            </div>
          )}
          {anuncio.tipo_amoblado && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">Furnishing</p>
              <p className="text-sm font-medium capitalize text-gray-900">{anuncio.tipo_amoblado.replace('_', ' ')}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium uppercase text-gray-400">Published</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(anuncio.fecha_creacion).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-sm font-medium text-gray-900">Description</h2>
          <p className="whitespace-pre-wrap text-sm text-gray-600">{anuncio.descripcion}</p>
        </div>

        {anuncio.servicios_incluidos && (
          <div className="mb-6">
            <h2 className="mb-2 text-sm font-medium text-gray-900">Included services</h2>
            <p className="text-sm text-gray-600">{anuncio.servicios_incluidos}</p>
          </div>
        )}

        {Object.keys(anuncio.atributos_dinamicos).length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 text-sm font-medium text-gray-900">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(anuncio.atributos_dinamicos)
                .filter(([, value]) => value === true)
                .map(([key]) => (
                  <span
                    key={key}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                  >
                    {attributeLabels[key] ?? key}
                  </span>
                ))}
            </div>
          </div>
        )}

        {anuncio.arrendador && (
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs font-medium uppercase text-gray-400">Listed by</p>
            <p className="text-sm font-medium text-gray-900">{anuncio.arrendador.nombre}</p>
          </div>
        )}

        {(canEdit || canToggleState || canDelete) && (
          <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-200 pt-4">
            {canEdit && (
              <Link to={`/anuncios/${anuncio.id}/editar`}>
                <Button variant="secondary">Edit</Button>
              </Link>
            )}
            {canToggleState && (
              <Button
                variant={anuncio.estado === EstadoAnuncio.ACTIVO ? 'danger' : 'primary'}
                onClick={handleToggleState}
                isLoading={actionLoading}
              >
                {anuncio.estado === EstadoAnuncio.ACTIVO ? 'Deactivate' : 'Activate'}
              </Button>
            )}
            {canDelete && (
              <Button variant="danger" onClick={handleDelete} isLoading={actionLoading}>
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {id && promedioData && (
        <ListaResenas
          alojamientoId={id}
          promedio={promedioData.promedio}
          totalResenas={promedioData.total_resenas}
        />
      )}

      {isOwner && id && (
        <div className="mt-6">
          <SugerenciasAnuncio anuncioId={id} />
        </div>
      )}
    </div>
  );
}
