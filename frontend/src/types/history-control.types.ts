export type HistoryControlTab =
  | "incidents"
  | "history";


export type IncidentType =
  | "QR_DAMAGED"
  | "CORRECTION"
  | "NO_CONTACT"
  | "CANCELLATION"
  | "OTHER";


export interface IncidentServiceOption {
  id: number;

  code: string;
}


export interface IncidentRecord {
  id: number;

  serviceId: number;

  serviceCode: string;

  type: IncidentType;

  reason: string;

  detail: string;

  occurredAt: string;

  responsible: string;
}


export interface OperationHistoryRecord {
  id: number;

  serviceId: number;

  occurredAt: string;

  title: string;

  description: string;

  responsible: string;
}


export interface RegisterIncidentInput {
  serviceId: number;

  type: IncidentType;

  reason: string;

  detail: string;
}


export interface HistoryPagination {
  currentPage: number;

  totalPages: number;

  totalItems: number;
}