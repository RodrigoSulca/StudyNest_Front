import { useState } from 'react';
import { generateContrato } from '../../services/ia.service';
import type { Contrato, GenerateContratoRequest } from '../../types/ia.types';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function ContratosPage() {
  const [anuncioId, setAnuncioId] = useState('');
  const [inquilinoId, setInquilinoId] = useState('');
  const [duracion, setDuracion] = useState('');
  const [precio, setPrecio] = useState('');
  const [condiciones, setCondiciones] = useState('');
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anuncioId || !inquilinoId || !duracion || !precio) return;

    setLoading(true);
    setError('');
    setContrato(null);

    try {
      const data: GenerateContratoRequest = {
        anuncio_id: anuncioId,
        inquilino_id: inquilinoId,
        duracion_meses: Number(duracion),
        precio_mensual: Number(precio),
        condiciones: condiciones || undefined,
      };
      const result = await generateContrato(data);
      setContrato(result);
    } catch {
      setError('Failed to generate contract. Please check the data and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!contrato) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head><title>Contract</title></head>
        <body>${contrato.html}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Contract Generator</h1>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Contract Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Listing ID</label>
              <input
                type="text"
                value={anuncioId}
                onChange={(e) => setAnuncioId(e.target.value)}
                required
                placeholder="Enter listing ID"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tenant Email or ID</label>
              <input
                type="text"
                value={inquilinoId}
                onChange={(e) => setInquilinoId(e.target.value)}
                required
                placeholder="Enter tenant email or ID"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Duration (months)</label>
                <input
                  type="number"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  required
                  min={1}
                  placeholder="e.g. 12"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Monthly Price ($)</label>
                <input
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                  min={0}
                  placeholder="e.g. 500"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Additional Conditions</label>
              <textarea
                value={condiciones}
                onChange={(e) => setCondiciones(e.target.value)}
                rows={3}
                placeholder="Optional additional conditions..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <Button type="submit" isLoading={loading} className="w-full">
              Generate Contract
            </Button>
          </form>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            {contrato && (
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {!loading && !contrato && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-500">Fill in the form and generate a contract to see the preview here.</p>
            </div>
          )}

          {!loading && contrato && (
            <div className="overflow-auto rounded-lg border border-gray-200" style={{ maxHeight: '600px' }}>
              <div
                className="p-4 text-sm"
                dangerouslySetInnerHTML={{ __html: contrato.html }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
