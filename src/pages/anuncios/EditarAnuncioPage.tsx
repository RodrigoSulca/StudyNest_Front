import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { CreateAnuncioRequest } from '../../types/anuncio.types';
import { getAnuncio, updateAnuncio } from '../../services/anuncios.service';
import { FormularioAnuncio } from '../../components/anuncios/FormularioAnuncio';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function EditarAnuncioPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialData, setInitialData] = useState<Partial<CreateAnuncioRequest> | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAnuncio = async () => {
      setLoading(true);
      setError('');
      try {
        const anuncio = await getAnuncio(id);
        setInitialData({
          titulo: anuncio.titulo,
          descripcion: anuncio.descripcion,
          precio: anuncio.precio,
          direccion: anuncio.direccion ?? '',
          tipo_contrato: anuncio.tipo_contrato ?? '',
          tipo_amoblado: anuncio.tipo_amoblado ?? '',
          servicios_incluidos: anuncio.servicios_incluidos ?? '',
          atributos_dinamicos: anuncio.atributos_dinamicos,
        });
      } catch {
        setError('Failed to load listing data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnuncio();
  }, [id]);

  const handleSubmit = async (data: CreateAnuncioRequest) => {
    if (!id) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await updateAnuncio(id, data);
      setSuccess('Listing updated successfully!');
      setTimeout(() => {
        navigate(`/anuncios/${id}`);
      }, 1500);
    } catch (err) {
      const apiErr = err as { response?: { data?: { mensaje?: string } } };
      setError(apiErr.response?.data?.mensaje || 'Failed to update listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <Link
            to={id ? `/anuncios/${id}` : '/anuncios/mis-anuncios'}
            className="mb-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            &larr; Back to listing
          </Link>
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Edit Listing
          </h1>

          {success && <Alert type="success" message={success} />}
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          {initialData && (
            <FormularioAnuncio
              initialData={initialData}
              onSubmit={handleSubmit}
              isLoading={submitting}
              submitLabel="Save Changes"
            />
          )}
        </div>
      </div>
    </div>
  );
}
