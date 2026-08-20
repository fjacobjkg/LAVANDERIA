import type {
  CreateServiceRequest,
  CreateServiceResponse,
} from "../types/service.types";

export async function createService(
  payload: CreateServiceRequest,
): Promise<CreateServiceResponse> {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error(
      "La sesión no es válida.",
    );
  }

  const response = await fetch(
    "http://localhost:3000/api/services",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "No fue posible registrar el servicio.",
    );
  }

  return data;
}