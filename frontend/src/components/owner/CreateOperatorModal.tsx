import { useState } from "react";
import { Input } from "../Input";
import { AccountFormModal } from "./AccountFormModal";
import { PASSWORD_HELP, validateOwnerPassword } from "../../utils/owner-password";
import type { CreateOperatorInput } from "../../types/owner-access.types";

interface Props { onClose: () => void; onSubmit: (input: CreateOperatorInput) => Promise<void> }
export function CreateOperatorModal({ onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  async function submit() {
    if (!name.trim() || !username.trim()) throw new Error("Nombre y usuario son obligatorios.");
    validateOwnerPassword(password, confirmPassword);
    try { await onSubmit({ name: name.trim(), username: username.trim(), password, confirmPassword }); }
    finally { setPassword(""); setConfirmPassword(""); }
  }
  return (
    <AccountFormModal title="Crear operador" submitLabel="Crear operador" onClose={onClose} onSubmit={submit}>
      <Input id="operator-name" label="Nombre" value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} autoFocus />
      <Input id="operator-username" label="Nombre de usuario" value={username} onChange={(event) => setUsername(event.target.value)}
        required maxLength={50} autoComplete="off" />
      <Input id="operator-password" label="Contraseña inicial" type="password" allowPasswordToggle value={password} onChange={(event) => setPassword(event.target.value)}
        required minLength={10} maxLength={255} autoComplete="new-password" aria-describedby="operator-password-help" />
      <p id="operator-password-help" className="owner-form-help">{PASSWORD_HELP}</p>
      <Input id="operator-confirm-password" label="Confirmar contraseña" type="password" allowPasswordToggle value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)} required maxLength={255} autoComplete="new-password" />
    </AccountFormModal>
  );
}
