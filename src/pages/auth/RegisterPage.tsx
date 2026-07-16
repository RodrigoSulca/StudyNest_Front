import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Rol } from '../../types/usuario.types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';

interface FormErrors {
  nombre?: string;
  correo?: string;
  contrasena?: string;
  confirmarContrasena?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [rol, setRol] = useState<Rol>(Rol.ESTUDIANTE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'Name is required';
    }

    if (!correo.trim()) {
      newErrors.correo = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      newErrors.correo = 'Invalid email format';
    }

    if (!contrasena) {
      newErrors.contrasena = 'Password is required';
    } else if (contrasena.length < 8) {
      newErrors.contrasena = 'Password must be at least 8 characters';
    }

    if (contrasena !== confirmarContrasena) {
      newErrors.confirmarContrasena = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);

    try {
      await register({ nombre, correo, contrasena, rol });
      navigate('/login');
    } catch (err) {
      const apiErr = err as { response?: { data?: { mensaje?: string } } };
      setApiError(apiErr.response?.data?.mensaje || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Create an Account
          </h1>

          {apiError && (
            <Alert type="error" message={apiError} onClose={() => setApiError('')} />
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Input
              label="Name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={errors.nombre}
              required
              placeholder="John Doe"
            />
            <Input
              label="Email"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={errors.correo}
              required
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              error={errors.contrasena}
              required
              placeholder="Min. 8 characters"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              error={errors.confirmarContrasena}
              required
              placeholder="Repeat your password"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                I am a...
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rol"
                    value={Rol.ESTUDIANTE}
                    checked={rol === Rol.ESTUDIANTE}
                    onChange={(e) => setRol(e.target.value as Rol)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Student</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rol"
                    value={Rol.ARRENDADOR}
                    checked={rol === Rol.ARRENDADOR}
                    onChange={(e) => setRol(e.target.value as Rol)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Landlord</span>
                </label>
              </div>
            </div>

            <Button type="submit" isLoading={loading} className="w-full">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
