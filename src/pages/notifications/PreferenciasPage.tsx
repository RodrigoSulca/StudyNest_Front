import { useState, useEffect } from 'react';
import { getPreferencias, savePreferencias } from '../../services/notificaciones.service';
import { CanalNotificacion, FrecuenciaNotificacion } from '../../types/notificacion.types';
import type { PreferenciasNotificacion } from '../../types/notificacion.types';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function PreferenciasPage() {
  const [preferencias, setPreferencias] = useState<PreferenciasNotificacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const prefs = await getPreferencias();
        setPreferencias(prefs);
      } catch {
        setError('Failed to load preferences.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleToggle = (field: keyof PreferenciasNotificacion) => {
    if (!preferencias) return;
    setPreferencias({ ...preferencias, [field]: !preferencias[field] });
  };

  const handleSelectChange = (field: keyof PreferenciasNotificacion, value: string) => {
    if (!preferencias) return;
    setPreferencias({ ...preferencias, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferencias) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await savePreferencias({
        nuevo_anuncio: preferencias.nuevo_anuncio,
        cambio_precio: preferencias.cambio_precio,
        nueva_resena: preferencias.nueva_resena,
        recomendacion: preferencias.recomendacion,
        canal_preferido: preferencias.canal_preferido,
        frecuencia: preferencias.frecuencia,
      });
      setPreferencias(updated);
      setSuccess('Preferences saved successfully.');
    } catch {
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!preferencias) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Alert type="error" message="Could not load preferences." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Notification Preferences</h1>

      {success && (
        <div className="mb-6">
          <Alert type="success" message={success} onClose={() => setSuccess('')} />
        </div>
      )}

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Notification Types</h2>
          <div className="space-y-4">
            <ToggleRow
              label="New listings"
              description="Get notified when new housing listings match your interests"
              checked={preferencias.nuevo_anuncio}
              onChange={() => handleToggle('nuevo_anuncio')}
            />
            <ToggleRow
              label="Price changes"
              description="Get notified when listing prices change"
              checked={preferencias.cambio_precio}
              onChange={() => handleToggle('cambio_precio')}
            />
            <ToggleRow
              label="New reviews"
              description="Get notified when someone reviews your listings"
              checked={preferencias.nueva_resena}
              onChange={() => handleToggle('nueva_resena')}
            />
            <ToggleRow
              label="Recommendations"
              description="Get personalized housing recommendations"
              checked={preferencias.recomendacion}
              onChange={() => handleToggle('recomendacion')}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Delivery Settings</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="canal" className="block text-sm font-medium text-gray-700">
                Preferred channel
              </label>
              <select
                id="canal"
                value={preferencias.canal_preferido}
                onChange={(e) => handleSelectChange('canal_preferido', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={CanalNotificacion.IN_APP}>In-app</option>
                <option value={CanalNotificacion.EMAIL}>Email</option>
                <option value={CanalNotificacion.PUSH}>Push</option>
              </select>
            </div>

            <div>
              <label htmlFor="frecuencia" className="block text-sm font-medium text-gray-700">
                Notification frequency
              </label>
              <select
                id="frecuencia"
                value={preferencias.frecuencia}
                onChange={(e) => handleSelectChange('frecuencia', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={FrecuenciaNotificacion.INMEDIATA}>Immediate</option>
                <option value={FrecuenciaNotificacion.DIARIA}>Daily digest</option>
                <option value={FrecuenciaNotificacion.SEMANAL}>Weekly digest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={saving}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          checked ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
