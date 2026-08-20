import type { ReactNode } from "react";

interface FieldLabelProps {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}

export function FieldLabel({
  htmlFor,
  children,
  required = false,
}: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="field-label"
    >
      {children}

      {required && (
        <span
          className="field-required"
          aria-hidden="true"
        >
          *
        </span>
      )}
    </label>
  );
}