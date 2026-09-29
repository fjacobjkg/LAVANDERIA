export function normalizeRole(
  role: string,
) {
  return role
    .trim()
    .toLowerCase();
}


export function isOperatorRole(
  role: string,
) {
  const normalizedRole =
    normalizeRole(
      role,
    );


  return (
    normalizedRole ===
      "operador" ||
    normalizedRole ===
      "admin" ||
    normalizedRole ===
      "administrador"
  );
}


export function isOwnerRole(
  role: string,
) {
  const normalizedRole =
    normalizeRole(
      role,
    );


  return (
    normalizedRole ===
      "propietario"
  );
}


export function getHomeRouteByRole(
  role: string,
) {
  if (
    isOwnerRole(
      role,
    )
  ) {
    return "/owner/monthly-deliveries";
  }


  if (
    isOperatorRole(
      role,
    )
  ) {
    return "/services/new";
  }


  return "/login";
}