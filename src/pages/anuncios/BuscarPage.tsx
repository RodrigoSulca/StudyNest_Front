import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Rol } from '../../types/usuario.types';
import type { SearchFilters, Anuncio } from '../../types/anuncio.types';
import { searchAnuncios } from '../../services/anuncios.service';
import { TarjetaAnuncio } from '../../components/anuncios/TarjetaAnuncio';
import { FiltrosBusqueda } from '../../components/anuncios/FiltrosBusqueda';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const ITEMS_PER_PAGE = 12;

export default function BuscarPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({ page: 1, limit: ITEMS_PER_PAGE });
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchAnuncios = useCallback(async (currentFilters: SearchFilters) => {
    setLoading(true);
    setError('');
    try {
      const response = await searchAnuncios(currentFilters);
      setAnuncios(response.anuncios);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch {
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnuncios(filters);
  }, [filters, fetchAnuncios]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters({ ...newFilters, page: 1, limit: ITEMS_PER_PAGE });
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: ITEMS_PER_PAGE });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isArrendador = user?.rol === Rol.ARRENDADOR;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Find Housing</h1>
        {isArrendador && (
          <Link to="/anuncios/publicar">
            <Button>Publish Listing</Button>
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              label=""
              value={filters.busqueda ?? ''}
              onChange={(e) => setFilters({ ...filters, busqueda: e.target.value || undefined })}
              placeholder="Search by title or description..."
            />
          </div>
          <Button type="submit" className="mt-auto mb-0.5">
            Search
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="mt-auto mb-0.5 sm:hidden"
          >
            Filters
          </Button>
        </div>
      </form>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 sm:block">
          <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-4">
            <FiltrosBusqueda
              filters={filters}
              onChange={handleFiltersChange}
              onClear={handleClearFilters}
            />
          </div>
        </aside>

        {showFilters && (
          <div className="fixed inset-0 z-50 bg-black/50 sm:hidden" onClick={() => setShowFilters(false)}>
            <div
              className="absolute inset-y-0 left-0 w-80 max-w-full overflow-y-auto bg-white p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                  &times;
                </button>
              </div>
              <FiltrosBusqueda
                filters={filters}
                onChange={handleFiltersChange}
                onClear={handleClearFilters}
              />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          {!loading && (
            <p className="mb-4 text-sm text-gray-500">
              {total} {total === 1 ? 'listing' : 'listings'} found
            </p>
          )}

          {loading ? (
            <div className="py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : anuncios.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-medium text-gray-500">No listings found</p>
              <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {anuncios.map((anuncio) => (
                <TarjetaAnuncio key={anuncio.id} anuncio={anuncio} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
              >
                Previous
              </Button>
              <span className="px-4 text-sm text-gray-600">
                Page {filters.page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={filters.page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
