import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, type SessionUser } from "../services/auth.service";
import { getHomeRouteByRole, isOperatorRole, isOwnerRole } from "../utils/role-routing";

interface Props { children: ReactNode; role?: "OPERADOR" | "PROPIETARIO" }
export function ProtectedRoute({ children, role }: Props) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let cancelled = false;
    getCurrentUser().then((current) => { if (!cancelled) setUser(current); })
      .catch(() => { if (!cancelled) setUser(null); })
      .finally(() => { if (!cancelled) setChecking(false); });
    return () => { cancelled = true; };
  }, []);
  if (checking) return <div role="status">Verificando sesión…</div>;
  if (!user || (!isOwnerRole(user.role) && !isOperatorRole(user.role))) return <Navigate to="/login" replace />;
  if (role && normalizeRoleName(user.role) !== role) return <Navigate to={getHomeRouteByRole(user.role)} replace />;
  return children;
}
function normalizeRoleName(role: string) { return role.trim().toUpperCase(); }
