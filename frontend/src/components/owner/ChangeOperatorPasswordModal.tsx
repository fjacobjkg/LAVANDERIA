import { useState } from "react";
import { Input } from "../Input";
import { AccountFormModal } from "./AccountFormModal";
import { PASSWORD_HELP, validateOwnerPassword } from "../../utils/owner-password";
import type { ChangeOperatorPasswordInput, OperatorAccount } from "../../types/owner-access.types";

interface Props {
  operator: OperatorAccount;
  onClose: () => void;
  onSubmit: (input: ChangeOperatorPasswordInput) => Promise<void>;
}
export function ChangeOperatorPasswordModal({ operator, onClose, onSubmit }: Props) {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  async function submit() {
    validateOwnerPassword(password, passwordConfirmation);
    try { await onSubmit({ password, passwordConfirmation }); }
    finally { setPassword(""); setPasswordConfirmation(""); }
  }
  return (
    <AccountFormModal title="Cambiar contraseña" submitLabel="Cambiar contraseña" onClose={onClose} onSubmit={submit}>
      <div className="owner-password-target">
        <strong>{operator.name}</strong><span>Usuario: {operator.username}</span>
      </div>
      <p className="owner-form-help">El operador deberá iniciar sesión con la nueva contraseña.</p>
      <Input id="operator-new-password" label="Nueva contraseña" type="password" allowPasswordToggle value={password}
        onChange={(event) => setPassword(event.target.value)} required minLength={10} maxLength={255}
        autoComplete="new-password" aria-describedby="operator-new-password-help" autoFocus />
      <p id="operator-new-password-help" className="owner-form-help">{PASSWORD_HELP}</p>
      <Input id="operator-new-password-confirmation" label="Confirmar contraseña" type="password" allowPasswordToggle value={passwordConfirmation}
        onChange={(event) => setPasswordConfirmation(event.target.value)} required maxLength={255} autoComplete="new-password" />
    </AccountFormModal>
  );
}
