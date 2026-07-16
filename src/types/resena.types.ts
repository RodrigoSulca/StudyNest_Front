export const EstadoResena = {
  PENDIENTE: 'PENDIENTE',
  ACTIVA: 'ACTIVA',
  REPORTADA: 'REPORTADA',
  ELIMINADA: 'ELIMINADA',
} as const;

export type EstadoResena = (typeof EstadoResena)[keyof typeof EstadoResena];

export interface Resena {
  id: string;
  usuario_id: string;
  alojamiento_id: string;
  calificacion: number;
  comentario: string;
  estado: EstadoResena;
  fecha_publicacion: string;
  fecha_edicion: string | null;
  reporte_count: number;
  autor?: {
    id: string;
    nombre: string;
  };
}

export interface CreateResenaRequest {
  alojamiento_id: string;
  calificacion: number;
  comentario: string;
}

export interface ResenaListResponse {
  resenas: Resena[];
  total: number;
  page: number;
  totalPages: number;
  promedio: number;
}

export interface PromedioResponse {
  promedio: number;
  total_resenas: number;
}
