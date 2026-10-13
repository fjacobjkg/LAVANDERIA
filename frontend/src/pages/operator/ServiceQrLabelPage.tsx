import {
  AppLayout,
} from "../../layout/AppLayout";

import {
  Button,
} from "../../components/Button";

import {
  Notification,
} from "../../components/Notification";

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
      day:
        "2-digit",

      month:
        "2-digit",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",

      hour12:
        false,
    },
  ).format(
    new Date(
      date,
    ),
  );
}


export function ServiceQrLabelPage() {

  const {
    services,

    selectedService,
    selectedServiceId,

    isLoading,
    isConfirmingPrint,

    error,
    printNotification,

    handleServiceChange,
    handlePrintConfirmation,
    handleClosePrintNotification,
  } =
    useServiceLabel();


  async function handlePrint() {

    if (
      !selectedService ||
      isConfirmingPrint
    ) {
      return;
    }


    /*
     * ===================================================
     * IMPLEMENTACIÓN TEMPORAL
     * ===================================================
     *
     * Actualmente se utiliza el diálogo de impresión
     * del navegador para poder probar todo el flujo.
     *
     * Puede utilizarse para:
     *
     * - imprimir mediante una impresora disponible;
     * - guardar la etiqueta como PDF.
     *
     * Después de cerrar el diálogo se registra la
     * impresión en el backend.
     *
     * IMPORTANTE:
     *
     * window.print() no informa si el usuario imprimió,
     * guardó un PDF o canceló el diálogo.
     *
     * Por esa razón esta implementación es temporal.
     * ===================================================
     */

    window.print();


    await handlePrintConfirmation();


    /*
     * ===================================================
     * INTEGRACIÓN FUTURA CON IMPRESORA FÍSICA
     * ===================================================
     *
     * Cuando se disponga de la impresora, deberá
     * sustituirse:
     *
     * window.print();
     * await handlePrintConfirmation();
     *
     * por una integración que confirme realmente
     * la impresión.
     *
     * Ejemplo conceptual:
     *
     * const result =
     *   await printer.print(
     *     selectedService,
     *   );
     *
     * if (result.success) {
     *   await handlePrintConfirmation();
     * }
     *
     * El backend NO necesita modificarse.
     * ===================================================
     */
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


        {printNotification && (
          <div className="service-qr-notification">

            <Notification
              type="success"

              title={
                printNotification.title
              }

              message={
                printNotification.message
              }

              onClose={
                handleClosePrintNotification
              }
            />

          </div>
        )}


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


              <span
                className={[
                  "service-qr-status",

                  selectedService?.qrPrinted
                    ? "service-qr-status--printed"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {selectedService?.qrPrinted
                  ? "Impresa"
                  : "No impresa"}
              </span>

            </div>


            {isLoading && (
              <div className="service-qr-message">
                Cargando etiqueta...
              </div>
            )}


            {!isLoading &&
              error && (

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

                      disabled={
                        isConfirmingPrint
                      }

                      onClick={
                        handlePrint
                      }
                    >
                      {isConfirmingPrint
                        ? "Registrando..."
                        : selectedService.qrPrinted
                          ? "Reimprimir etiqueta"
                          : "Imprimir etiqueta"}
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

              <label htmlFor="service">
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