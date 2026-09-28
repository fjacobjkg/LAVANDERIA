import type {
  IncidentType,
} from "../../types/history-control.types";




interface IncidentTypeBadgeProps {
  type: IncidentType;
}


const INCIDENT_LABELS:
Record<IncidentType, string> = {
  QR_DAMAGED:
    "QR dañado",

  CORRECTION:
    "Corrección",

  NO_CONTACT:
    "Falta de contacto",

  CANCELLATION:
    "Cancelación",

  OTHER:
    "Otro",
};


const INCIDENT_CLASSES:
Record<IncidentType, string> = {
  QR_DAMAGED:
    "qr-damaged",

  CORRECTION:
    "correction",

  NO_CONTACT:
    "no-contact",

  CANCELLATION:
    "cancellation",

  OTHER:
    "other",
};


export function IncidentTypeBadge({
  type,
}: IncidentTypeBadgeProps) {
  return (
    <span
      className={`incident-type-badge incident-type-badge--${INCIDENT_CLASSES[type]}`}
    >
      <span
        className="incident-type-badge-dot"
        aria-hidden="true"
      />

      {INCIDENT_LABELS[type]}
    </span>
  );
}