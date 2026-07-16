import type {
  ListaNotificaciones,
  Notificacion,
  PreferenciaNotificacion,
  TipoNotificacion,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status} al llamar ${path}`);
  }

  return res.json() as Promise<T>;
}

export interface FiltrosNotificaciones {
  estado?: string;
  tipo?: string;
  page?: number;
  limit?: number;
}

export const notificationsApi = {
  listar(usuarioId: string, filtros: FiltrosNotificaciones = {}): Promise<ListaNotificaciones> {
    const params = new URLSearchParams({ usuario_id: usuarioId });
    if (filtros.estado) params.set("estado", filtros.estado);
    if (filtros.tipo) params.set("tipo", filtros.tipo);
    if (filtros.page) params.set("page", String(filtros.page));
    if (filtros.limit) params.set("limit", String(filtros.limit));
    return request<ListaNotificaciones>(`/api/notifications?${params.toString()}`);
  },

  contarNoLeidas(usuarioId: string): Promise<{ total: number }> {
    return request(`/api/notifications/unread-count?usuario_id=${usuarioId}`);
  },

  marcarLeida(id: string): Promise<Notificacion> {
    return request(`/api/notifications/${id}/read`, { method: "PATCH" });
  },

  reintentar(id: string): Promise<Notificacion> {
    return request(`/api/notifications/${id}/retry`, { method: "POST" });
  },

  eliminar(id: string): Promise<{ deleted: boolean }> {
    return request(`/api/notifications/${id}`, { method: "DELETE" });
  },

  crear(data: {
    usuario_id: string;
    tipo: TipoNotificacion;
    canal?: string;
    titulo: string;
    mensaje: string;
  }): Promise<Notificacion> {
    return request(`/api/notifications`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  obtenerPreferencias(usuarioId: string): Promise<PreferenciaNotificacion[]> {
    return request(`/api/notifications/preferences/${usuarioId}`);
  },

  actualizarPreferencia(
    usuarioId: string,
    tipo: TipoNotificacion,
    cambios: Partial<Pick<PreferenciaNotificacion, "canal_preferido" | "activo" | "frecuencia">>
  ): Promise<PreferenciaNotificacion> {
    return request(`/api/notifications/preferences/${usuarioId}`, {
      method: "PUT",
      body: JSON.stringify({ tipo_notificacion: tipo, ...cambios }),
    });
  },
};
