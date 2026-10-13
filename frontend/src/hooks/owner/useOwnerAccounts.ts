import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../../services/owner/owner-access.service";
import type {
  OwnerAccount, OperatorAccount, OperatorsResponse, ChangeUsernameInput, ChangePasswordInput, CreateOperatorInput, ChangeOperatorPasswordInput,
} from "../../types/owner-access.types";

type OwnerModal = { type: "username" | "password" | "operator" } | { type: "status" | "operator-password"; operator: OperatorAccount } | null;
const messageOf = (error: unknown) => error instanceof Error ? error.message : "No fue posible realizar la operación.";

export function useOwnerAccounts() {
  const navigate = useNavigate();
  const [account, setAccount] = useState<OwnerAccount | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountRevision, setAccountRevision] = useState(0);
  const [list, setList] = useState<OperatorsResponse | null>(null);
  const [query, setQuery] = useState({ page: 1, revision: 0 });
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [modal, setModal] = useState<OwnerModal>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setAccountError(null);
    api.getOwnerAccount(controller.signal)
      .then((user) => { if (!controller.signal.aborted) setAccount(user); })
      .catch((error: unknown) => { if (!controller.signal.aborted) setAccountError(messageOf(error)); });
    return () => controller.abort();
  }, [accountRevision]);

  useEffect(() => {
    const controller = new AbortController();
    setListLoading(true);
    setListError(null);
    api.getOperators(query.page, controller.signal)
      .then((result) => { if (!controller.signal.aborted) setList(result); })
      .catch((error: unknown) => { if (!controller.signal.aborted) { setList(null); setListError(messageOf(error)); } })
      .finally(() => { if (!controller.signal.aborted) setListLoading(false); });
    return () => controller.abort();
  }, [query]);

  function refreshOperators(reset = false) {
    setQuery((current) => ({ page: reset ? 1 : current.page, revision: current.revision + 1 }));
  }
  function completed(message: string) { setModal(null); setNotification(message); }

  async function changeUsername(input: ChangeUsernameInput) {
    setAccount(await api.changeOwnerUsername(input));
    completed("Tu nombre de usuario se actualizó correctamente.");
  }
  async function changePassword(input: ChangePasswordInput) {
    const result = await api.changeOwnerPassword(input);
    navigate("/login", { replace: true, state: { message: result.message } });
  }
  async function createOperator(input: CreateOperatorInput) {
    await api.createOperator(input);
    completed("Operador creado correctamente.");
    refreshOperators(true);
  }
  async function updateStatus(operator: OperatorAccount) {
    await api.setOperatorStatus(operator.id, !operator.active);
    completed(operator.active ? "Operador desactivado correctamente." : "Operador activado correctamente.");
    refreshOperators();
  }
  async function changeOperatorPassword(operator: OperatorAccount, input: ChangeOperatorPasswordInput) {
    await api.changeOperatorPassword(operator.id, input);
    completed("Contraseña del operador actualizada correctamente.");
    refreshOperators();
  }

  return {
    account, accountError, list, listLoading, listError, modal, setModal, notification,
    closeNotification: () => setNotification(null),
    retryAccount: () => setAccountRevision((current) => current + 1),
    refreshOperators: () => refreshOperators(),
    changePage: (page: number) => setQuery((current) => ({ ...current, page })),
    changeUsername, changePassword, createOperator, updateStatus, changeOperatorPassword,
  };
}
