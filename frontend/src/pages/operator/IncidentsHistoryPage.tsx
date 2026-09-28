import {
  AppLayout,
} from "../../layout/AppLayout";

import {
  Button,
} from "../../components/Button";

import {
  HistoryControlTabs,
} from "../../components/history-control/HistoryControlTabs";

import {
  IncidentsTable,
} from "../../components/history-control/IncidentsTable";

import {
  OperationHistoryTimeline,
} from "../../components/history-control/OperationHistoryTimeline";

import {
  RegisterIncidentModal,
} from "../../components/history-control/RegisterIncidentModal";

import {
  useHistoryControl,
} from "../../hooks/history-control/useHistoryControl";

import { Pagination, } from "../../components/Pagination";

import "../../styles/history-control.css";


export function IncidentsHistoryPage() {

  const {
  activeTab,

  incidents,
  incidentsPage,
  incidentsTotalPages,
  incidentsTotalRecords,

  history,
  services,

  isRegisterModalOpen,

  selectedHistoryServiceId,

  historyPage,
  historyTotalPages,
  historyTotalRecords,

  setActiveTab,

  handleIncidentsPageChange,

  handleHistoryServiceChange,
  handleHistoryPageChange,

  handleOpenRegisterModal,
  handleCloseRegisterModal,
  handleRegisterIncident,
} =
  useHistoryControl();


  return (
    <AppLayout>

      <div className="history-control-page">

        <header className="history-control-page-header">

          <h1 className="page-header-title">
            Incidentes e historial de operación
          </h1>


          <p className="page-header-description">
            Registra excepciones y consulta
            el historial de operaciones
            realizadas sobre los servicios.
          </p>

        </header>


        <section className="history-control-card">

          <HistoryControlTabs
            activeTab={
              activeTab
            }

            onChange={
              setActiveTab
            }
          />


          {activeTab ===
            "incidents" && (

            <div className="history-control-panel">

              <div className="history-control-panel-header">

                <div>

                  <h2>
                    Incidentes registrados
                  </h2>


                  <p>
                    Correcciones, cancelaciones,
                    etiquetas dañadas, falta de
                    contacto u otras excepciones.
                  </p>

                </div>


                <Button
                  type="button"

                  onClick={
                    handleOpenRegisterModal
                  }
                >
                  + Registrar incidente
                </Button>

              </div>


              <IncidentsTable
                incidents={
                  incidents
                }
              />

              <Pagination
                currentPage={
                  incidentsPage
                }

                totalPages={
                  incidentsTotalPages
                }

                totalItems={
                  incidentsTotalRecords
                }

                itemLabel="incidente"

                onPageChange={
                  handleIncidentsPageChange
                }
              />

            </div>
          )}


         {activeTab === "history" && (
          <div className="history-control-panel">

            <div className="history-control-panel-header">
              <div>
                <h2>
                  Historial de operaciones por servicio
                </h2>

                <p>
                  Consulta las acciones realizadas
                  desde el ingreso hasta la entrega
                  del servicio seleccionado.
                </p>
              </div>
            </div>


        <div className="history-service-filter">

          <div className="history-control-field">

            <label htmlFor="history-service">
              Servicio
            </label>


            <select
              id="history-service"

              value={
                selectedHistoryServiceId ??
                ""
              }

              disabled={
                services.length === 0
              }

              onChange={(event) =>
                handleHistoryServiceChange(
                  Number(
                    event.target.value,
                  ),
                )
              }
            >

              {services.length === 0 && (
                <option value="">
                  Sin servicios registrados
                </option>
              )}


              {services.map(
                (service) => (
                  <option
                    key={
                      service.id
                    }

                    value={
                      service.id
                    }
                  >
                    {service.code}
                  </option>
                ),
              )}

            </select>

          </div>

        </div>


        <OperationHistoryTimeline
          records={
            history
          }
        />


            <Pagination
              currentPage={
                historyPage
              }

              totalPages={
                historyTotalPages
              }

              totalItems={
                historyTotalRecords
              }

              itemLabel="movimiento"

              onPageChange={
                handleHistoryPageChange
              }
            />

          </div>
        )}

        </section>

      </div>


      <RegisterIncidentModal
        isOpen={
          isRegisterModalOpen
        }

        services={
          services
        }

        onClose={
          handleCloseRegisterModal
        }

        onSubmit={
          handleRegisterIncident
        }
      />

    </AppLayout>
  );
}