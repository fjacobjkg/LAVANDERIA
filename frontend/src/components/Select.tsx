import type {
  ReactNode,
  SelectHTMLAttributes,
} from "react";

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export function Select({
  label,
  id,
  children,
  required,
  ...props
}: SelectProps) {
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

      <select
        id={id}
        className="app-input app-select"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}