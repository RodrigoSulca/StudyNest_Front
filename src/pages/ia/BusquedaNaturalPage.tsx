import { useState } from 'react';
import { busquedaNatural } from '../../services/ia.service';
import type { BusquedaNaturalResult } from '../../types/ia.types';
import { TarjetaAnuncio } from '../../components/anuncios/TarjetaAnuncio';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Alert } from '../../components/ui/Alert';

const EXAMPLE_QUERIES = [
  'Rooms near university with wifi',
  'Apartments under 500 with parking',
  'Furnished studio in Miraflores',
  'Shared apartment with pool and gym',
];

export default function BusquedaNaturalPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<BusquedaNaturalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (q?: string) => {
    const searchQuery = (q ?? query).trim();
    if (!searchQuery) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await busquedaNatural(searchQuery);
      setResult(data);
    } catch {
      setError('Failed to process your search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Smart Search</h1>
        <p className="text-gray-500">Describe what you're looking for in natural language</p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you're looking for..."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              'Search'
            )}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((example) => (
            <button
              key={example}
              onClick={() => { setQuery(example); handleSearch(example); }}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 transition-colors hover:border-indigo-300 hover:text-indigo-600"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && !loading && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {result && !loading && (
        <>
          {result.explicacion && (
            <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-indigo-900">How results were filtered</p>
                  <p className="mt-1 text-sm text-indigo-700">{result.explicacion}</p>
                </div>
              </div>
            </div>
          )}

          {result.resultados.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500">No results match your description. Try rephrasing your search.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.resultados.map((anuncio) => (
                <TarjetaAnuncio key={anuncio.id} anuncio={anuncio} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
