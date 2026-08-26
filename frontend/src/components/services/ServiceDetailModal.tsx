import { Button } from "../Button";
import { Modal } from "../Modal";

import { ServiceStatusBadge } from "./ServiceStatusBadge";
import { ServiceStatusStepper } from "./ServiceStatusStepper";

import type {
  ServiceStatus,
  TrackingService,
} from "../../types/service-tracking.types";

interface ServiceDetailModalProps {
  isOpen: boolean;
  service: TrackingService | null;
  onClose: () => void;
}

const nextStatusLabels: Partial<
  Record<ServiceStatus, string>
> = {
  RECIBIDA: "En proceso",
  EN_PROCESO: "Lista para recoger",
};

export function ServiceDetailModal({
  isOpen,
  service,
  onClose,
}: ServiceDetailModalProps) {
  if (!service) {
    return null;
  }

  const canUpdateStatus =
    service.status === "RECIBIDA" ||
    service.status === "EN_PROCESO";

  const isReadyForPickup =
    service.status === "LISTA_RECOGER";

  const isDelivered =
    service.status === "ENTREGADA";

  const nextStatus =
    nextStatusLabels[service.status];

  return (
    <Modal
      isOpen={isOpen}
      title={service.code}
      onClose={onClose}
    >
      <div className="service-detail-modal">

        <div className="service-detail-modal-heading">
          <p>
            Información y estado del servicio seleccionado.
          </p>

          <ServiceStatusBadge
            status={service.status}
          />
        </div>


        <ServiceStatusStepper
          currentStatus={service.status}
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
              {service.client}
            </strong>
          </div>


          <div className="service-detail-row">
            <span>Teléfono</span>

            <strong>
              {service.phone ?? "No registrado"}
            </strong>
          </div>


          <div className="service-detail-row">
            <span>Total de prendas</span>

            <strong>
              {service.garments}
            </strong>
          </div>


          <div className="service-detail-row">
            <span>Estado</span>

            <ServiceStatusBadge
              status={service.status}
            />
          </div>


          <div className="service-detail-row">
            <span>Recepción</span>

            <strong>
              {service.receptionDate}
            </strong>
          </div>

        </div>


        {canUpdateStatus && nextStatus && (
          <div className="service-next-status">
            <span>
              Siguiente estado permitido
            </span>

            <strong>
              {nextStatus}
            </strong>
          </div>
        )}


        {isReadyForPickup && (
          <div className="service-delivery-notice">
            Este servicio está listo para recoger.
            La entrega debe confirmarse desde el módulo
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
          >
            Cerrar
          </Button>


          {canUpdateStatus && nextStatus && (
            <Button type="button">
              Actualizar a {nextStatus}
            </Button>
          )}

        </div>

      </div>
    </Modal>
  );
}