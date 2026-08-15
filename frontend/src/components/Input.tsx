import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  action?: ReactNode;
}

export function Input({
  label,
  error,
  action,
  id,
  className = "",
  ...props
}: InputProps) {
  const classes = [
    "input-field",
    error ? "input-field--error" : "",
    action ? "input-field--action" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="input-group">
      <label className="input-label" htmlFor={id}>
        {label}
      </label>

      <div className="input-wrapper">
        <input
          id={id}
          className={classes}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />

        {action && (
          <div className="input-action">
            {action}
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