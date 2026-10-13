export interface MonthlyDelivery {
  id: number;

  code: string;

  client:
    string | null;

  phone:
    string | null;

  garments: number;

  receivedAt: string;

  deliveredAt: string;
}

export interface MonthlyDeliveriesResponse {
  summary: MonthlyDeliverySummary;
  deliveries: MonthlyDelivery[];
  pagination: { currentPage: number; totalPages: number; totalItems: number };
}


export interface MonthlyDeliverySummary {
  deliveredServices:
    number;

  totalGarments:
    number;
}
