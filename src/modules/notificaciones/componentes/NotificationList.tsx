import { useState } from "react";
import { ETIQUETAS_TIPO, type EstadoNotificacion, type TipoNotificacion } from "../types";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";

interface Props {
  usuarioId: string;
}

const ESTADOS: EstadoNotificacion[] = ["PENDIENTE", "ENVIADA", "FALLIDA", "LEIDA"];

export function NotificationList({ usuarioId }: Props) {
  const [estado, setEstado] = useState<EstadoNotificacion | "">("");
  const [tipo, setTipo] = useState<TipoNotificacion | "">("");

  const { items, total, loading, error, marcarLeida, reintentar, eliminar, recargar } = useNotifications(
    usuarioId,
    { estado: estado || undefined, tipo: tipo || undefined }
  );

  return (
    <div className="notif-list">
      <div className="notif-list__toolbar">
        <select value={estado} onChange={(e) => setEstado(e.target.value as EstadoNotificacion | "")}>
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoNotificacion | "")}>
          <option value="">Todos los tipos</option>
          {Object.entries(ETIQUETAS_TIPO).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => recargar()} className="notif-action">
          Actualizar
        </button>
      </div>

      {loading && <p className="notif-list__status">Cargando notificaciones…</p>}
      {error && <p className="notif-list__status notif-list__status--error">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="notif-list__status">No hay notificaciones para estos filtros.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <ul className="notif-list__items">
            {items.map((n) => (
              <NotificationItem
                key={n.id}
                notificacion={n}
                onMarcarLeida={marcarLeida}
                onReintentar={reintentar}
                onEliminar={eliminar}
              />
            ))}
          </ul>
          <p className="notif-list__total">{total} notificación(es) en total</p>
        </>
      )}
    </div>
  );
}
