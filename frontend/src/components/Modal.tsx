import type {
  MouseEvent,
  ReactNode,
} from "react";

import "../styles/modal.css";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  function handleOverlayClick(
    event: MouseEvent<HTMLDivElement>,
  ) {
    if (
      event.target === event.currentTarget
    ) {
      onClose();
    }
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={handleOverlayClick}
    >
      <section
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal-header">
          <h2
            id="modal-title"
            className="modal-title"
          >
            {title}
          </h2>

          <button
            type="button"
            className="modal-close"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="modal-body">
          {children}
        </div>
      </section>
    </div>
  );
}