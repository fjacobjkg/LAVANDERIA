import type {
  ServiceStatus,
} from "./service-tracking.types";


export interface DeliveryServiceOption {
  id: number;

  code: string;

  client:
    string | null;
}


export interface DeliveryService {
  id: number;

  code: string;

  client:
    string | null;

  phone:
    string | null;

  garments: number;

  status:
    ServiceStatus;

  receivedAt:
    string;
}


export type QrValidationStatus =
  | "IDLE"
  | "VALIDATING"
  | "VALID"
  | "INVALID";

 export interface QrValidationResult {
  success: boolean;

  message: string;
}