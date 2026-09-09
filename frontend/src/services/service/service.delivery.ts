import type {
  DeliveryService,
  DeliveryServiceOption,
} from "../../types/delivery.types";


interface DeliveryOptionsResponse {
  services:
    DeliveryServiceOption[];
}


interface DeliveryServiceResponse {
  service:
    DeliveryService;
}


interface ConfirmDeliveryResponse {
  message: string;

  service:
    DeliveryService;
}


export async function getDeliveryOptions():
Promise<DeliveryServiceOption[]> {
  const response =
    await fetch(
      "/api/services/delivery-options",
      {
        method: "GET",

        credentials:
          "include",
      },
    );


  const data =
    await response
      .json()
      .catch(() => null);


  if (!response.ok) {
    throw new Error(
      data?.message ??
        "No se pudieron consultar los servicios disponibles para entrega.",
    );
  }


  const result =
    data as DeliveryOptionsResponse;


  return result.services;
}


export async function getDeliveryService(
  serviceId: number,
): Promise<DeliveryService> {
  const response =
    await fetch(
      `/api/services/${serviceId}/delivery`,
      {
        method: "GET",

        credentials:
          "include",
      },
    );


  const data =
    await response
      .json()
      .catch(() => null);


  if (!response.ok) {
    throw new Error(
      data?.message ??
        "No se pudo consultar el servicio.",
    );
  }


  const result =
    data as DeliveryServiceResponse;


  return result.service;
}


export async function validateDeliveryQr(
  serviceId: number,
  qrToken: string,
): Promise<void> {
  const response =
    await fetch(
      `/api/services/${serviceId}/delivery/validate-qr`,
      {
        method:
          "POST",

        credentials:
          "include",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            qrToken,
          }),
      },
    );


  const data =
    await response
      .json()
      .catch(() => null);


  if (!response.ok) {
    throw new Error(
      data?.message ??
        "El código QR no pudo validarse.",
    );
  }
}


export async function confirmDelivery(
  serviceId: number,
  qrToken: string,
): Promise<DeliveryService> {
  const response =
    await fetch(
      `/api/services/${serviceId}/delivery/confirm`,
      {
        method:
          "POST",

        credentials:
          "include",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            qrToken,
          }),
      },
    );


  const data =
    await response
      .json()
      .catch(() => null);


  if (!response.ok) {
    throw new Error(
      data?.message ??
        "No se pudo confirmar la entrega.",
    );
  }


  const result =
    data as ConfirmDeliveryResponse;


  return result.service;
}