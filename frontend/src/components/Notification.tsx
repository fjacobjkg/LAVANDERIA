import "../styles/notification.css";

export type NotificationType =
  | "success"
  | "error"
  | "info";

interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  onClose: () => void;
}

export function Notification({
  type,
  title,
  message,
  onClose,
}: NotificationProps) {
  return (
    <div
      className={`notification notification--${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      <div className="notification-icon">
        {type === "success" && (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 12.5l4.2 4L19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {type === "error" && (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 8v5M12 17h.01"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        )}

        {type === "info" && (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 11v6M12 7h.01"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        )}
      </div>

      <div className="notification-content">
        <p className="notification-title">
          {title}
        </p>

        <p className="notification-message">
          {message}
        </p>
      </div>

      <button
        type="button"
        className="notification-close"
        aria-label="Cerrar notificación"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}