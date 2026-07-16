import api from './api';
import type { Multimedia } from '../types/multimedia.types';
import type { EstadoMultimedia } from '../types/multimedia.types';

interface UploadResponse {
  multimedia: Multimedia[];
}

interface MultimediaListResponse {
  multimedia: Multimedia[];
}

export async function uploadMultimedia(
  anuncioId: string,
  files: File[],
  onProgress?: (percent: number) => void,
): Promise<Multimedia[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('archivos', file));

  const response = await api.post<UploadResponse>(
    `/multimedia/upload/${anuncioId}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (e.total && onProgress) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    },
  );
  return response.data.multimedia;
}

export async function getMultimediaByAnuncio(anuncioId: string): Promise<Multimedia[]> {
  const response = await api.get<MultimediaListResponse>(`/multimedia/anuncio/${anuncioId}`);
  return response.data.multimedia;
}

export async function updateOrden(id: string, orden: number): Promise<Multimedia> {
  const response = await api.patch<{ multimedia: Multimedia }>(`/multimedia/${id}/orden`, { orden });
  return response.data.multimedia;
}

export async function updateEstado(id: string, estado: EstadoMultimedia): Promise<Multimedia> {
  const response = await api.patch<{ multimedia: Multimedia }>(`/multimedia/${id}/estado`, { estado });
  return response.data.multimedia;
}

export async function deleteMultimedia(id: string): Promise<void> {
  await api.delete(`/multimedia/${id}`);
}
