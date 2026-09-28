import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Sidebar,
} from "./Sidebar";

import {
  getCurrentUser,
} from "../services/auth.service";

import type {
  SessionUser,
} from "../services/auth.service";

import "../styles/layout.css";


interface AppLayoutProps {
  children: ReactNode;
}


export function AppLayout({
  children,
}: AppLayoutProps) {

  const [
    sidebarOpen,
    setSidebarOpen,
  ] =
    useState(false);


  const [
    user,
    setUser,
  ] =
    useState<SessionUser | null>(
      null,
    );


  useEffect(() => {
    let cancelled =
      false;


    async function loadCurrentUser() {
      try {
        const currentUser =
          await getCurrentUser();


        if (cancelled) {
          return;
        }


        setUser(
          currentUser,
        );

      } catch (error) {
        console.error(
          "No fue posible obtener el usuario de la sesión.",
          error,
        );
      }
    }


    void loadCurrentUser();


    return () => {
      cancelled =
        true;
    };
  }, []);


  return (
    <div className="app-layout">

      {/* Barra móvil */}

      <div className="mobile-navigation">

        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Abrir menú"
          aria-expanded={
            sidebarOpen
          }
          onClick={() =>
            setSidebarOpen(
              true,
            )
          }
        >
          <span />
          <span />
          <span />
        </button>


        <span className="mobile-navigation-title">
          Control de servicios
        </span>

      </div>


      {/* Fondo oscuro en móvil */}

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Cerrar menú"
          onClick={() =>
            setSidebarOpen(
              false,
            )
          }
        />
      )}


      <Sidebar
        isOpen={
          sidebarOpen
        }

        onClose={() =>
          setSidebarOpen(
            false,
          )
        }

        role={
          user?.role ??
          ""
        }
      />


      <main className="app-content">
        {children}
      </main>

    </div>
  );
}