import {
  AppLayout,
} from "../../layout/AppLayout";

import {
  Button,
} from "../../components/Button";

import {
  DeliveryServiceDetails,
} from "../../components/services/DeliveryServiceDetails";

import {
  QrScannerModal,
} from "../../components/services/QrScannerModal";

import {
  ServiceStatusBadge,
} from "../../components/services/ServiceStatusBadge";

import {
  useDeliveryConfirmation,
} from "../../hooks/delivery/useDeliveryConfirmation";

import "../../styles/delivery-confirmation.css";


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


export function DeliveryConfirmationPage() {
  const {
    services,

    selectedService,
    selectedServiceId,

    isLoading,
    error,
    successMessage,

    isScannerOpen,

    qrValidationStatus,
    qrValidationMessage,

    isConfirming,
    canConfirm,

    handleServiceChange,

    handleOpenScanner,
    handleCloseScanner,

    handleQrScanned,
    handleConfirmDelivery,
  } =
    useDeliveryConfirmation();


  return (
    <AppLayout>

      <div className="delivery-page">

        <header className="delivery-page-header">
          <h1 className="page-header-title">
            Confirmar entrega
          </h1>

          <p className="page-header-description">
            Selecciona el servicio, valida
            el código QR de la bolsa o
            canasto y confirma la entrega.
          </p>
        </header>


        {successMessage && (
          <div className="delivery-success-message">
            {successMessage}
          </div>
        )}


        {error && (
          <div className="delivery-error-message">
            {error}
          </div>
        )}


        <div className="delivery-content">

          <section className="delivery-main-card">

            <div className="delivery-step">

              <div className="delivery-step-header">

                <div>
                  <h2>
                    1. Servicio a entregar
                  </h2>

                  <p>
                    Selecciona el servicio
                    que deseas finalizar.
                  </p>
                </div>


                {selectedService && (
                  <ServiceStatusBadge
                    status={
                      selectedService.status
                    }
                  />
                )}

              </div>


              <div className="delivery-field">

                <label
                  htmlFor="delivery-service"
                >
                  Servicio
                </label>


                <select
                  id="delivery-service"

                  value={
                    selectedServiceId ??
                    ""
                  }

                  disabled={
                    isLoading ||
                    services.length === 0
                  }

                  onChange={(event) => {
                    void handleServiceChange(
                      Number(
                        event.target.value,
                      ),
                    );
                  }}
                >
                  {services.length === 0 && (
                    <option value="">
                      Sin servicios listos para recoger
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

            </div>


            <div className="delivery-divider" />


            <div className="delivery-step">

              <div className="delivery-step-header">
                <div>
                  <h2>
                    2. Escanear QR de la
                    bolsa o canasto
                  </h2>

                  <p>
                    Escanea el identificador
                    interno antes de confirmar
                    la entrega.
                  </p>
                </div>
              </div>


              <Button
                type="button"
                variant="secondary"
                fullWidth

                disabled={
                  !selectedService ||
                  isLoading
                }

                onClick={
                  handleOpenScanner
                }
              >
                Abrir cámara y escanear QR
              </Button>


              <div
                className={`delivery-validation-message delivery-validation-message--${qrValidationStatus.toLowerCase()}`}
              >
                {qrValidationMessage}
              </div>

            </div>


            <div className="delivery-actions">

              <Button
                type="button"

                disabled={
                  !canConfirm ||
                  isConfirming
                }

                onClick={
                  handleConfirmDelivery
                }
              >
                {isConfirming
                  ? "Confirmando..."
                  : "Confirmar entrega"}
              </Button>

            </div>

          </section>


          <aside className="delivery-details-card">

            {selectedService ? (
              <DeliveryServiceDetails
                code={
                  selectedService.code
                }

                client={
                  selectedService.client
                }

                phone={
                  selectedService.phone
                }

                garments={
                  selectedService.garments
                }

                status={
                  selectedService.status
                }

                receivedAt={
                  formatReceptionDate(
                    selectedService.receivedAt,
                  )
                }
              />
            ) : (
              <div className="delivery-empty">
                No hay servicios disponibles
                para entregar.
              </div>
            )}

          </aside>

        </div>

      </div>


      <QrScannerModal
        isOpen={
          isScannerOpen
        }

        onClose={
          handleCloseScanner
        }

        onScanned={
          handleQrScanned
        }
      />

    </AppLayout>
  );
}