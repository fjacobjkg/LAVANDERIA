import { AppLayout } from "../../layout/AppLayout";
import { Button } from "../../components/Button";
import { Notification } from "../../components/Notification";
import { Pagination } from "../../components/Pagination";
import { AccountFormModal } from "../../components/owner/AccountFormModal";
import { OwnerAccountCard } from "../../components/owner/OwnerAccountCard";
import { OperatorsTable } from "../../components/owner/OperatorsTable";
import { ChangeUsernameModal } from "../../components/owner/ChangeUsernameModal";
import { ChangePasswordModal } from "../../components/owner/ChangePasswordModal";
import { CreateOperatorModal } from "../../components/owner/CreateOperatorModal";
import { ChangeOperatorPasswordModal } from "../../components/owner/ChangeOperatorPasswordModal";
import { useOwnerAccounts } from "../../hooks/owner/useOwnerAccounts";
import "../../styles/owner-accounts.css";

export function OwnerAccountsPage() {
  const owner = useOwnerAccounts();
  const closeModal = () => owner.setModal(null);
  const statusOperator = owner.modal?.type === "status" ? owner.modal.operator : null;
  const passwordOperator = owner.modal?.type === "operator-password" ? owner.modal.operator : null;
  return (
    <AppLayout>
      <div className="owner-accounts-page">
        <header className="owner-accounts-header">
          <h1 className="page-header-title">Cuentas y accesos</h1>
          <p className="page-header-description">Administra tu cuenta y los accesos operativos.</p>
        </header>
        {owner.notification && <Notification type="success" title="Cambios guardados" message={owner.notification} onClose={owner.closeNotification} />}
        <section className="owner-accounts-card" aria-labelledby="owner-account-title">
          <h2 id="owner-account-title">Mi cuenta</h2>
          {owner.accountError ? <div role="alert"><p>{owner.accountError}</p><Button type="button" variant="secondary" onClick={owner.retryAccount}>Reintentar</Button></div>
            : owner.account ? <OwnerAccountCard account={owner.account} onChangeUsername={() => owner.setModal({ type: "username" })}
                onChangePassword={() => owner.setModal({ type: "password" })} />
            : <p role="status">Cargando cuenta…</p>}
        </section>
        <section className="owner-accounts-card" aria-labelledby="owner-operators-title" aria-busy={owner.listLoading}>
          <div className="owner-operators-header">
            <div><h2 id="owner-operators-title">Operadores</h2><p>Operadores registrados</p></div>
            <Button type="button" onClick={() => owner.setModal({ type: "operator" })} disabled={!owner.account}>+ Nuevo operador</Button>
          </div>
          {owner.listLoading ? <p className="owner-empty" role="status">Cargando operadores…</p>
            : owner.listError ? <div role="alert"><p>{owner.listError}</p><Button type="button" variant="secondary" onClick={owner.refreshOperators}>Reintentar</Button></div>
            : owner.list && <>
              <OperatorsTable operators={owner.list.operators}
                onStatusChange={(operator) => owner.setModal({ type: "status", operator })}
                onChangePassword={(operator) => owner.setModal({ type: "operator-password", operator })} />
              {owner.list.pagination.totalItems > 0 && <Pagination {...owner.list.pagination} itemLabel="operador" onPageChange={owner.changePage} />}
            </>}
        </section>
      </div>
      {owner.modal?.type === "username" && <ChangeUsernameModal onClose={closeModal} onSubmit={owner.changeUsername} />}
      {owner.modal?.type === "password" && <ChangePasswordModal onClose={closeModal} onSubmit={owner.changePassword} />}
      {owner.modal?.type === "operator" && <CreateOperatorModal onClose={closeModal} onSubmit={owner.createOperator} />}
      {passwordOperator && <ChangeOperatorPasswordModal operator={passwordOperator} onClose={closeModal}
        onSubmit={(input) => owner.changeOperatorPassword(passwordOperator, input)} />}
      {statusOperator && <AccountFormModal title={statusOperator.active ? "Desactivar operador" : "Activar operador"}
        submitLabel={statusOperator.active ? "Desactivar" : "Activar"} onClose={closeModal} onSubmit={() => owner.updateStatus(statusOperator)}>
        <p>¿Deseas {statusOperator.active ? "desactivar" : "activar"} el acceso de <strong>{statusOperator.name}</strong> ({statusOperator.username})?</p>
        <p className="owner-form-help">{statusOperator.active ? "El usuario no podrá iniciar sesión mientras permanezca inactivo." : "El operador podrá iniciar sesión nuevamente."}</p>
      </AccountFormModal>}
    </AppLayout>
  );
}
