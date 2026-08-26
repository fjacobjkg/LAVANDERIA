import { AppLayout } from "../../layout/AppLayout";

import { Button } from "../../components/Button";

import {
  ServiceStatusBadge,
} from "../../components/services/ServiceStatusBadge";

import {
  ServiceDetailModal,
} from "../../components/services/ServiceDetailModal";

import {
  useServiceTracking,
} from "../../hooks/useServiceTracking";

import type {
  ServiceStatusFilter,
} from "../../types/service-tracking.types";

import "../../styles/service-tracking.css";

import {
  Pagination,
} from "../../components/Pagination";


export function ServiceTrackingPage() {
    const {
    services,

    selectedService,
    isDetailOpen,

    search,
    statusFilter,

    pagination,

    isLoading,
    error,

    setSearch,
    setStatusFilter,

    handleSearch,
    handlePageChange,

    handleConsult,
    handleCloseDetail,
  } = useServiceTracking();


  return (
    <AppLayout>
      <main className="service-tracking-page">

        <header className="service-tracking-header">

          <h1 className="page-header-title">
            Consulta y seguimiento
          </h1>

          <p className="page-header-description">
            Busca servicios registrados
            y consulta su estado actual.
          </p>

        </header>


        <section className="service-tracking-card">

          <div className="service-tracking-filters">

            <div className="service-tracking-search">

              <input
                type="search"

                value={search}

                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }

                placeholder="Código, cliente o teléfono..."

                aria-label="Buscar servicio"
              />

            </div>


            <select
              className="service-tracking-select"

              aria-label="Filtrar por estado"

              value={statusFilter}

              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as ServiceStatusFilter,
                )
              }
            >
              <option value="ALL">
                Todos los estados
              </option>

              <option value="RECIBIDA">
                Recepción
              </option>

              <option value="EN_PROCESO">
                En proceso
              </option>

              <option value="LISTA_RECOGER">
                Lista para recoger
              </option>

              <option value="ENTREGADA">
                Entregada
              </option>
            </select>


            <Button
              type="button"
              onClick={
                handleSearch
              }
            >
              Buscar
            </Button>

          </div>


          <div className="service-tracking-table-wrapper">


            <table className="service-tracking-table">

              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Cliente</th>
                  <th>Prendas</th>
                  <th>Estado</th>
                  <th>Recepción</th>
                  <th>Acción</th>
                </tr>
              </thead>


              <tbody>

                {isLoading && (
                  <tr>
                    <td colSpan={6}>
                      Cargando servicios...
                    </td>
                  </tr>
                )}


                {!isLoading &&
                  error && (
                    <tr>
                      <td colSpan={6}>
                        {error}
                      </td>
                    </tr>
                  )}


                {!isLoading &&
                  !error &&
                  services.length ===
                    0 && (
                    <tr>
                      <td colSpan={6}>
                        No se encontraron servicios.
                      </td>
                    </tr>
                  )}


                {!isLoading &&
                  !error &&
                  services.map(
                    (service) => (
                      <tr
                        key={
                          service.id
                        }
                      >

                        <td>
                          <strong className="tracking-service-code">
                            {
                              service.code
                            }
                          </strong>
                        </td>


                        <td>
                          {
                            service.client
                          }
                        </td>


                        <td>
                          {
                            service.garments
                          }
                        </td>


                        <td>
                          <ServiceStatusBadge
                            status={
                              service.status
                            }
                          />
                        </td>


                        <td>
                          {
                            service.receptionDate
                          }
                        </td>


                        <td>
                          <Button
                            type="button"
                            variant="secondary"

                            onClick={() =>
                              handleConsult(
                                service,
                              )
                            }
                          >
                            Consultar
                          </Button>
                        </td>

                      </tr>
                    ),
                  )}

              </tbody>

            </table>
          </div>

        <Pagination
            currentPage={
              pagination.page
            }

            totalPages={
              pagination.totalPages
            }

            totalItems={
              pagination.totalItems
            }

            disabled={
              isLoading
            }

            onPageChange={
              handlePageChange
            }
        />

        </section>


        <ServiceDetailModal
          isOpen={
            isDetailOpen
          }

          service={
            selectedService
          }

          onClose={
            handleCloseDetail
          }
        />

      </main>
    </AppLayout>
  );
}