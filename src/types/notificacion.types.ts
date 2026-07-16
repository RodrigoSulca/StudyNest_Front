export const TipoNotificacion = {
  NUEVO_ANUNCIO: 'NUEVO_ANUNCIO',
  CAMBIO_PRECIO: 'CAMBIO_PRECIO',
  NUEVA_RESENA: 'NUEVA_RESENA',
  RECOMENDACION: 'RECOMENDACION',
  SISTEMA: 'SISTEMA',
} as const;

export type TipoNotificacion = (typeof TipoNotificacion)[keyof typeof TipoNotificacion];

export const CanalNotificacion = {
  EMAIL: 'EMAIL',
  PUSH: 'PUSH',
  IN_APP: 'IN_APP',
} as const;

export type CanalNotificacion = (typeof CanalNotificacion)[keyof typeof CanalNotificacion];

export const FrecuenciaNotificacion = {
  INMEDIATA: 'INMEDIATA',
  DIARIA: 'DIARIA',
  SEMANAL: 'SEMANAL',
} as const;

export type FrecuenciaNotificacion = (typeof FrecuenciaNotificacion)[keyof typeof FrecuenciaNotificacion];

export interface Notificacion {
  id: string;
  usuario_id: string;
  tipo: TipoNotificacion;
  canal: CanalNotificacion;
  titulo: string;
  mensaje: string;
  estado: 'PENDIENTE' | 'ENVIADA' | 'FALLIDA' | 'LEIDA';
  fecha_creacion: string;
  fecha_envio: string | null;
  intentos: number;
}

export interface PreferenciasNotificacion {
  id: string;
  usuario_id: string;
  nuevo_anuncio: boolean;
  cambio_precio: boolean;
  nueva_resena: boolean;
  recomendacion: boolean;
  canal_preferido: CanalNotificacion;
  frecuencia: FrecuenciaNotificacion;
}

export interface NotificacionListResponse {
  notificaciones: Notificacion[];
  total: number;
  page: number;
  totalPages: number;
  no_leidas: number;
}
