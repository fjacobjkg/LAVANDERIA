export interface Client {
  id: number;
  name: string;
  phone: string | null;
}

export interface CreateServiceRequest {
  idCliente?: number | null;

  totalPrendas: number;

  observaciones: string;
}

export interface RegisteredService {
  id: number;
  code: string;
  qrToken: string;
  totalGarments: number;
  status: string;
  observations: string | null;
  receivedAt: string;

  client: Client | null;
}

export interface CreateServiceResponse {
  message: string;
  service: RegisteredService;
}