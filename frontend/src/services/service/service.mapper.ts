import type {
  ServiceStatus,
  TrackingService,
} from "../../types/service-tracking.types";


export interface ServiceApiResponse {
  id: number;
  code: string;
  client: string;
  phone: string | null;
  garments: number;
  status: ServiceStatus;
  observations: string | null;
  receivedAt: string;
}


function formatReceptionDate(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "es-GT",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",

      hour: "2-digit",
      minute: "2-digit",

      hour12: false,
    },
  ).format(
    new Date(date),
  );
}


export function mapTrackingService(
  service: ServiceApiResponse,
): TrackingService {
  return {
    id:
      service.id,

    code:
      service.code,

    client:
      service.client,

    phone:
      service.phone,

    garments:
      service.garments,

    status:
      service.status,

    observations:
      service.observations,

    receptionDate:
      formatReceptionDate(
        service.receivedAt,
      ),
  };
}