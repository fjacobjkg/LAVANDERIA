import {
  useState,
} from "react";


interface SidebarUserMenuProps {
  onLogout: () => void;
}


export function SidebarUserMenu({
  onLogout,
}: SidebarUserMenuProps) {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);


  return (
    <div className="sidebar-user-menu">

      {isOpen && (
        <div className="sidebar-user-dropdown">

          <button
            type="button"
            className="sidebar-user-logout"
            onClick={onLogout}
          >
            <svg
              className="sidebar-user-logout-icon"
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

            <span>
              Cerrar sesión
            </span>
          </button>

        </div>
      )}


      <button
        type="button"
        className={`sidebar-user-trigger ${
          isOpen
            ? "sidebar-user-trigger--open"
            : ""
        }`}
        aria-expanded={isOpen}
        onClick={() =>
          setIsOpen(
            (current) =>
              !current,
          )
        }
      >

        <div className="sidebar-user-avatar">
          OP
        </div>


        <div className="sidebar-user-info">

          <strong>
            Operador
          </strong>

          <span>
            Sesión actual
          </span>

        </div>


        <svg
          className="sidebar-user-chevron"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 10l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

      </button>

    </div>
  );
}