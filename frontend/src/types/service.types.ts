export interface Client {
  id: number;
  name: string;
  phone: string | null;
}

export interface CreateServiceRequest {
  idCliente?: number | null;

  clienteNuevo?: {
    nombre: string;
    telefono?: string | null;
  } | null;

  totalPrendas: number;

  observaciones?: string | null;
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