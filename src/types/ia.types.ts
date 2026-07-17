import type { Anuncio } from './anuncio.types';

export interface PreferenciaEstudiante {
  id: string;
  usuario_id: string;
  precio_minimo: number | null;
  precio_maximo: number | null;
  ubicacion_preferida: string | null;
  universidad_cercana: string | null;
  servicios_deseados: string | null;
  tipo_amoblado_preferido: string | null;
}

export const TipoRecomendacion = {
  UBICACION: 'UBICACION',
  PRECIO: 'PRECIO',
  PREFERENCIA: 'PREFERENCIA',
} as const;

export type TipoRecomendacion = (typeof TipoRecomendacion)[keyof typeof TipoRecomendacion];

export interface Recomendacion {
  anuncio: Anuncio;
  score: number;
  tipo: TipoRecomendacion;
}

export interface MensajeChatbot {
  respuesta: string;
  fecha: string;
}

export const PrioridadSugerencia = {
  ALTA: 'ALTA',
  MEDIA: 'MEDIA',
  BAJA: 'BAJA',
} as const;

export type PrioridadSugerencia = (typeof PrioridadSugerencia)[keyof typeof PrioridadSugerencia];

export interface Sugerencia {
  tipo: string;
  mensaje: string;
  prioridad: PrioridadSugerencia;
}

export interface BusquedaNaturalResult {
  filtros: Record<string, unknown>;
  resultados: Anuncio[];
  explicacion: string;
}

export interface ContratoMetadata {
  arrendador: string;
  inquilino: string;
  anuncio: string;
  duracion: number;
  precio: number;
}

export interface Contrato {
  html: string;
  metadata: ContratoMetadata;
}

export interface GenerateContratoRequest {
  anuncio_id: string;
  inquilino_id: string;
  duracion_meses: number;
  precio_mensual: number;
  condiciones?: string;
}
