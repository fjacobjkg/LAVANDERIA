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
  ...props
}: SelectProps) {
  return (
    <div className="input-group">
      <label
        className="input-label"
        htmlFor={id}
      >
        {label}
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