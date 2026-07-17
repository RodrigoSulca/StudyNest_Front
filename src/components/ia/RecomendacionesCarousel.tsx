import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getRecomendaciones } from '../../services/ia.service';
import type { Recomendacion } from '../../types/ia.types';
import { TipoRecomendacion } from '../../types/ia.types';
import { TarjetaAnuncio } from '../anuncios/TarjetaAnuncio';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Button } from '../ui/Button';

const tipoLabels: Record<string, string> = {
  [TipoRecomendacion.UBICACION]: 'Location',
  [TipoRecomendacion.PRECIO]: 'Price',
  [TipoRecomendacion.PREFERENCIA]: 'Preference',
};

const tipoColors: Record<string, string> = {
  [TipoRecomendacion.UBICACION]: 'bg-blue-100 text-blue-700',
  [TipoRecomendacion.PRECIO]: 'bg-amber-100 text-amber-700',
  [TipoRecomendacion.PREFERENCIA]: 'bg-purple-100 text-purple-700',
};

export function RecomendacionesCarousel() {
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRecomendaciones()
      .then((data) => setRecomendaciones(data.slice(0, 10)))
      .catch(() => setError('Failed to load recommendations.'))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <section className="py-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  if (recomendaciones.length === 0) {
    return (
      <section className="py-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Recommended for you
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-gray-500">
            Complete your preferences to get personalized recommendations
          </p>
          <Link to="/ia/preferencias">
            <Button>Set Preferences</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Recommended for you
        </h2>
        <div className="hidden gap-1 sm:flex">
          <button
            onClick={() => scroll('left')}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Scroll left"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Scroll right"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {recomendaciones.map((rec) => (
          <div
            key={rec.anuncio.id}
            className="relative min-w-[300px] snap-start"
          >
            <div className="absolute right-3 top-3 z-10 flex gap-1.5">
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                Match: {Math.round(rec.score * 100)}%
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tipoColors[rec.tipo] ?? 'bg-gray-100 text-gray-600'}`}>
                {tipoLabels[rec.tipo] ?? rec.tipo}
              </span>
            </div>
            <TarjetaAnuncio anuncio={rec.anuncio} />
          </div>
        ))}
      </div>
    </section>
  );
}
