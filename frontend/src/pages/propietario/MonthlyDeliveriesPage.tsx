import { AppLayout } from "../../layout/AppLayout";
import { Button } from "../../components/Button";
import { Pagination } from "../../components/Pagination";
import { MonthlyDeliverySummary } from "../../components/owner/MonthlyDeliverySummary";
import { MonthlyDeliveriesTable } from "../../components/owner/MonthlyDeliveriesTable";
import { MonthlyPeriodSelector } from "../../components/owner/MonthlyPeriodSelector";
import { useMonthlyDeliveries } from "../../hooks/owner/useMonthlyDeliveries";
import "../../styles/monthly-deliveries.css";

export function MonthlyDeliveriesPage() {
  const { selectedMonth, setSelectedMonth, appliedMonth, data, isLoading, error, handleSearch, handlePageChange } = useMonthlyDeliveries();
  const periodLabel = new Intl.DateTimeFormat("es-GT", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${appliedMonth}-01T00:00:00Z`));

  return (
    <AppLayout>
      <div className="monthly-deliveries-page">
        <header className="monthly-deliveries-page-header">
          <h1 className="page-header-title">Consulta mensual de entregas</h1>
          <p className="page-header-description">Selecciona un mes y consulta los servicios entregados durante ese período.</p>
        </header>
        <section className="monthly-deliveries-card" aria-busy={isLoading}>
          <div className="monthly-deliveries-filter-header">
            <div><h2>Período de consulta</h2><p>Selecciona el mes y el año de las entregas.</p></div>
            <form className="monthly-deliveries-filter" onSubmit={(event) => { event.preventDefault(); handleSearch(); }}>
              <MonthlyPeriodSelector value={selectedMonth} onChange={setSelectedMonth} disabled={isLoading} />
              <Button type="submit" disabled={isLoading}>Consultar</Button>
            </form>
          </div>
          {isLoading && <div className="monthly-deliveries-empty" role="status">Consultando entregas…</div>}
          {error && <p className="input-error-message" role="alert">{error}</p>}
          {data && <>
            <p className="monthly-applied-period">Resultados de {periodLabel}</p>
            <MonthlyDeliverySummary deliveredServices={data.summary.deliveredServices} totalGarments={data.summary.totalGarments} />
            <MonthlyDeliveriesTable deliveries={data.deliveries} />
            {data.pagination.totalItems > 0 && <Pagination {...data.pagination} onPageChange={handlePageChange} />}
          </>}
        </section>
      </div>
    </AppLayout>
  );
}
