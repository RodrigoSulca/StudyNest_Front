import { useState } from "react";
import { NotificationBell } from "./components/NotificationBell";
import { NotificationList } from "./components/NotificationList";
import { PreferencesPanel } from "./components/PreferencesPanel";
import "./notifications.css";

// TODO: reemplazar por el usuario autenticado real cuando el modulo de
// Gestion de Usuarios (Integrante 4) exponga el contexto de sesion.
const DEMO_USER_ID = "11111111-1111-1111-1111-111111111111";

type Tab = "notificaciones" | "preferencias";

export function NotificationsPage() {
  const [tab, setTab] = useState<Tab>("notificaciones");

  return (
    <div className="notif-page">
      <header className="notif-page__header">
        <div>
          <h1>Notificaciones y Eventos</h1>
          <p>Módulo 3 · StudentNest</p>
        </div>
        <NotificationBell usuarioId={DEMO_USER_ID} onVerTodas={() => setTab("notificaciones")} />
      </header>

      <nav className="notif-page__tabs">
        <button
          type="button"
          className={tab === "notificaciones" ? "notif-tab notif-tab--active" : "notif-tab"}
          onClick={() => setTab("notificaciones")}
        >
          Mis notificaciones
        </button>
        <button
          type="button"
          className={tab === "preferencias" ? "notif-tab notif-tab--active" : "notif-tab"}
          onClick={() => setTab("preferencias")}
        >
          Preferencias
        </button>
      </nav>

      <main className="notif-page__content">
        {tab === "notificaciones" ? (
          <NotificationList usuarioId={DEMO_USER_ID} />
        ) : (
          <PreferencesPanel usuarioId={DEMO_USER_ID} />
        )}
      </main>
    </div>
  );
}
