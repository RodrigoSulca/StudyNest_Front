import api from './api';
import type {
  NotificacionListResponse,
  PreferenciasNotificacion,
} from '../types/notificacion.types';

export async function getNotificaciones(
  page = 1,
  limit = 20,
  soloNoLeidas = false,
): Promise<NotificacionListResponse> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));
  if (soloNoLeidas) {
    params.append('solo_no_leidas', 'true');
  }
  const response = await api.get<NotificacionListResponse>(
    `/notificaciones?${params.toString()}`,
  );
  return response.data;
}

export async function getNoLeidasCount(): Promise<number> {
  const response = await api.get<{ no_leidas: number }>(
    '/notificaciones/no-leidas/count',
  );
  return response.data.no_leidas;
}

export async function markAsRead(id: string): Promise<void> {
  await api.patch(`/notificaciones/${id}/leer`);
}

export async function markAllAsRead(): Promise<void> {
  await api.patch('/notificaciones/leer-todas');
}

export async function deleteNotificacion(id: string): Promise<void> {
  await api.delete(`/notificaciones/${id}`);
}

export async function getPreferencias(): Promise<PreferenciasNotificacion> {
  const response = await api.get<{ preferencias: PreferenciasNotificacion }>(
    '/notificaciones/preferencias',
  );
  return response.data.preferencias;
}

export async function savePreferencias(
  data: Partial<PreferenciasNotificacion>,
): Promise<PreferenciasNotificacion> {
  const response = await api.post<{ preferencias: PreferenciasNotificacion }>(
    '/notificaciones/preferencias',
    data,
  );
  return response.data.preferencias;
}
