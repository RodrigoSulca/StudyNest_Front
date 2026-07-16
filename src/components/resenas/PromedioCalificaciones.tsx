import { EstrellasCalificacion } from './EstrellasCalificacion';

interface PromedioCalificacionesProps {
  promedio: number;
  totalResenas: number;
}

export function PromedioCalificaciones({
  promedio,
  totalResenas,
}: PromedioCalificacionesProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-4xl font-bold text-indigo-600">
        {promedio.toFixed(1)}
      </span>
      <div>
        <EstrellasCalificacion value={promedio} size="lg" />
        <p className="mt-1 text-sm text-gray-500">
          Based on {totalResenas} {totalResenas === 1 ? 'review' : 'reviews'}
        </p>
      </div>
    </div>
  );
}
