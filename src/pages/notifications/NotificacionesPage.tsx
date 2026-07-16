import { useState, useEffect, useCallback } from 'react';
import {
  getNotificaciones,
  markAsRead,
  markAllAsRead,
  deleteNotificacion,
} from '../../services/notificaciones.service';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import type { Notificacion, TipoNotificacion } from '../../types/notificacion.types';

const TYPE_BADGES: Record<TipoNotificacion, { label: string; bg: string; text: string; icon: string }> = {
  NUEVO_ANUNCIO: { label: 'New Listing', bg: 'bg-blue-100', text: 'text-blue-700', icon: '🏠' },
  CAMBIO_PRECIO: { label: 'Price Change', bg: 'bg-green-100', text: 'text-green-700', icon: '💲' },
  NUEVA_RESENA: { label: 'New Review', bg: 'bg-amber-100', text: 'text-amber-700', icon: '⭐' },
  RECOMENDACION: { label: 'Recommendation', bg: 'bg-purple-100', text: 'text-purple-700', icon: '✨' },
  SISTEMA: { label: 'System', bg: 'bg-gray-100', text: 'text-gray-700', icon: '🔔' },
};

const ITEMS_PER_PAGE = 10;

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getNotificaciones(page, ITEMS_PER_PAGE, onlyUnread);
      setNotifications(res.notificaciones);
      setTotalPages(res.totalPages);
    } catch {
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, onlyUnread]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleTabChange = (unreadOnly: boolean) => {
    setOnlyUnread(unreadOnly);
    setPage(1);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
    } catch {
      setError('Failed to mark notifications as read.');
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, estado: 'LEIDA' as const } : n)),
      );
    } catch {
      setError('Failed to mark notification as read.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotificacion(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      setError('Failed to delete notification.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <Button variant="secondary" onClick={handleMarkAllRead}>
          Mark all as read
        </Button>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => handleTabChange(false)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            !onlyUnread ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleTabChange(true)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            onlyUnread ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Unread only
        </button>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      {loading ? (
        <div className="py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium text-gray-500">No notifications yet</p>
          <p className="mt-1 text-sm text-gray-400">When you receive notifications, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const badge = TYPE_BADGES[n.tipo];
            const isUnread = n.estado !== 'LEIDA';
            return (
              <div
                key={n.id}
                onClick={() => isUnread && handleMarkRead(n.id)}
                className={`group relative rounded-lg border p-4 transition-colors ${
                  isUnread
                    ? 'border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                } ${isUnread ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {isUnread && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                  <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}>
                    <span>{badge.icon}</span>
                    {badge.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm text-gray-900 ${isUnread ? 'font-semibold' : 'font-normal'}`}>
                      {n.titulo}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{n.mensaje}</p>
                    <p className="mt-1 text-xs text-gray-400">{formatTimeAgo(n.fecha_creacion)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(n.id);
                    }}
                    className="shrink-0 rounded p-1 text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                    aria-label="Delete notification"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-4 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
