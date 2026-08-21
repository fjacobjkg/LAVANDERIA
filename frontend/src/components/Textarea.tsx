import type {
  TextareaHTMLAttributes,
} from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({
  label,
  id,
  required,
  ...props
}: TextareaProps) {
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

      <textarea
        id={id}
        className="app-input app-textarea"
        {...props}
      />
    </div>
  );
}