import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { Resena } from '../../types/resena.types';
import { EstadoResena } from '../../types/resena.types';
import { EstrellasCalificacion } from './EstrellasCalificacion';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { FormularioResena } from './FormularioResena';
import { updateResena, deleteResena, reportResena, moderateResena } from '../../services/resenas.service';

import { Rol } from '../../types/usuario.types';

interface TarjetaResenaProps {
  resena: Resena;
  onUpdate: () => void;
}

const estadoBadgeStyles: Record<string, string> = {
  [EstadoResena.PENDIENTE]: 'bg-gray-100 text-gray-700',
  [EstadoResena.ACTIVA]: 'bg-green-100 text-green-700',
  [EstadoResena.REPORTADA]: 'bg-yellow-100 text-yellow-700',
  [EstadoResena.ELIMINADA]: 'bg-red-100 text-red-700',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function TarjetaResena({ resena, onUpdate }: TarjetaResenaProps) {
  const { user } = useAuth();
  const isAuthor = user?.id === resena.usuario_id;
  const isAdmin = user?.rol === Rol.ADMIN;
  const [isEditing, setIsEditing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMotivo, setReportMotivo] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (data: { alojamiento_id: string; calificacion: number; comentario: string }) => {
    setActionLoading(true);
    setError('');
    try {
      await updateResena(resena.id, {
        calificacion: data.calificacion,
        comentario: data.comentario,
      });
      setIsEditing(false);
      onUpdate();
    } catch {
      setError('Failed to update review.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setActionLoading(true);
    setError('');
    try {
      await deleteResena(resena.id);
      onUpdate();
    } catch {
      setError('Failed to delete review.');
      setActionLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reportMotivo.trim()) return;
    setActionLoading(true);
    setError('');
    try {
      await reportResena(resena.id, reportMotivo.trim());
      setShowReportModal(false);
      setReportMotivo('');
      onUpdate();
    } catch {
      setError('Failed to report review.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleModerate = async (accion: 'APROBADA' | 'RECHAZADA' | 'ELIMINADA') => {
    const confirmMsg = accion === 'APROBADA'
      ? 'Approve this review?'
      : accion === 'RECHAZADA'
        ? 'Reject this review?'
        : 'Delete this review permanently?';
    if (!window.confirm(confirmMsg)) return;
    setActionLoading(true);
    setError('');
    try {
      await moderateResena(resena.id, accion);
      onUpdate();
    } catch {
      setError(`Failed to ${accion.toLowerCase()} review.`);
    } finally {
      setActionLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <FormularioResena
          alojamientoId={resena.alojamiento_id}
          initialData={{ calificacion: resena.calificacion, comentario: resena.comentario }}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isLoading={actionLoading}
        />
        {error && (
          <div className="mt-3">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {error && (
        <div className="mb-3">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900">
              {resena.autor?.nombre ?? 'Anonymous'}
            </span>
            <span className="text-sm text-gray-400">
              {formatDate(resena.fecha_publicacion)}
            </span>
            {resena.estado !== EstadoResena.ACTIVA && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${estadoBadgeStyles[resena.estado] ?? ''}`}>
                {resena.estado}
              </span>
            )}
          </div>

          <div className="mt-1">
            <EstrellasCalificacion value={resena.calificacion} size="sm" />
          </div>

          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
            {resena.comentario}
          </p>

          {resena.fecha_edicion && (
            <p className="mt-1 text-xs text-gray-400">
              (edited)
            </p>
          )}
        </div>
      </div>

      {(isAuthor || isAdmin || (user && resena.estado === EstadoResena.ACTIVA && !isAuthor)) && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
          {isAuthor && (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete} isLoading={actionLoading}>
                Delete
              </Button>
            </>
          )}

          {isAdmin && !isAuthor && (
            <>
              {resena.estado === EstadoResena.PENDIENTE && (
                <>
                  <Button variant="secondary" onClick={() => handleModerate('APROBADA')} isLoading={actionLoading}>
                    Approve
                  </Button>
                  <Button variant="danger" onClick={() => handleModerate('RECHAZADA')} isLoading={actionLoading}>
                    Reject
                  </Button>
                </>
              )}
              {resena.estado === EstadoResena.REPORTADA && (
                <>
                  <Button variant="secondary" onClick={() => handleModerate('APROBADA')} isLoading={actionLoading}>
                    Approve
                  </Button>
                  <Button variant="danger" onClick={() => handleModerate('RECHAZADA')} isLoading={actionLoading}>
                    Reject
                  </Button>
                  <Button variant="danger" onClick={() => handleModerate('ELIMINADA')} isLoading={actionLoading}>
                    Delete
                  </Button>
                </>
              )}
              {resena.estado === EstadoResena.ACTIVA && (
                <Button variant="danger" onClick={() => handleModerate('ELIMINADA')} isLoading={actionLoading}>
                  Remove
                </Button>
              )}
            </>
          )}

          {!isAuthor && !isAdmin && user && resena.estado === EstadoResena.ACTIVA && (
            <Button variant="secondary" onClick={() => setShowReportModal(true)}>
              Report
            </Button>
          )}
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Report Review</h3>
            <p className="mt-1 text-sm text-gray-500">
              Please describe why you are reporting this review.
            </p>
            <textarea
              rows={3}
              maxLength={255}
              value={reportMotivo}
              onChange={(e) => setReportMotivo(e.target.value)}
              className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
              placeholder="Reason for reporting..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowReportModal(false);
                  setReportMotivo('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReport}
                isLoading={actionLoading}
                disabled={!reportMotivo.trim()}
              >
                Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
