export const EstadoMultimedia = {
  PENDIENTE: 'PENDIENTE',
  APROBADA: 'APROBADA',
  RECHAZADA: 'RECHAZADA',
} as const;

export type EstadoMultimedia = (typeof EstadoMultimedia)[keyof typeof EstadoMultimedia];

export interface Multimedia {
  id: string;
  anuncio_id: string;
  url_almacenamiento: string;
  tipo_archivo: string;
  estado: EstadoMultimedia;
  fecha_subida: string;
  orden: number;
}
