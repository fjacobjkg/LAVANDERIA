import {
  ServiceStatusBadge,
} from "./ServiceStatusBadge";

import type {
  ServiceStatus,
} from "../../types/service-tracking.types";

interface DeliveryServiceDetailsProps {
  code: string;

  client: string | null;

  phone: string | null;

  garments: number;

  receivedAt: string;

  status: ServiceStatus;
}




export function DeliveryServiceDetails({
  code,
  client,
  phone,
  garments,
  receivedAt,
  status,
}: DeliveryServiceDetailsProps) {
  return (
    <div className="delivery-details">

      <div className="delivery-details-header">
        <h2>
          Información asociada
        </h2>

        <p>
          Datos recuperados antes de finalizar
          la entrega.
        </p>
      </div>


      <div className="delivery-details-content">

        <div className="delivery-details-row">
          <span>
            Servicio
          </span>

          <strong>
            {code}
          </strong>
        </div>


        <div className="delivery-details-row">
          <span>
            Cliente
          </span>

          <strong>
            {client ??
              "Sin cliente"}
          </strong>
        </div>


        <div className="delivery-details-row">
          <span>
            Teléfono
          </span>

          <strong>
            {phone ??
              "No registrado"}
          </strong>
        </div>


        <div className="delivery-details-row">
          <span>
            Total de prendas
          </span>

          <strong>
            {garments}
          </strong>
        </div>


        <div className="delivery-details-row">
          <span>
            Estado
          </span>

          <ServiceStatusBadge
            status={status}
          />
        </div>


        <div className="delivery-details-row">
          <span>
            Recepción
          </span>

          <strong>
            {receivedAt}
          </strong>
        </div>

      </div>
      
    </div>
  );
}