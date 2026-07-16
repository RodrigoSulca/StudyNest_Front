import { ETIQUETAS_CANAL, ETIQUETAS_TIPO, type Notificacion } from "../types";

interface Props {
  notificacion: Notificacion;
  onMarcarLeida: (id: string) => void;
  onReintentar: (id: string) => void;
  onEliminar: (id: string) => void;
}

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NotificationItem({ notificacion, onMarcarLeida, onReintentar, onEliminar }: Props) {
  const { id, titulo, mensaje, tipo, canal, estado, leida, fecha_creacion, intentos } = notificacion;

  return (
    <li className={`notif-item${leida ? "" : " notif-item--unread"}`}>
      <div className="notif-item__dot" aria-hidden="true" />
      <div className="notif-item__content">
        <div className="notif-item__header">
          <span className="notif-item__title">{titulo}</span>
          <span className={`notif-badge notif-badge--${estado.toLowerCase()}`}>{estado}</span>
        </div>
        <p className="notif-item__message">{mensaje}</p>
        <div className="notif-item__meta">
          <span>{ETIQUETAS_TIPO[tipo]}</span>
          <span>·</span>
          <span>{ETIQUETAS_CANAL[canal]}</span>
          <span>·</span>
          <span>{formatearFecha(fecha_creacion)}</span>
        </div>
      </div>
      <div className="notif-item__actions">
        {!leida && (
          <button type="button" onClick={() => onMarcarLeida(id)} className="notif-action">
            Marcar leída
          </button>
        )}
        {estado === "FALLIDA" && intentos < 3 && (
          <button type="button" onClick={() => onReintentar(id)} className="notif-action">
            Reintentar
          </button>
        )}
        <button type="button" onClick={() => onEliminar(id)} className="notif-action notif-action--danger">
          Eliminar
        </button>
      </div>
    </li>
  );
}
