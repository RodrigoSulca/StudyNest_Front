import { useState } from 'react';
import { EstrellasCalificacion } from './EstrellasCalificacion';
import { Button } from '../ui/Button';

interface FormularioResenaProps {
  alojamientoId: string;
  initialData?: {
    calificacion: number;
    comentario: string;
  };
  onSubmit: (data: { alojamiento_id: string; calificacion: number; comentario: string }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function FormularioResena({
  alojamientoId,
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: FormularioResenaProps) {
  const [calificacion, setCalificacion] = useState(initialData?.calificacion ?? 0);
  const [comentario, setComentario] = useState(initialData?.comentario ?? '');
  const [errors, setErrors] = useState<{ calificacion?: string; comentario?: string }>({});

  const validate = (): boolean => {
    const newErrors: { calificacion?: string; comentario?: string } = {};

    if (calificacion < 1 || calificacion > 5) {
      newErrors.calificacion = 'Please select a rating';
    }

    const trimmed = comentario.trim();
    if (!trimmed) {
      newErrors.comentario = 'Review cannot be empty';
    } else if (trimmed.length < 10) {
      newErrors.comentario = 'Review must be at least 10 characters';
    } else if (trimmed.length > 500) {
      newErrors.comentario = 'Review must be at most 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      alojamiento_id: alojamientoId,
      calificacion,
      comentario: comentario.trim(),
    });
  };

  const charCount = comentario.length;
  const charCountClass = charCount > 450 ? 'text-red-600' : 'text-gray-400';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <EstrellasCalificacion
          value={calificacion}
          onChange={setCalificacion}
          size="lg"
        />
        {errors.calificacion && (
          <p className="mt-1 text-sm text-red-600">{errors.calificacion}</p>
        )}
      </div>

      <div>
        <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">
          Your review
        </label>
        <textarea
          id="comentario"
          rows={4}
          maxLength={500}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            errors.comentario
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          placeholder="Share your experience with this listing..."
        />
        <div className="mt-1 flex justify-between">
          {errors.comentario ? (
            <p className="text-sm text-red-600">{errors.comentario}</p>
          ) : (
            <span />
          )}
          <span className={`text-xs ${charCountClass}`}>
            {charCount}/500
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Review' : 'Submit Review'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
