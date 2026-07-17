import { useState, useEffect } from 'react';
import { getPreferencias, savePreferencias } from '../../services/ia.service';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const SERVICIOS = [
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'agua_caliente', label: 'Hot Water' },
  { key: 'amoblado', label: 'Furnished' },
  { key: 'parqueadero', label: 'Parking' },
  { key: 'gimnasio', label: 'Gym' },
  { key: 'piscina', label: 'Pool' },
  { key: 'lavanderia', label: 'Laundry' },
] as const;

const AMOBLADO_OPTIONS = [
  { value: '', label: 'No preference' },
  { value: 'si', label: 'Yes' },
  { value: 'no', label: 'No' },
] as const;

export default function PreferenciasPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [precioMinimo, setPrecioMinimo] = useState('');
  const [precioMaximo, setPrecioMaximo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [universidad, setUniversidad] = useState('');
  const [servicios, setServicios] = useState<string[]>([]);
  const [amoblado, setAmoblado] = useState('');

  useEffect(() => {
    getPreferencias()
      .then((pref) => {
        if (!pref) return;
        setPrecioMinimo(pref.precio_minimo?.toString() ?? '');
        setPrecioMaximo(pref.precio_maximo?.toString() ?? '');
        setUbicacion(pref.ubicacion_preferida ?? '');
        setUniversidad(pref.universidad_cercana ?? '');
        setAmoblado(pref.tipo_amoblado_preferido ?? '');
        if (pref.servicios_deseados) {
          setServicios(pref.servicios_deseados.split(',').map((s) => s.trim()));
        }
      })
      .catch(() => setError('Failed to load preferences.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleServicio = (key: string) => {
    setServicios((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await savePreferencias({
        precio_minimo: precioMinimo ? Number(precioMinimo) : null,
        precio_maximo: precioMaximo ? Number(precioMaximo) : null,
        ubicacion_preferida: ubicacion || null,
        universidad_cercana: universidad || null,
        servicios_deseados: servicios.length > 0 ? servicios.join(',') : null,
        tipo_amoblado_preferido: amoblado || null,
      });
      setSuccess('Preferences saved successfully.');
    } catch {
      setError('Failed to save preferences.');
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Preferences</h1>

      {success && (
        <div className="mb-4">
          <Alert type="success" message={success} onClose={() => setSuccess('')} />
        </div>
      )}
      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Price Range</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
              <input
                type="number"
                value={precioMinimo}
                onChange={(e) => setPrecioMinimo(e.target.value)}
                placeholder="Min"
                min={0}
                className="w-full rounded-lg border border-gray-300 py-2 pl-7 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
              <input
                type="number"
                value={precioMaximo}
                onChange={(e) => setPrecioMaximo(e.target.value)}
                placeholder="Max"
                min={0}
                className="w-full rounded-lg border border-gray-300 py-2 pl-7 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Preferred Location</label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="e.g. Miraflores, Lima"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Nearby University</label>
          <input
            type="text"
            value={universidad}
            onChange={(e) => setUniversidad(e.target.value)}
            placeholder="e.g. Universidad de Lima"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Desired Services</label>
          <div className="flex flex-wrap gap-2">
            {SERVICIOS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleServicio(key)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  servicios.includes(key)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Furnished Preference</label>
          <select
            value={amoblado}
            onChange={(e) => setAmoblado(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {AMOBLADO_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" isLoading={saving} className="w-full">
          Save Preferences
        </Button>
      </form>
    </div>
  );
}
