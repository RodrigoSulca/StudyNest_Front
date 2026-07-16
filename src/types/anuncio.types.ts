export const EstadoAnuncio = {
  BORRADOR: 'BORRADOR',
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO',
  SUSPENDIDO: 'SUSPENDIDO',
} as const;

export type EstadoAnuncio = (typeof EstadoAnuncio)[keyof typeof EstadoAnuncio];

export const TipoContrato = {
  MENSUAL: 'mensual',
  TRIMESTRAL: 'trimestral',
  ANUAL: 'anual',
} as const;

export type TipoContrato = (typeof TipoContrato)[keyof typeof TipoContrato];

export const TipoAmoblado = {
  AMOBLADO: 'amoblado',
  SIN_AMOBLADO: 'sin_amoblado',
  SEMI_AMOBLADO: 'semi_amoblado',
} as const;

export type TipoAmoblado = (typeof TipoAmoblado)[keyof typeof TipoAmoblado];

export interface AtributosDinamicos {
  wifi?: boolean;
  mascotas?: boolean;
  limpieza_semanal?: boolean;
  agua?: boolean;
  luz?: boolean;
  internet?: boolean;
  estacionamiento?: boolean;
  terraza?: boolean;
  [key: string]: boolean | string | number | undefined;
}

import type { Multimedia } from './multimedia.types';

export interface Anuncio {
  id: string;
  arrendador_id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  latitud: number | null;
  longitud: number | null;
  direccion: string | null;
  tipo_contrato: string | null;
  tipo_amoblado: string | null;
  servicios_incluidos: string | null;
  atributos_dinamicos: AtributosDinamicos;
  estado: EstadoAnuncio;
  fecha_creacion: string;
  ultima_actualizacion: string;
  multimedia?: Multimedia[];
  arrendador?: {
    id: string;
    nombre: string;
    correo: string;
  };
}

export interface CreateAnuncioRequest {
  titulo: string;
  descripcion: string;
  precio: number;
  latitud?: number;
  longitud?: number;
  direccion?: string;
  tipo_contrato?: string;
  tipo_amoblado?: string;
  servicios_incluidos?: string;
  atributos_dinamicos?: AtributosDinamicos;
}

export interface SearchFilters {
  busqueda?: string;
  precio_min?: number;
  precio_max?: number;
  tipo_amoblado?: string;
  estado?: string;
  latitud?: number;
  longitud?: number;
  radio?: number;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  anuncios: Anuncio[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AnuncioResponse {
  mensaje: string;
  anuncio: Anuncio;
}
