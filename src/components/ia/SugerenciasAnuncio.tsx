import { useState, useEffect } from 'react';
import { getSugerencias } from '../../services/ia.service';
import type { Sugerencia } from '../../types/ia.types';
import { PrioridadSugerencia } from '../../types/ia.types';

interface SugerenciasAnuncioProps {
  anuncioId: string;
  onRefresh?: () => void;
}

const prioridadConfig: Record<string, { label: string; color: string }> = {
  [PrioridadSugerencia.ALTA]: { label: 'High', color: 'bg-red-100 text-red-700' },
  [PrioridadSugerencia.MEDIA]: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  [PrioridadSugerencia.BAJA]: { label: 'Low', color: 'bg-green-100 text-green-700' },
};

function ScoreCircle({ score }: { score: number }) {
  const percentage = Math.round(score * 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const strokeColor =
    percentage >= 70 ? 'text-green-500' : percentage >= 40 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="relative flex items-center justify-center">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={strokeColor}
        />
      </svg>
      <span className="absolute text-lg font-bold text-gray-900">{percentage}%</span>
    </div>
  );
}

export function SugerenciasAnuncio({ anuncioId }: SugerenciasAnuncioProps) {
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getSugerencias(anuncioId)
      .then((data) => {
        setSugerencias(data.sugerencias);
        setScore(data.score);
      })
      .catch(() => setError('Failed to load suggestions.'))
      .finally(() => setLoading(false));
  }, [anuncioId]);

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <svg className="h-6 w-6 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    );
  }

  if (error) return null;

  if (sugerencias.length === 0) return null;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900">Listing Suggestions</h3>
      </div>

      <div className="mb-4 flex items-center gap-6">
        <ScoreCircle score={score} />
        <p className="text-sm text-gray-500">Your listing optimization score</p>
      </div>

      <ul className="space-y-3">
        {sugerencias.map((sug, i) => {
          const config = prioridadConfig[sug.prioridad] ?? prioridadConfig[PrioridadSugerencia.BAJA];
          return (
            <li key={`${sug.tipo}-${i}`} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>
                {config.label}
              </span>
              <p className="text-sm text-gray-700">{sug.mensaje}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
