import type {
  ServiceStatus,
} from "./service-tracking.types";


export interface ServiceLabelOption {
  id: number;

  code: string;

  client:
    string | null;
}


export interface ServiceLabel {
  id: number;

  code: string;

  qrToken: string;

  client:
    string | null;

  garments: number;

  status:
    ServiceStatus;

  receivedAt: string;

  qrPrinted: boolean;

  lastQrPrintAt:
    string | null;
}