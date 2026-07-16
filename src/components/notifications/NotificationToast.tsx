import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Notificacion } from '../../types/notificacion.types';

interface NotificationToastProps {
  notification: Notificacion | null;
}

export function NotificationToast({ notification }: NotificationToastProps) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!notification) return;

    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!notification || !visible) return null;

  const handleClick = () => {
    setVisible(false);
    navigate('/notificaciones');
  };

  return (
    <div
      className="animate-slide-in fixed top-4 right-4 z-50 w-sm cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-2xl"
      onClick={handleClick}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100">
          <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">{notification.titulo}</p>
          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{notification.mensaje}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
          }}
          className="shrink-0 text-gray-400 hover:text-gray-600"
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
