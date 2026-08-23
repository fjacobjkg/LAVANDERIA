import logo from "../assets/logo.png";
import {logout } from "../services/auth.service";
import { useNavigate } from "react-router-dom";


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {

const navigate = useNavigate();

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


        {/* Usuario */}
        <div className="sidebar-session">

          <div className="sidebar-avatar">
            OP
          </div>

          <div>
            <span>
              Sesión actual
            </span>

            <p>
              Operador
            </p>
          </div>

        </div>


        {/* Navegación */}
        <nav className="sidebar-nav">

          <p className="sidebar-section-title">
            Recepción
          </p>

          <button
            type="button"
            className="sidebar-link sidebar-link--active"
            onClick={onClose}
          >
            <span className="sidebar-icon">
              ＋
            </span>

            Nuevo servicio
          </button>


          <p className="sidebar-section-title">
            Gestión y seguimiento
          </p>

          <button
            type="button"
            className="sidebar-link"
            onClick={onClose}
          >
            <span className="sidebar-icon">
              ⌕
            </span>

            Consulta y seguimiento
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={onClose}
          >
            <span className="sidebar-icon">
              ▣
            </span>

            Etiqueta QR
          </button>

          <button
            type="button"
            className="sidebar-link"
            onClick={onClose}
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
            className="sidebar-link"
            onClick={onClose}
          >
            <span className="sidebar-icon">
              ≡
            </span>

            Incidentes e historial
          </button>

        </nav>

      </div>


      <button
        type="button"
        className="sidebar-logout"
        onClick={handleLogout}
      >
        <svg
          className="sidebar-logout-icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 4H5.5C4.67 4 4 4.67 4 5.5v13C4 19.33 4.67 20 5.5 20H10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <path
            d="M14 8l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M18 12H9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        <span>Cerrar sesión</span>
      </button>

    </aside>
  );
}