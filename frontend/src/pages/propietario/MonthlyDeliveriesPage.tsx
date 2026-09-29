import {
  AppLayout,
} from "../../layout/AppLayout";

import {
  Button,
} from "../../components/Button";

import {
  MonthlyDeliverySummary,
} from "../../components/owner/MonthlyDeliverySummary";

import {
  MonthlyDeliveriesTable,
} from "../../components/owner/MonthlyDeliveriesTable";

import {
  useMonthlyDeliveries,
} from "../../hooks/owner/useMonthlyDeliveries";

import "../../styles/monthly-deliveries.css";


export function MonthlyDeliveriesPage() {

  const {
    selectedMonth,

    deliveries,

    deliveredServices,

    totalGarments,

    setSelectedMonth,

    handleSearch,
  } =
    useMonthlyDeliveries();


  return (
    <AppLayout>

      <div className="monthly-deliveries-page">

        <header className="monthly-deliveries-page-header">

          <h1 className="page-header-title">
            Consulta mensual de entregas
          </h1>

          <p className="page-header-description">
            Selecciona un mes y consulta
            los servicios entregados durante
            ese período.
          </p>

        </header>


        <section className="monthly-deliveries-card">

          <div className="monthly-deliveries-filter-header">

            <div>

              <h2>
                Período de consulta
              </h2>

              <p>
                La consulta utiliza el estado
                y la fecha de entrega almacenada
                en cada servicio.
              </p>

            </div>


            <div className="monthly-deliveries-filter">

              <div className="monthly-deliveries-field">

                <label htmlFor="monthly-period">
                  Mes
                </label>

                <input
                  id="monthly-period"
                  type="month"

                  value={
                    selectedMonth
                  }

                  onChange={(event) =>
                    setSelectedMonth(
                      event.target.value,
                    )
                  }
                />

              </div>


              <Button
                type="button"

                disabled={
                  !selectedMonth
                }

                onClick={
                  handleSearch
                }
              >
                Consultar
              </Button>

            </div>

          </div>


          <MonthlyDeliverySummary
            deliveredServices={
              deliveredServices
            }

            totalGarments={
              totalGarments
            }
          />


          <MonthlyDeliveriesTable
            deliveries={
              deliveries
            }
          />

        </section>

      </div>

    </AppLayout>
  );
}