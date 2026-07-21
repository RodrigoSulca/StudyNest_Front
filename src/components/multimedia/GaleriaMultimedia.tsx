import { useState } from 'react';
import type { Multimedia } from '../../types/multimedia.types';
import { EstadoMultimedia } from '../../types/multimedia.types';
import { GaleriaViewer } from './GaleriaViewer';
import { deleteMultimedia, updateEstado } from '../../services/multimedia.service';

interface GaleriaMultimediaProps {
  imagenes: Multimedia[];
  onDelete?: (id: string) => void;
  showAdminControls?: boolean;
  // Muestra el badge de estado (PENDIENTE/APROBADA/RECHAZADA) sin dar controles de admin.
  // Útil para que el dueño vea cuáles de sus imágenes fueron rechazadas.
  mostrarEstado?: boolean;
  onEstadoChange?: () => void;
}

const statusBadge: Record<string, string> = {
  [EstadoMultimedia.PENDIENTE]: 'bg-yellow-100 text-yellow-700',
  [EstadoMultimedia.APROBADA]: 'bg-green-100 text-green-700',
  [EstadoMultimedia.RECHAZADA]: 'bg-red-100 text-red-700',
};

export function GaleriaMultimedia({
  imagenes,
  onDelete,
  showAdminControls = false,
  mostrarEstado = false,
  onEstadoChange,
}: GaleriaMultimediaProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // El badge de estado se ve para admins (que además moderan) y para el dueño.
  const verEstado = showAdminControls || mostrarEstado;

  if (imagenes.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500">No images available</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    setActionLoading(id);
    try {
      await deleteMultimedia(id);
      onDelete?.(id);
    } catch {
      // handled by caller
    } finally {
      setActionLoading(null);
    }
  };

  const handleEstado = async (id: string, estado: EstadoMultimedia) => {
    setActionLoading(id);
    try {
      await updateEstado(id, estado);
      onEstadoChange?.();
    } catch {
      // handled by caller
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {imagenes
          .slice()
          .sort((a, b) => a.orden - b.orden)
          .map((img, index) => {
            const validacion = img.registros_validacion?.[0];
            return (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-lg shadow-sm transition-transform hover:scale-[1.02]"
            >
              <button
                onClick={() => setLightboxIndex(index)}
                className="block w-full"
              >
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={img.url_almacenamiento}
                    alt={`Image ${img.orden}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>

              {verEstado && (
                <div className="absolute top-2 left-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[img.estado]}`}
                    title={validacion ? `IA: ${validacion.etiqueta_detectada} · ${Number(validacion.score_confianza).toFixed(1)}%` : undefined}
                  >
                    {img.estado}
                    {validacion ? ` · ${Number(validacion.score_confianza).toFixed(0)}%` : ''}
                  </span>
                </div>
              )}

              {onDelete && (
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={actionLoading === img.id}
                  className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100 max-sm:opacity-100"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {showAdminControls && (
                <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
                  {img.estado !== EstadoMultimedia.APROBADA && (
                    <button
                      onClick={() => handleEstado(img.id, EstadoMultimedia.APROBADA)}
                      disabled={actionLoading === img.id}
                      className="rounded-full bg-green-600 p-1.5 text-white hover:bg-green-700"
                      title="Approve"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </button>
                  )}
                  {img.estado !== EstadoMultimedia.RECHAZADA && (
                    <button
                      onClick={() => handleEstado(img.id, EstadoMultimedia.RECHAZADA)}
                      disabled={actionLoading === img.id}
                      className="rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700"
                      title="Reject"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
            );
          })}
      </div>

      {lightboxIndex !== null && (
        <GaleriaViewer
          imagenes={imagenes}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onDelete={onDelete ? (id) => handleDelete(id) : undefined}
        />
      )}
    </>
  );
}
