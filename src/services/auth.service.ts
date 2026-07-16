import api from './api';
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  AuthResponse,
  Usuario,
} from '../types/usuario.types';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/usuarios/login', data);
  return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/usuarios/registro', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/usuarios/logout');
}

export async function getProfile(): Promise<Usuario> {
  const response = await api.get<Usuario>('/usuarios/perfil');
  return response.data;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<Usuario> {
  const response = await api.put<Usuario>('/usuarios/perfil', data);
  return response.data;
}
