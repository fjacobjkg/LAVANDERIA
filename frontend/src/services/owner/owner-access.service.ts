import type {
  OwnerAccount, OperatorsResponse, ChangeUsernameInput, ChangePasswordInput, CreateOperatorInput, ChangeOperatorPasswordInput,
} from "../../types/owner-access.types";

async function ownerRequest<T>(path: string, method = "GET", body?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`/api/owner${path}`, {
    method, credentials: "include", headers: { "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    ...(signal ? { signal } : {}),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message ?? "No fue posible realizar la operación.");
  return data as T;
}
export async function getOwnerAccount(signal?: AbortSignal) {
  return (await ownerRequest<{ account: OwnerAccount }>("/account", "GET", undefined, signal)).account;
}
export function getOperators(page: number, signal?: AbortSignal) {
  return ownerRequest<OperatorsResponse>(`/operators?page=${page}`, "GET", undefined, signal);
}
export async function changeOwnerUsername(input: ChangeUsernameInput) {
  return (await ownerRequest<{ account: OwnerAccount }>("/account/username", "PATCH", input)).account;
}
export function changeOwnerPassword(input: ChangePasswordInput) {
  return ownerRequest<{ message: string }>("/account/password", "PATCH", input);
}
export function createOperator(input: CreateOperatorInput) { return ownerRequest("/operators", "POST", input); }
export function setOperatorStatus(id: number, active: boolean) {
  return ownerRequest(`/operators/${id}/status`, "PATCH", { active });
}
export function changeOperatorPassword(id: number, input: ChangeOperatorPasswordInput) {
  return ownerRequest<{ message: string }>(`/operators/${id}/password`, "PATCH", input);
}
