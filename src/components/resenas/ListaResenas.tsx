import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Rol } from '../../types/usuario.types';
import type { Resena } from '../../types/resena.types';
import { getResenasByAlojamiento } from '../../services/resenas.service';
import { PromedioCalificaciones } from './PromedioCalificaciones';
import { TarjetaResena } from './TarjetaResena';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ListaResenasProps {
  alojamientoId: string;
  promedio: number;
  totalResenas: number;
}

type Ordenamiento = 'fecha' | 'mayor' | 'menor';

const sortLabels: Record<Ordenamiento, string> = {
  fecha: 'Most recent',
  mayor: 'Highest rated',
  menor: 'Lowest rated',
};

export function ListaResenas({
  alojamientoId,
  promedio,
  totalResenas,
}: ListaResenasProps) {
  const { user } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ordenar, setOrdenar] = useState<Ordenamiento>('fecha');

  const fetchResenas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getResenasByAlojamiento(alojamientoId, page, 10, ordenar);
      setResenas(data.resenas);
      setTotalPages(data.totalPages);
    } catch {
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, [alojamientoId, page, ordenar]);

  useEffect(() => {
    fetchResenas();
  }, [fetchResenas]);

  const handleSortChange = (newSort: Ordenamiento) => {
    setOrdenar(newSort);
    setPage(1);
  };

  const cycleSort = () => {
    const order: Ordenamiento[] = ['fecha', 'mayor', 'menor'];
    const currentIndex = order.indexOf(ordenar);
    const nextIndex = (currentIndex + 1) % order.length;
    handleSortChange(order[nextIndex]);
  };

  const isStudent = user?.rol === Rol.ESTUDIANTE;

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PromedioCalificaciones promedio={promedio} totalResenas={totalResenas} />
        {isStudent && (
          <a href={`/anuncios/${alojamientoId}/resena`}>
            <Button>Write a Review</Button>
          </a>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <button
          onClick={cycleSort}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          Sort: {sortLabels[ordenar]}
        </button>
      </div>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      {loading ? (
        <div className="py-8">
          <LoadingSpinner />
        </div>
      ) : resenas.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {resenas.map((resena) => (
            <TarjetaResena key={resena.id} resena={resena} onUpdate={fetchResenas} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
