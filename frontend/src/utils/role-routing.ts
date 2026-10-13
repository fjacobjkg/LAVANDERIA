export function normalizeRole(role: string) { return role.trim().toLowerCase(); }
export function isOperatorRole(role: string) { return normalizeRole(role) === "operador"; }
export function isOwnerRole(role: string) { return normalizeRole(role) === "propietario"; }
export function getHomeRouteByRole(role: string) {
  if (isOwnerRole(role)) return "/owner/monthly-deliveries";
  if (isOperatorRole(role)) return "/services/new";
  return "/login";
}
