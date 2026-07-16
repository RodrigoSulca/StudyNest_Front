import { Link } from 'react-router-dom';
import type { Anuncio } from '../../types/anuncio.types';
import { EstadoAnuncio } from '../../types/anuncio.types';

interface TarjetaAnuncioProps {
  anuncio: Anuncio;
}

const estadoStyles: Record<string, string> = {
  [EstadoAnuncio.BORRADOR]: 'bg-gray-100 text-gray-700',
  [EstadoAnuncio.ACTIVO]: 'bg-green-100 text-green-700',
  [EstadoAnuncio.INACTIVO]: 'bg-yellow-100 text-yellow-700',
  [EstadoAnuncio.SUSPENDIDO]: 'bg-red-100 text-red-700',
};

const attributeLabels: Record<string, string> = {
  wifi: 'Wi-Fi',
  mascotas: 'Pets',
  limpieza_semanal: 'Cleaning',
  agua: 'Water',
  luz: 'Electricity',
  internet: 'Internet',
  estacionamiento: 'Parking',
  terraza: 'Terrace',
};

const attributeColors: Record<string, string> = {
  wifi: 'bg-blue-50 text-blue-700',
  mascotas: 'bg-pink-50 text-pink-700',
  limpieza_semanal: 'bg-purple-50 text-purple-700',
  agua: 'bg-cyan-50 text-cyan-700',
  luz: 'bg-amber-50 text-amber-700',
  internet: 'bg-indigo-50 text-indigo-700',
  estacionamiento: 'bg-teal-50 text-teal-700',
  terraza: 'bg-orange-50 text-orange-700',
};

function formatPrice(precio: number): string {
  return `S/ ${precio.toLocaleString()}/month`;
}

export function TarjetaAnuncio({ anuncio }: TarjetaAnuncioProps) {
  const dynamicEntries = Object.entries(anuncio.atributos_dinamicos).filter(
    ([, value]) => value === true
  );
  const visibleAttributes = dynamicEntries.slice(0, 4);
  const extraCount = dynamicEntries.length - 4;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Link
            to={`/anuncios/${anuncio.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
          >
            {anuncio.titulo}
          </Link>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoStyles[anuncio.estado] ?? 'bg-gray-100 text-gray-700'}`}>
            {anuncio.estado}
          </span>
        </div>

        <p className="mb-2 text-lg font-bold text-indigo-600">
          {formatPrice(anuncio.precio)}
        </p>

        {anuncio.direccion && (
          <p className="mb-2 text-sm text-gray-500">
            {anuncio.direccion}
          </p>
        )}

        {anuncio.tipo_amoblado && (
          <span className="mb-3 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 capitalize">
            {anuncio.tipo_amoblado.replace('_', ' ')}
          </span>
        )}

        {visibleAttributes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleAttributes.map(([key]) => (
              <span
                key={key}
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${attributeColors[key] ?? 'bg-gray-50 text-gray-600'}`}
              >
                {attributeLabels[key] ?? key}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500">
                +{extraCount} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
