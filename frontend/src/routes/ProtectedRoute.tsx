import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  getCurrentUser,
} from "../services/auth.service";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const [isChecking, setIsChecking] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        await getCurrentUser();

        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    }

    void checkSession();
  }, []);

  if (isChecking) {
    return (
      <div>
        Verificando sesión...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}