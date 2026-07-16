export const Rol = {
  ESTUDIANTE: 'estudiante',
  ARRENDADOR: 'arrendador',
  ADMIN: 'admin',
} as const;

export type Rol = (typeof Rol)[keyof typeof Rol];

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  fecha_registro: string;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: Rol;
}

export interface UpdateProfileRequest {
  nombre?: string;
  correo?: string;
}

export interface AuthResponse {
  mensaje: string;
  usuario: Usuario;
}

export interface ApiError {
  mensaje: string;
  errores?: string[];
}
