import { createContext } from 'react';
import type { Usuario, LoginRequest, RegisterRequest } from '../types/usuario.types';

export interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<string>;
  logout: () => Promise<void>;
  updateUser: (user: Usuario) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
