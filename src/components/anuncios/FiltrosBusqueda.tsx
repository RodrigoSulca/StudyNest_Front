import type { SearchFilters } from '../../types/anuncio.types';
import { TipoAmoblado } from '../../types/anuncio.types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface FiltrosBusquedaProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onClear: () => void;
}

const tipoAmobladoOptions = [
  { value: '', label: 'All' },
  { value: TipoAmoblado.AMOBLADO, label: 'Furnished' },
  { value: TipoAmoblado.SEMI_AMOBLADO, label: 'Semi-furnished' },
  { value: TipoAmoblado.SIN_AMOBLADO, label: 'Unfurnished' },
];

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

export function FiltrosBusqueda({ filters, onChange, onClear }: FiltrosBusquedaProps) {
  const handleAttributeToggle = (_key: string) => {
    // Attribute filters are not yet supported by the backend search endpoint.
    // This is a placeholder for future implementation.
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClear}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-3">
        <Input
          label="Min price"
          type="number"
          value={filters.precio_min ?? ''}
          onChange={(e) =>
            onChange({ ...filters, precio_min: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="0"
          min={0}
        />
        <Input
          label="Max price"
          type="number"
          value={filters.precio_max ?? ''}
          onChange={(e) =>
            onChange({ ...filters, precio_max: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="9999"
          min={0}
        />
      </div>

      <div>
        <label htmlFor="tipo-amoblado" className="mb-1 block text-sm font-medium text-gray-700">
          Furnishing
        </label>
        <select
          id="tipo-amoblado"
          value={filters.tipo_amoblado ?? ''}
          onChange={(e) => onChange({ ...filters, tipo_amoblado: e.target.value || undefined })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:outline-none"
        >
          {tipoAmobladoOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Amenities</p>
        <div className="space-y-2">
          {attributeChecks.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={false}
                onChange={() => handleAttributeToggle(key)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <Button onClick={onClear} variant="secondary" className="w-full">
        Reset Filters
      </Button>
    </div>
  );
}
