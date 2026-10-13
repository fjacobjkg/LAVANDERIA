import logo from "../assets/logo.png";

import {
  logout,
} from "../services/auth.service";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  SidebarUserMenu,
} from "./SidebarUserMenu";

import {
  isOperatorRole,
  isOwnerRole,
} from "../utils/role-routing";


interface SidebarProps {
  isOpen: boolean;

  onClose: () => void;

  role: string;
}


export function Sidebar({
  isOpen,
  onClose,
  role,
}: SidebarProps) {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  
const isOperator =
  isOperatorRole(
    role,
  );


const isOwner =
  isOwnerRole(
    role,
  );

  const isNewServiceActive =
    location.pathname ===
    "/services/new";


  const isTrackingActive =
    location.pathname ===
    "/services";


  async function handleLogout() {
    try {
      await logout();


      navigate(
        "/login",
        {
          replace: true,
        },
      );

    } catch (error) {
      console.error(
        "No fue posible cerrar la sesión.",
        error,
      );
    }
  }

  return (

  
    <aside
      className={`sidebar ${
        isOpen ? "sidebar--open" : ""
      }`}
    >

      <div>

        {/* Marca */}
        <div className="sidebar-brand">

          <img
            src={logo}
            alt="Logo de la lavandería"
            className="sidebar-logo"
          />

          <div>
            <p className="sidebar-brand-name">
              Lavandería
            </p>

            <span className="sidebar-brand-description">
              Control de servicios
            </span>
          </div>


          {/* Solo aparece en móvil */}
          <button
            type="button"
            className="sidebar-close"
            aria-label="Cerrar menú"
            onClick={onClose}
          >
            ×
          </button>

        </div>

      {isOperator && (
      <nav className="sidebar-nav">

           <p className="sidebar-section-title">
            Recepción
          </p>

          <button
            type="button"
            className={[
              "sidebar-link",

              isNewServiceActive
                ? "sidebar-link--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              navigate("/services/new");
              onClose();
            }}
          >
            <span className="sidebar-icon">
              +  
            </span>
            Nuevo servicio
          </button>


          <p className="sidebar-section-title">
            Gestión y seguimiento
          </p>

          <button
            type="button"
            className={[
              "sidebar-link",

              isTrackingActive
                ? "sidebar-link--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              navigate("/services");
              onClose();
            }}
          >
            <span className="sidebar-icon">
              ⌕
            </span>
            Consulta y seguimiento
          </button>

          <button
            type="button"
            className={`sidebar-link ${
              location.pathname === "/services/qr-label"
                ? "sidebar-link--active"
                : ""
            }`}
            onClick={() => {
              navigate(
                "/services/qr-label",
              );

              onClose();
            }}
          >
            <span className="sidebar-icon">
              ▣
            </span>

            Etiqueta QR
          </button>

          <button
            type="button"
            className={`sidebar-link ${
              location.pathname ===
              "/services/delivery-confirmation"
                ? "sidebar-link--active"
                : ""
            }`}
            onClick={() => {
              navigate(
                "/services/delivery-confirmation",
              );

              onClose();
            }}
          >
            <span className="sidebar-icon">
              ✓
            </span>

            Confirmar entrega
          </button>


          <p className="sidebar-section-title">
            Historial y control
          </p>
            <button
              type="button"

              className={`sidebar-link ${
                location.pathname ===
                "/services/incidents-history"
                  ? "sidebar-link--active"
                  : ""
              }`}

              onClick={() => {
                navigate(
                  "/services/incidents-history",
                );

                onClose();
              }}
            >
              <span className="sidebar-icon">
                ≡
              </span>

              Incidentes e historial
            </button>
        </nav>
      )}


      {isOwner && (
        <nav className="sidebar-nav">

          <p className="sidebar-section-title">
            Administración
          </p>


          <button
            type="button"

            className={`sidebar-link ${
              location.pathname ===
              "/owner/monthly-deliveries"
                ? "sidebar-link--active"
                : ""
            }`}

            onClick={() => {
              navigate(
                "/owner/monthly-deliveries",
              );

              onClose();
            }}
          >
            <span className="sidebar-icon">
              ▣
            </span>

            Entregas mensuales
          </button>

          <button type="button"
            className={`sidebar-link ${location.pathname === "/owner/accounts" ? "sidebar-link--active" : ""}`}
            onClick={() => { navigate("/owner/accounts"); onClose(); }}>
            <span className="sidebar-icon">⚙</span>
            Cuentas y accesos
          </button>

        </nav>
      )}

      </div>


       {/* Usuario */}
       <SidebarUserMenu
          role={
            role
          }

          onLogout={
            handleLogout
          }
        />

    </aside>
  );
}
