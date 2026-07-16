import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { LoginRequest, RegisterRequest, Usuario } from '../types/usuario.types';
import { AuthContext } from './AuthContextDefinition';
import * as authService from '../services/auth.service';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (data: LoginRequest): Promise<void> => {
    const response = await authService.login(data);
    setUser(response.usuario);
  };

  const register = async (data: RegisterRequest): Promise<string> => {
    const response = await authService.register(data);
    return response.mensaje;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: Usuario) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
