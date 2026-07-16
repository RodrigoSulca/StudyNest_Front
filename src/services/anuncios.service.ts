import api from './api';
import type {
  Anuncio,
  CreateAnuncioRequest,
  SearchFilters,
  SearchResponse,
  AnuncioResponse,
} from '../types/anuncio.types';

export async function searchAnuncios(filters: SearchFilters): Promise<SearchResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  const response = await api.get<SearchResponse>(`/anuncios?${params.toString()}`);
  return response.data;
}

export async function getAnuncio(id: string): Promise<Anuncio> {
  const response = await api.get<{ anuncio: Anuncio }>(`/anuncios/${id}`);
  return response.data.anuncio;
}

export async function createAnuncio(data: CreateAnuncioRequest): Promise<Anuncio> {
  const response = await api.post<AnuncioResponse>('/anuncios', data);
  return response.data.anuncio;
}

export async function updateAnuncio(id: string, data: Partial<CreateAnuncioRequest>): Promise<Anuncio> {
  const response = await api.put<AnuncioResponse>(`/anuncios/${id}`, data);
  return response.data.anuncio;
}

export async function changeEstado(id: string, estado: string): Promise<Anuncio> {
  const response = await api.patch<AnuncioResponse>(`/anuncios/${id}/estado`, { estado });
  return response.data.anuncio;
}

export async function deleteAnuncio(id: string): Promise<void> {
  await api.delete(`/anuncios/${id}`);
}
