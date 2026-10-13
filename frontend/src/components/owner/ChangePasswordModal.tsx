import { useState } from "react";
import { Input } from "../Input";
import { AccountFormModal } from "./AccountFormModal";
import { PASSWORD_HELP, validateOwnerPassword } from "../../utils/owner-password";
import type { ChangePasswordInput } from "../../types/owner-access.types";

interface Props { onClose: () => void; onSubmit: (input: ChangePasswordInput) => Promise<void> }
export function ChangePasswordModal({ onClose, onSubmit }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  async function submit() {
    validateOwnerPassword(newPassword, confirmPassword);
    if (newPassword === currentPassword) throw new Error("La nueva contraseña debe ser diferente de la actual.");
    try { await onSubmit({ currentPassword, newPassword, confirmPassword }); }
    finally { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
  }
  return (
    <AccountFormModal title="Cambiar contraseña" submitLabel="Cambiar contraseña" onClose={onClose} onSubmit={submit}>
      <p className="owner-form-help">Al guardar se cerrarán tus sesiones. Inicia sesión nuevamente con la nueva contraseña.</p>
      <Input id="owner-current-password" label="Contraseña actual" type="password" allowPasswordToggle value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)} required maxLength={255} autoComplete="current-password" autoFocus />
      <Input id="owner-new-password" label="Nueva contraseña" type="password" allowPasswordToggle value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)} required minLength={10} maxLength={255} autoComplete="new-password"
        aria-describedby="owner-password-help" />
      <p id="owner-password-help" className="owner-form-help">{PASSWORD_HELP}</p>
      <Input id="owner-confirm-password" label="Confirmar nueva contraseña" type="password" allowPasswordToggle value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)} required maxLength={255} autoComplete="new-password" />
    </AccountFormModal>
  );
}
