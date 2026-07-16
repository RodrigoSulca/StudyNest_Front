import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../services/auth.service';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [correo, setCorreo] = useState(user?.correo || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const updatedUser = await updateProfile({ nombre, correo });
      updateUser(updatedUser);
      navigate('/perfil');
    } catch (err) {
      const apiError = err as { response?: { data?: { mensaje?: string } } };
      setError(apiError.response?.data?.mensaje || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Profile</h1>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            label="Name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <div className="flex gap-3">
            <Button type="submit" isLoading={loading}>
              Save Changes
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/perfil')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
