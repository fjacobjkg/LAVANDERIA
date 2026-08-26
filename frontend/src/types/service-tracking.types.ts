export type ServiceStatus =
  | "RECIBIDA"
  | "EN_PROCESO"
  | "LISTA_RECOGER"
  | "ENTREGADA";

export type ServiceStatusFilter =
  | ServiceStatus
  | "ALL";

export interface TrackingService {
  id: number;

  code: string;

  client: string;

  phone: string | null;

  garments: number;

  status: ServiceStatus;

  receptionDate: string;
}

export interface ServicePagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}