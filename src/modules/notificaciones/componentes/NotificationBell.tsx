import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";

interface Props {
  usuarioId: string;
  onVerTodas: () => void;
}

export function NotificationBell({ usuarioId, onVerTodas }: Props) {
  const [abierto, setAbierto] = useState(false);
  const { items, unreadCount, marcarLeida } = useNotifications(usuarioId, { limit: 5 });

  return (
    <div className="notif-bell">
      <button
        type="button"
        className="notif-bell__button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ""}`}
      >
        🔔
        {unreadCount > 0 && <span className="notif-bell__badge">{unreadCount}</span>}
      </button>

      {abierto && (
        <div className="notif-bell__dropdown">
          <div className="notif-bell__dropdown-header">
            <strong>Notificaciones</strong>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar">
              ×
            </button>
          </div>
          {items.length === 0 && <p className="notif-list__status">Sin novedades por ahora.</p>}
          <ul className="notif-bell__preview-list">
            {items.map((n) => (
              <li
                key={n.id}
                className={`notif-bell__preview-item${n.leida ? "" : " notif-bell__preview-item--unread"}`}
                onClick={() => !n.leida && marcarLeida(n.id)}
              >
                <span className="notif-bell__preview-title">{n.titulo}</span>
                <span className="notif-bell__preview-message">{n.mensaje}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="notif-bell__see-all"
            onClick={() => {
              setAbierto(false);
              onVerTodas();
            }}
          >
            Ver todas
          </button>
        </div>
      )}
    </div>
  );
}
