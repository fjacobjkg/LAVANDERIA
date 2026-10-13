export const ACTIVE_ROLES = ["PROPIETARIO", "OPERADOR"] as const;
export type ActiveRole = typeof ACTIVE_ROLES[number];

export function isActiveRole(role: string): role is ActiveRole {
  return ACTIVE_ROLES.some((activeRole) => activeRole === role);
}
