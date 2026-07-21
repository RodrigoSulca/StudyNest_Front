export const EstadoMultimedia = {
  PENDIENTE: 'PENDIENTE',
  APROBADA: 'APROBADA',
  RECHAZADA: 'RECHAZADA',
} as const;

export type EstadoMultimedia = (typeof EstadoMultimedia)[keyof typeof EstadoMultimedia];

export interface RegistroValidacionIA {
  id: string;
  multimedia_id: string;
  etiqueta_detectada: string;
  // pg devuelve DECIMAL como string; se normaliza con Number() al mostrar.
  score_confianza: number | string;
  decision_automatica: 'ACEPTADA' | 'RECHAZADA';
  fecha_analisis: string;
}

export interface Multimedia {
  id: string;
  anuncio_id: string;
  url_almacenamiento: string;
  tipo_archivo: string;
  estado: EstadoMultimedia;
  fecha_subida: string;
  orden: number;
  registros_validacion?: RegistroValidacionIA[];
}
