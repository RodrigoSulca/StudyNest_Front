import api from './api';
import type {
  Recomendacion,
  MensajeChatbot,
  BusquedaNaturalResult,
  Contrato,
  PreferenciaEstudiante,
  Sugerencia,
  GenerateContratoRequest,
} from '../types/ia.types';

export async function getRecomendaciones(): Promise<Recomendacion[]> {
  const response = await api.get<{ recomendaciones: Recomendacion[] }>('/ia/recomendaciones');
  return response.data.recomendaciones;
}

export async function sendChatbotMessage(mensaje: string): Promise<MensajeChatbot> {
  const response = await api.post<MensajeChatbot>('/ia/chatbot', { mensaje });
  return response.data;
}

export async function busquedaNatural(consulta: string): Promise<BusquedaNaturalResult> {
  const response = await api.post<BusquedaNaturalResult>('/ia/busqueda-natural', { consulta });
  return response.data;
}

export async function generateContrato(data: GenerateContratoRequest): Promise<Contrato> {
  const response = await api.post<{ contrato: Contrato }>('/ia/contratos', data);
  return response.data.contrato;
}

export async function getPreferencias(): Promise<PreferenciaEstudiante | null> {
  const response = await api.get<{ preferencias: PreferenciaEstudiante | null }>('/ia/preferencias');
  return response.data.preferencias;
}

export async function savePreferencias(data: Partial<PreferenciaEstudiante>): Promise<PreferenciaEstudiante> {
  const response = await api.post<{ preferencias: PreferenciaEstudiante }>('/ia/preferencias', data);
  return response.data.preferencias;
}

export async function getSugerencias(anuncioId: string): Promise<{ sugerencias: Sugerencia[]; score: number }> {
  const response = await api.get<{ sugerencias: Sugerencia[]; score: number }>(`/ia/sugerencias/${anuncioId}`);
  return response.data;
}
