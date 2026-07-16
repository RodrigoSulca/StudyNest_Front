import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  getNoLeidasCount,
  getNotificaciones,
  markAllAsRead,
} from '../../services/notificaciones.service';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import type { Notificacion, TipoNotificacion } from '../../types/notificacion.types';

const TYPE_COLORS: Record<TipoNotificacion, string> = {
  NUEVO_ANUNCIO: 'bg-blue-500',
  CAMBIO_PRECIO: 'bg-green-500',
  NUEVA_RESENA: 'bg-amber-500',
  RECOMENDACION: 'bg-purple-500',
  SISTEMA: 'bg-gray-500',
};

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchCount = useCallback(async () => {
    try {
      const count = await getNoLeidasCount();
      setUnreadCount(count);
    } catch {
      // silently fail — will retry on next interval
    }
  }, []);

  const fetchRecent = useCallback(async () => {
    try {
      const res = await getNotificaciones(1, 5, false);
      setNotifications(res.notificaciones);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchCount();
    fetchRecent();

    const interval = setInterval(() => {
      fetchCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchCount, fetchRecent]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, estado: 'LEIDA' as const })));
    } catch {
      // silently fail
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchRecent();
      fetchCount();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-gray-900"
        aria-label="Notifications"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-sm rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-400">
                No notifications yet
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 border-b border-gray-50 px-4 py-3 hover:bg-gray-50"
                >
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${TYPE_COLORS[n.tipo]}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm ${n.estado !== 'LEIDA' ? 'font-semibold' : 'font-normal'} text-gray-900 truncate`}
                    >
                      {n.titulo}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 truncate">{n.mensaje}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatTimeAgo(n.fecha_creacion)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 px-4 py-2.5">
            <Link
              to="/notificaciones"
              onClick={() => setIsOpen(false)}
              className="block text-center text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
