import type {
  ServiceStatus,
} from "../../types/service-tracking.types";
import "../../styles/service-status-badge.css";

interface ServiceStatusBadgeProps {
  status: ServiceStatus;
}

const statusLabels: Record<
  ServiceStatus,
  string
> = {
  RECIBIDA: "Recepción",
  EN_PROCESO: "En proceso",
  LISTA_PARA_RECOGER: "Lista para recoger",
  ENTREGADA: "Entregada",
};

export function ServiceStatusBadge({
  status,
}: ServiceStatusBadgeProps) {
  return (
    <span
      className={`service-status service-status--${status.toLowerCase()}`}
    >
      <span className="service-status-dot" />

      {statusLabels[status]}
    </span>
  );
}