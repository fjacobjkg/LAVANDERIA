import type { Client } from "../types/service.types";

interface ClientsResponse {
  clients: Client[];
}

export async function getClients(): Promise<Client[]> {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://localhost:3000/api/clients",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "No fue posible obtener los clientes.",
    );
  }

  return (data as ClientsResponse).clients;
}