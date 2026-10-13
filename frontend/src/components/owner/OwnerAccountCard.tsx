import { Button } from "../Button";
import type { OwnerAccount } from "../../types/owner-access.types";

interface Props { account: OwnerAccount; onChangeUsername: () => void; onChangePassword: () => void }
export function OwnerAccountCard({ account, onChangeUsername, onChangePassword }: Props) {
  return (
    <>
      <dl className="owner-account-details">
        <div><dt>Nombre</dt><dd>{account.name}</dd></div>
        <div><dt>Usuario</dt><dd>{account.username}</dd></div>
        <div><dt>Rol</dt><dd>Propietario</dd></div>
      </dl>
      <div className="owner-account-actions">
        <Button type="button" variant="secondary" onClick={onChangeUsername}>Cambiar usuario</Button>
        <Button type="button" variant="secondary" onClick={onChangePassword}>Cambiar contraseña</Button>
      </div>
    </>
  );
}
