import { AppLayout } from "../../layout/AppLayout";

import { Button } from "../../components/Button";

import {
  ServiceQrLabelPreview,
} from "../../components/services/ServiceQrLabelPreview";

import {
  ServiceStatusBadge,
} from "../../components/services/ServiceStatusBadge";

import {
  useServiceLabel,
} from "../../hooks/service-label/useServiceLabel";

import "../../styles/service-qr-label.css";


function formatReceptionDate(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "es-GT",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",

      hour: "2-digit",
      minute: "2-digit",

      hour12: false,
    },
  ).format(
    new Date(date),
  );
}


export function ServiceQrLabelPage() {
  const {
    services,

    selectedService,
    selectedServiceId,

    isLoading,
    error,

    handleServiceChange,
  } = useServiceLabel();


  function handlePrint() {
    window.print();
  }


  return (
    <AppLayout>
      <div className="service-qr-page">

        <header className="service-qr-page-header">
          <h1 className="page-header-title">
            Etiqueta QR
          </h1>

          <p className="page-header-description">
            Consulta y prepara la etiqueta
            interna de identificación de
            cada servicio.
          </p>
        </header>


        <div className="service-qr-content">

          <section className="service-qr-main-card">

            <div className="service-qr-section-header">
              <div>
                <h2>
                  Vista previa de etiqueta
                </h2>

                <p>
                  El código QR identifica
                  internamente la bolsa o
                  canasto asociado al servicio.
                </p>
              </div>

              <span className="service-qr-status">
                No impresa
              </span>
            </div>


            {isLoading && (
              <div className="service-qr-message">
                Cargando etiqueta...
              </div>
            )}


            {!isLoading && error && (
              <div className="service-qr-message service-qr-message--error">
                {error}
              </div>
            )}


            {!isLoading &&
              !error &&
              !selectedService && (
                <div className="service-qr-message">
                  No hay servicios disponibles
                  para gestionar una etiqueta.
                </div>
              )}


            {!isLoading &&
              !error &&
              selectedService && (
                <>
                  <div className="service-qr-preview-area">

                    <ServiceQrLabelPreview
                      code={
                        selectedService.code
                      }

                      qrToken={
                        selectedService.qrToken
                      }

                      garments={
                        selectedService.garments
                      }
                    />


                    <div className="service-qr-information">

                      <div className="service-qr-information-row">
                        <span>
                          Servicio
                        </span>

                        <strong>
                          {selectedService.code}
                        </strong>
                      </div>


                      <div className="service-qr-information-row">
                        <span>
                          Total de prendas
                        </span>

                        <strong>
                          {selectedService.garments}
                        </strong>
                      </div>


                      <div className="service-qr-information-row">
                        <span>
                          Estado
                        </span>

                        <ServiceStatusBadge
                          status={
                            selectedService.status
                          }
                        />
                      </div>


                      <div className="service-qr-information-row">
                        <span>
                          Recepción
                        </span>

                        <strong>
                          {formatReceptionDate(
                            selectedService.receivedAt,
                          )}
                        </strong>
                      </div>

                    </div>

                  </div>


                  <div className="service-qr-actions">
                    <Button
                      type="button"
                      onClick={
                        handlePrint
                      }
                    >
                      Imprimir etiqueta
                    </Button>
                  </div>
                </>
              )}

          </section>


          <aside className="service-qr-selection-card">

            <div className="service-qr-selection-header">
              <h2>
                Seleccionar servicio
              </h2>

              <p>
                Selecciona el servicio cuya
                etiqueta deseas consultar.
              </p>
            </div>


            <div className="service-qr-field">
              <label
                htmlFor="service"
              >
                Servicio
              </label>


              <select
                id="service"

                value={
                  selectedServiceId ??
                  ""
                }

                disabled={
                  isLoading ||
                  services.length === 0
                }

                onChange={(event) => {
                  handleServiceChange(
                    Number(
                      event.target.value,
                    ),
                  );
                }}
              >
                {services.length === 0 && (
                  <option value="">
                    Sin servicios disponibles
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

                      {service.client
                        ? ` - ${service.client}`
                        : ""}
                    </option>
                  ),
                )}
              </select>

            </div>


            <div className="service-qr-info-notice">
              La reimpresión conservará el
              mismo identificador QR del
              servicio.
            </div>

          </aside>

        </div>

      </div>
    </AppLayout>
  );
}