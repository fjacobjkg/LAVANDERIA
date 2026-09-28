import {
  useEffect,
  useState,
} from "react";

import {
  Button,
} from "../Button";

import {
  Modal,
} from "../Modal";

import type {
  IncidentServiceOption,
  IncidentType,
  RegisterIncidentInput,
} from "../../types/history-control.types";


interface RegisterIncidentModalProps {
  isOpen: boolean;

  services:
    IncidentServiceOption[];

  isSubmitting?: boolean;

  onClose: () => void;

  onSubmit: (
    input:
      RegisterIncidentInput,
  ) => Promise<void>;
}


export function RegisterIncidentModal({
  isOpen,
  services,
  isSubmitting = false,
  onClose,
  onSubmit,
}: RegisterIncidentModalProps) {

  const [
    serviceId,
    setServiceId,
  ] =
    useState<number | null>(
      null,
    );


  const [
    type,
    setType,
  ] =
    useState<IncidentType>(
      "QR_DAMAGED",
    );


  const [
    reason,
    setReason,
  ] =
    useState("");


  const [
    detail,
    setDetail,
  ] =
    useState("");


  useEffect(() => {
    if (!isOpen) {
      return;
    }


    setServiceId(
      services[0]?.id ??
      null,
    );

    setType(
      "QR_DAMAGED",
    );

    setReason(
      "",
    );

    setDetail(
      "",
    );

  }, [
    isOpen,
    services,
  ]);


 async function handleSubmit(
  event:
    React.FormEvent<HTMLFormElement>,
) {
  event.preventDefault();


  if (
    serviceId === null ||
    !reason.trim() ||
    !detail.trim() ||
    isSubmitting
  ) {
    return;
  }


  await onSubmit({
    serviceId,

    type,

    reason:
      reason.trim(),

    detail:
      detail.trim(),
  });
}


  const canSubmit =
    serviceId !== null &&
    reason.trim().length > 0 &&
    detail.trim().length > 0;


  return (
    <Modal
      isOpen={
        isOpen
      }

      title="Registrar incidente"

      onClose={
        onClose
      }
    >

      <form
        className="register-incident-form"

        onSubmit={
          handleSubmit
        }
      >

        <div className="register-incident-fields">

          <div className="history-control-field">

            <label htmlFor="incident-service">
              Servicio
            </label>


            <select
              id="incident-service"

              value={
                serviceId ??
                ""
              }

              disabled={
                services.length === 0
              }

              onChange={(event) =>
                setServiceId(
                  Number(
                    event.target.value,
                  ),
                )
              }
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
                  </option>
                ),
              )}

            </select>

          </div>


          <div className="history-control-field">

            <label htmlFor="incident-type">
              Tipo
            </label>


            <select
              id="incident-type"

              value={
                type
              }

              onChange={(event) =>
                setType(
                  event.target
                    .value as
                    IncidentType,
                )
              }
            >
              <option value="QR_DAMAGED">
                QR dañado
              </option>

              <option value="CORRECTION">
                Corrección
              </option>

              <option value="NO_CONTACT">
                Falta de contacto
              </option>

              <option value="CANCELLATION">
                Cancelación
              </option>

              <option value="OTHER">
                Otro
              </option>
            </select>

          </div>


          <div className="history-control-field">

            <label htmlFor="incident-reason">
              Motivo
            </label>


            <input
              id="incident-reason"

              type="text"

              value={
                reason
              }

              maxLength={
                120
              }

              placeholder="Motivo del incidente"

              onChange={(event) =>
                setReason(
                  event.target.value,
                )
              }
            />

          </div>


          <div className="history-control-field">

            <label htmlFor="incident-detail">
              Detalle
            </label>


            <textarea
              id="incident-detail"

              value={
                detail
              }

              maxLength={
                255
              }

              placeholder="Describe brevemente lo ocurrido..."

              onChange={(event) =>
                setDetail(
                  event.target.value,
                )
              }
            />

            <span className="register-incident-counter">
              {detail.length}/255
            </span>

          </div>

        </div>


        <div className="register-incident-actions">

          <Button
            type="button"
            variant="secondary"

            disabled={
              isSubmitting
            }

            onClick={
              onClose
            }
          >
            Cancelar
          </Button>


          <Button
          type="submit"

          disabled={
            !canSubmit ||
            isSubmitting
          }
        >
          {isSubmitting
            ? "Registrando..."
            : "Registrar"}
        </Button>

        </div>

      </form>

    </Modal>
  );
}