import { useState, type FormEvent, type ReactNode } from "react";
import { Modal } from "../Modal";
import { Button } from "../Button";

interface Props {
  title: string; submitLabel: string; onClose: () => void;
  onSubmit: () => Promise<void>; children: ReactNode;
}

// Cada formulario mantiene sus propios campos; aquí sólo se gestiona el envío.
export function AccountFormModal({ title, submitLabel, onClose, onSubmit, children }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    try { await onSubmit(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "No fue posible guardar los cambios."); }
    finally { setSaving(false); }
  }
  return (
    <Modal isOpen title={title} onClose={() => { if (!saving) onClose(); }}>
      <form className="owner-account-form" onSubmit={handleSubmit} aria-busy={saving}>
        <fieldset disabled={saving}>
          {children}
          {error && <p className="input-error-message" role="alert">{error}</p>}
          <div className="owner-account-actions">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{saving ? "Guardando…" : submitLabel}</Button>
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
