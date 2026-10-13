import { useState } from "react";
import { Input } from "../Input";
import { AccountFormModal } from "./AccountFormModal";
import type { ChangeUsernameInput } from "../../types/owner-access.types";

interface Props { onClose: () => void; onSubmit: (input: ChangeUsernameInput) => Promise<void> }
export function ChangeUsernameModal({ onClose, onSubmit }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function submit() {
    if (!username.trim()) throw new Error("El usuario es obligatorio.");
    try { await onSubmit({ username: username.trim(), currentPassword: password }); }
    finally { setPassword(""); }
  }
  return (
    <AccountFormModal title="Cambiar nombre de usuario" submitLabel="Cambiar usuario" onClose={onClose} onSubmit={submit}>
      <Input id="owner-new-username" label="Nuevo nombre de usuario" value={username}
        onChange={(event) => setUsername(event.target.value)} required maxLength={50} autoComplete="username" autoFocus />
      <Input id="owner-username-password" label="Contraseña actual" type="password" allowPasswordToggle value={password}
        onChange={(event) => setPassword(event.target.value)} required maxLength={255} autoComplete="current-password" />
    </AccountFormModal>
  );
}
