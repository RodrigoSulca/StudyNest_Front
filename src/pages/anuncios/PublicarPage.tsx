import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { CreateAnuncioRequest } from '../../types/anuncio.types';
import { createAnuncio } from '../../services/anuncios.service';
import { FormularioAnuncio } from '../../components/anuncios/FormularioAnuncio';
import { Alert } from '../../components/ui/Alert';

export default function PublicarPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (data: CreateAnuncioRequest) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await createAnuncio(data);
      setSuccess('Listing published successfully!');
      setTimeout(() => {
        navigate('/anuncios/mis-anuncios');
      }, 1500);
    } catch (err) {
      const apiErr = err as { response?: { data?: { mensaje?: string } } };
      setError(apiErr.response?.data?.mensaje || 'Failed to publish listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <Link to="/anuncios" className="mb-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
            &larr; Back to search
          </Link>
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Publish a New Listing
          </h1>

          {success && <Alert type="success" message={success} />}
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <FormularioAnuncio
            onSubmit={handleSubmit}
            isLoading={loading}
            submitLabel="Publish Listing"
          />
        </div>
      </div>
    </div>
  );
}
