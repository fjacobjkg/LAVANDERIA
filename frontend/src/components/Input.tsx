import { useState, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  action?: ReactNode;
  allowPasswordToggle?: boolean;
}

export function Input({
  label,
  error,
  action,
  allowPasswordToggle = false,
  type,
  id,
  className = "",
  required,
  ...props
}: InputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const fieldAction = action ?? (allowPasswordToggle && type === "password" ? (
    <button type="button" aria-label={`${passwordVisible ? "Ocultar" : "Mostrar"} ${label.toLowerCase()}`}
      aria-controls={id} aria-pressed={passwordVisible} disabled={props.disabled}
      onClick={() => setPasswordVisible((current) => !current)}>
      {passwordVisible ? "Ocultar" : "Mostrar"}
    </button>
  ) : undefined);
  const classes = [
    "input-field",
    error ? "input-field--error" : "",
    fieldAction ? "input-field--action" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="input-group">

      <label
        htmlFor={id}
        className="field-label"
      >
        {label}

        {required && (
          <span className="field-required">
            *
          </span>
        )}
      </label>

      <div className="input-wrapper">
        <input
          id={id}
          type={allowPasswordToggle && type === "password" && passwordVisible ? "text" : type}
          required={required}
          className={classes}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />

        {fieldAction && (
          <div className="input-action">
            {fieldAction}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="input-error-message"
        >
          {error}
        </p>
      )}
    </div>
  );
}
