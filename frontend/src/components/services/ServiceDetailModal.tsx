import { Button } from "../Button";
import { Modal } from "../Modal";

import { ServiceStatusBadge } from "./ServiceStatusBadge";
import { ServiceStatusStepper } from "./ServiceStatusStepper";

import type {
  TrackingService,
} from "../../types/service-tracking.types";

interface ServiceDetailModalProps {
  isOpen: boolean;
  service: TrackingService | null;
  onClose: () => void;
}


interface ServiceDetailModalProps {
  isOpen: boolean;

  service:
    TrackingService | null;

  onClose:
    () => void;

  onAdvanceStatus:
    () => void;

  isUpdatingStatus:
    boolean;
}

export function ServiceDetailModal({
  isOpen,
  service,
  onClose,
  onAdvanceStatus,
  isUpdatingStatus,
}: ServiceDetailModalProps) {
  if (!service) {
    return null;
  }


  const isReceived =
    service.status === "RECIBIDA";

  const isInProcess =
    service.status === "EN_PROCESO";

  const isReadyForPickup =
    service.status ===
    "LISTA_PARA_RECOGER";

  const isDelivered =
    service.status === "ENTREGADA";

  const canAdvanceStatus =
  isReceived ||
  isInProcess;

  const nextStatusLabel =
  isReceived
    ? "En proceso"
    : isInProcess
      ? "Lista para recoger"
      : null;

  const canNotifyByWhatsApp =
  Boolean(
    service.client &&
    service.phone,
  );

 return (
    <Modal
      isOpen={isOpen}
      title={service.code}
      onClose={onClose}
    >
      <div className="service-detail-modal">

        <div className="service-detail-modal-heading">
          <p>
            Información y estado del
            servicio seleccionado.
          </p>

          <ServiceStatusBadge
            status={service.status}
          />
        </div>


        <ServiceStatusStepper
          currentStatus={
            service.status
          }
        />


        <div className="service-detail-data">

          <div className="service-detail-row">
            <span>Servicio</span>

            <strong>
              {service.code}
            </strong>
          </div>


          <div className="service-detail-row">
            <span>Cliente</span>

            <strong>
              {service.client ?? "No registrado"}
            </strong>
          </div>


          <div className="service-detail-row">
            <span>Teléfono</span>

            <strong>
              {service.phone ?? "No registrado"}
            </strong>
          </div>


          <div className="service-detail-row">
            <span>
              Total de prendas
            </span>

            <strong>
              {service.garments}
            </strong>
          </div>


          <div className="service-detail-row service-detail-row--observations">
            <span>Observaciones</span>

            <strong>
              {service.observations ??
                "Sin observaciones"}
            </strong>
          </div>


          <div className="service-detail-row">
            <span>Recepción</span>

            <strong>
              {service.receptionDate}
            </strong>
          </div>

        </div>


        {canAdvanceStatus &&
        nextStatusLabel && (
          <div className="service-next-status">
            <span>
              Siguiente estado permitido
            </span>

            <strong>
              {nextStatusLabel}
            </strong>
          </div>
        )}

        {isInProcess &&
          canNotifyByWhatsApp && (
            <div className="service-whatsapp-notice">
              Al actualizar este servicio a
              Lista para recoger se preparará
              el aviso al cliente por WhatsApp.
            </div>
          )}


        {isReadyForPickup && (
          <div className="service-delivery-notice">
            Este servicio está listo para
            recoger. La entrega debe
            confirmarse desde el módulo
            Confirmar entrega.
          </div>
        )}


        {isDelivered && (
          <div className="service-finished-status">
            Este servicio ha finalizado.
          </div>
        )}


        <div className="service-detail-modal-actions">

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isUpdatingStatus}
          >
            Cerrar
          </Button>


          {canAdvanceStatus &&
            nextStatusLabel && (
            <Button
              type="button"
              onClick={onAdvanceStatus}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus
                ? "Actualizando..."
                : `Actualizar a ${nextStatusLabel}`}
            </Button>
          )}

        </div>

      </div>
    </Modal>
  );
}