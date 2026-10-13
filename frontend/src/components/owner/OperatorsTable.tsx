import { Button } from "../Button";
import type { OperatorAccount } from "../../types/owner-access.types";

interface Props {
  operators: OperatorAccount[];
  onStatusChange: (operator: OperatorAccount) => void;
  onChangePassword: (operator: OperatorAccount) => void;
}
export function OperatorsTable({ operators, onStatusChange, onChangePassword }: Props) {
  if (operators.length === 0) return <p className="owner-empty">No hay operadores registrados.</p>;
  return (
    <div className="owner-operators-table-wrapper">
      <table className="owner-operators-table">
        <thead><tr><th>Nombre</th><th>Usuario</th><th>Estado</th><th>Fecha de creación</th><th>Acciones</th></tr></thead>
        <tbody>{operators.map((operator) => (
          <tr key={operator.id}>
            <td>{operator.name}</td><td>{operator.username}</td>
            <td><span className={`owner-status ${operator.active ? "owner-status--active" : "owner-status--inactive"}`}>
              {operator.active ? "Activo" : "Inactivo"}</span></td>
            <td>{new Intl.DateTimeFormat("es-GT", { dateStyle: "medium", timeZone: "America/Guatemala" }).format(new Date(operator.createdAt))}</td>
            <td><div className="owner-operator-actions">
              <Button type="button" variant="secondary" onClick={() => onChangePassword(operator)}
                aria-label={`Cambiar contraseña de ${operator.username}`}>Cambiar contraseña</Button>
              <Button type="button" variant="secondary" onClick={() => onStatusChange(operator)}
              aria-label={`${operator.active ? "Desactivar" : "Activar"} a ${operator.username}`}>
              {operator.active ? "Desactivar" : "Activar"}</Button>
            </div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
