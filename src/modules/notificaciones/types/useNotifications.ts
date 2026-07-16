import { useCallback, useEffect, useRef, useState } from "react";
import { notificationsApi, type FiltrosNotificaciones } from "../api/notificationsApi";
import type { Notificacion } from "../types";

const POLL_INTERVAL_MS = 15_000;

export function useNotifications(usuarioId: string, filtros: FiltrosNotificaciones = {}) {
  const [items, setItems] = useState<Notificacion[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filtrosRef = useRef(filtros);
  filtrosRef.current = filtros;

  const cargar = useCallback(async () => {
    try {
      setError(null);
      const [lista, contador] = await Promise.all([
        notificationsApi.listar(usuarioId, filtrosRef.current),
        notificationsApi.contarNoLeidas(usuarioId),
      ]);
      setItems(lista.items);
      setTotal(lista.total);
      setUnreadCount(contador.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar notificaciones");
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    if (!usuarioId) return;
    setLoading(true);
    cargar();
    const interval = setInterval(cargar, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [usuarioId, cargar]);

  const marcarLeida = useCallback(
    async (id: string) => {
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true, estado: "LEIDA" } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
      try {
        await notificationsApi.marcarLeida(id);
      } catch {
        cargar(); // revertir con datos reales si algo fallo
      }
    },
    [cargar]
  );

  const reintentar = useCallback(
    async (id: string) => {
      await notificationsApi.reintentar(id);
      cargar();
    },
    [cargar]
  );

  const eliminar = useCallback(
    async (id: string) => {
      setItems((prev) => prev.filter((n) => n.id !== id));
      try {
        await notificationsApi.eliminar(id);
      } catch {
        cargar();
      }
    },
    [cargar]
  );

  return { items, total, unreadCount, loading, error, recargar: cargar, marcarLeida, reintentar, eliminar };
}
