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
  ...props
}: TextareaProps) {
  return (
    <div className="input-group">
      <label
        className="input-label"
        htmlFor={id}
      >
        {label}
      </label>

      <textarea
        id={id}
        className="app-input app-textarea"
        {...props}
      />
    </div>
  );
}