import { useEffect, useState } from "react";
import { notificationsApi } from "../api/notificationsApi";
import {
  ETIQUETAS_TIPO,
  type CanalNotificacion,
  type FrecuenciaNotificacion,
  type PreferenciaNotificacion,
} from "../types";

interface Props {
  usuarioId: string;
}

const CANALES: CanalNotificacion[] = ["IN_APP", "EMAIL", "PUSH"];
const FRECUENCIAS: FrecuenciaNotificacion[] = ["INMEDIATA", "DIARIA", "SEMANAL"];

export function PreferencesPanel({ usuarioId }: Props) {
  const [preferencias, setPreferencias] = useState<PreferenciaNotificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardandoTipo, setGuardandoTipo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuarioId) return;
    notificationsApi
      .obtenerPreferencias(usuarioId)
      .then(setPreferencias)
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar preferencias"))
      .finally(() => setLoading(false));
  }, [usuarioId]);

  async function actualizar(
    pref: PreferenciaNotificacion,
    cambios: Partial<Pick<PreferenciaNotificacion, "canal_preferido" | "activo" | "frecuencia">>
  ) {
    setGuardandoTipo(pref.tipo_notificacion);
    const actualizado = { ...pref, ...cambios };
    setPreferencias((prev) =>
      prev.map((p) => (p.tipo_notificacion === pref.tipo_notificacion ? actualizado : p))
    );
    try {
      await notificationsApi.actualizarPreferencia(usuarioId, pref.tipo_notificacion, cambios);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la preferencia");
    } finally {
      setGuardandoTipo(null);
    }
  }

  if (loading) return <p className="notif-list__status">Cargando preferencias…</p>;

  return (
    <div className="notif-preferences">
      {error && <p className="notif-list__status notif-list__status--error">{error}</p>}
      <table className="notif-preferences__table">
        <thead>
          <tr>
            <th>Tipo de notificación</th>
            <th>Canal preferido</th>
            <th>Frecuencia</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {preferencias.map((pref) => (
            <tr key={pref.tipo_notificacion}>
              <td>{ETIQUETAS_TIPO[pref.tipo_notificacion]}</td>
              <td>
                <select
                  value={pref.canal_preferido}
                  disabled={guardandoTipo === pref.tipo_notificacion}
                  onChange={(e) => actualizar(pref, { canal_preferido: e.target.value as CanalNotificacion })}
                >
                  {CANALES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={pref.frecuencia}
                  disabled={guardandoTipo === pref.tipo_notificacion}
                  onChange={(e) => actualizar(pref, { frecuencia: e.target.value as FrecuenciaNotificacion })}
                >
                  {FRECUENCIAS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={pref.activo}
                  disabled={guardandoTipo === pref.tipo_notificacion}
                  onChange={(e) => actualizar(pref, { activo: e.target.checked })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
