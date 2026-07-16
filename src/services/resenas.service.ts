import api from './api';
import type {
  Resena,
  CreateResenaRequest,
  ResenaListResponse,
  PromedioResponse,
} from '../types/resena.types';

export async function getResenasByAlojamiento(
  alojamientoId: string,
  page = 1,
  limit = 10,
  ordenar = 'fecha'
): Promise<ResenaListResponse> {
  const params = new URLSearchParams({
    alojamiento_id: alojamientoId,
    page: String(page),
    limit: String(limit),
    ordenar,
  });
  const response = await api.get<ResenaListResponse>(`/resenas?${params}`);
  return response.data;
}

export async function getResena(id: string): Promise<Resena> {
  const response = await api.get<{ resena: Resena }>(`/resenas/${id}`);
  return response.data.resena;
}

export async function createResena(data: CreateResenaRequest): Promise<Resena> {
  const response = await api.post<{ mensaje: string; resena: Resena }>(
    '/resenas',
    data
  );
  return response.data.resena;
}

export async function updateResena(
  id: string,
  data: Partial<Pick<CreateResenaRequest, 'calificacion' | 'comentario'>>
): Promise<Resena> {
  const response = await api.put<{ mensaje: string; resena: Resena }>(
    `/resenas/${id}`,
    data
  );
  return response.data.resena;
}

export async function deleteResena(id: string): Promise<void> {
  await api.delete(`/resenas/${id}`);
}

export async function reportResena(id: string, motivo: string): Promise<void> {
  await api.post(`/resenas/${id}/reporte`, { motivo });
}

export async function moderateResena(
  id: string,
  accion: 'APROBADA' | 'RECHAZADA' | 'ELIMINADA'
): Promise<Resena> {
  const response = await api.patch<{ mensaje: string; resena: Resena }>(
    `/resenas/${id}/moderar`,
    { accion }
  );
  return response.data.resena;
}

export async function getPromedio(
  alojamientoId: string
): Promise<PromedioResponse> {
  const response = await api.get<PromedioResponse>(
    `/resenas/promedio/${alojamientoId}`
  );
  return response.data;
}
