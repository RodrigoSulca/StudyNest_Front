import { useState, type FormEvent } from 'react';
import type { CreateAnuncioRequest, AtributosDinamicos } from '../../types/anuncio.types';
import { TipoContrato, TipoAmoblado } from '../../types/anuncio.types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

interface FormularioAnuncioProps {
  initialData?: Partial<CreateAnuncioRequest>;
  onSubmit: (data: CreateAnuncioRequest) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

const defaultFormData: CreateAnuncioRequest = {
  titulo: '',
  descripcion: '',
  precio: 0,
  direccion: '',
  tipo_contrato: '',
  tipo_amoblado: '',
  servicios_incluidos: '',
  atributos_dinamicos: {},
};

interface FormErrors {
  titulo?: string;
  descripcion?: string;
  precio?: string;
}

const attributeChecks = [
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'mascotas', label: 'Pets allowed' },
  { key: 'limpieza_semanal', label: 'Weekly cleaning' },
  { key: 'agua', label: 'Water included' },
  { key: 'luz', label: 'Electricity included' },
  { key: 'internet', label: 'Internet' },
  { key: 'estacionamiento', label: 'Parking' },
  { key: 'terraza', label: 'Terrace' },
];

export function FormularioAnuncio({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Publish Listing',
}: FormularioAnuncioProps) {
  const [formData, setFormData] = useState<CreateAnuncioRequest>({
    ...defaultFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Title is required';
    } else if (formData.titulo.length < 5) {
      newErrors.titulo = 'Title must be at least 5 characters';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Description is required';
    } else if (formData.descripcion.length < 20) {
      newErrors.descripcion = 'Description must be at least 20 characters';
    }

    if (formData.precio <= 0) {
      newErrors.precio = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    try {
      await onSubmit({
        ...formData,
        tipo_contrato: formData.tipo_contrato || undefined,
        tipo_amoblado: formData.tipo_amoblado || undefined,
        servicios_incluidos: formData.servicios_incluidos || undefined,
        direccion: formData.direccion || undefined,
      });
    } catch (err) {
      const apiErr = err as { response?: { data?: { mensaje?: string } } };
      setApiError(apiErr.response?.data?.mensaje || 'An error occurred. Please try again.');
    }
  };

  const handleAttributeToggle = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      atributos_dinamicos: {
        ...(prev.atributos_dinamicos ?? {}),
        [key]: !prev.atributos_dinamicos?.[key],
      } as AtributosDinamicos,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && (
        <Alert type="error" message={apiError} onClose={() => setApiError('')} />
      )}

      <Input
        label="Title"
        value={formData.titulo}
        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
        error={errors.titulo}
        required
        placeholder="e.g. Cozy room near university"
      />

      <div className="space-y-1">
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          rows={4}
          className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            errors.descripcion
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          placeholder="Describe your listing..."
        />
        {errors.descripcion && (
          <p className="text-sm text-red-600">{errors.descripcion}</p>
        )}
      </div>

      <Input
        label="Price (S/ per month)"
        type="number"
        value={formData.precio || ''}
        onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
        error={errors.precio}
        required
        min={1}
        placeholder="0"
      />

      <Input
        label="Address"
        value={formData.direccion ?? ''}
        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
        placeholder="e.g. Av. Universitaria 123"
      />

      <div>
        <label htmlFor="tipo-contrato" className="mb-1 block text-sm font-medium text-gray-700">
          Contract type
        </label>
        <select
          id="tipo-contrato"
          value={formData.tipo_contrato ?? ''}
          onChange={(e) => setFormData({ ...formData, tipo_contrato: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:outline-none"
        >
          <option value="">Select...</option>
          <option value={TipoContrato.MENSUAL}>Monthly</option>
          <option value={TipoContrato.TRIMESTRAL}>Quarterly</option>
          <option value={TipoContrato.ANUAL}>Annual</option>
        </select>
      </div>

      <div>
        <label htmlFor="tipo-amoblado" className="mb-1 block text-sm font-medium text-gray-700">
          Furnishing
        </label>
        <select
          id="tipo-amoblado"
          value={formData.tipo_amoblado ?? ''}
          onChange={(e) => setFormData({ ...formData, tipo_amoblado: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:outline-none"
        >
          <option value="">Select...</option>
          <option value={TipoAmoblado.AMOBLADO}>Furnished</option>
          <option value={TipoAmoblado.SEMI_AMOBLADO}>Semi-furnished</option>
          <option value={TipoAmoblado.SIN_AMOBLADO}>Unfurnished</option>
        </select>
      </div>

      <Input
        label="Included services (comma-separated)"
        value={formData.servicios_incluidos ?? ''}
        onChange={(e) => setFormData({ ...formData, servicios_incluidos: e.target.value })}
        placeholder="e.g. Water, Electricity, Internet"
      />

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Amenities</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {attributeChecks.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 rounded-lg border border-gray-200 p-2 text-sm text-gray-600 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={!!formData.atributos_dinamicos?.[key]}
                onChange={() => handleAttributeToggle(key)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
