import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Notificacion } from '../types/notificacion.types';
import { useAuth } from './useAuth';

const SOCKET_URL = import.meta.env.DEV
  ? 'http://localhost:3001'
  : window.location.origin;

export function useSocket() {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastNotification, setLastNotification] = useState<Notificacion | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('notificacion', (data: Notificacion) => {
      setLastNotification(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  return { isConnected, lastNotification };
}
