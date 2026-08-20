import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Textarea } from "../../components/Textarea";

import { AppLayout } from "../../layout/AppLayout";

import { getClients } from "../../services/client.service";
import { createService } from "../../services/service.service";

import type { Client } from "../../types/service.types";
import {
  Notification,
  type NotificationType,
} from "../../components/Notification";

import "../../styles/register-service.css";


export function RegisterServicePage() {

  /*
   * ============================
   * ESTADO DEL FORMULARIO
   * ============================
   */

  const [clients, setClients] =
    useState<Client[]>([]);

  const [
    selectedClientId,
    setSelectedClientId,
  ] = useState("");

  const [
    newClientMode,
    setNewClientMode,
  ] = useState(false);

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [
    totalGarments,
    setTotalGarments,
  ] = useState("1");

  const [
    observations,
    setObservations,
  ] = useState("");


  interface NotificationState {
      type: NotificationType;
      title: string;
      message: string;
    }

  const [
    notification,
    setNotification,
  ] = useState<NotificationState | null>(
    null,
  );

  const [
    isSubmitting,
    setIsSubmitting,
    ] = useState(false);

  const garments =
    Number(totalGarments);

  const garmentsAreValid =
    Number.isInteger(garments) &&
    garments >= 1 &&
    garments <= 100;

  const observationsAreValid =
    observations.trim().length >= 1 &&
    observations.trim().length <= 150;

  const nameIsValid =
    name.trim().length <= 25;

  const phoneIsValid =
    phone === "" ||
    /^\d{8}$/.test(phone);

  const hasNewClientData =
    name.trim() !== "" ||
    phone.trim() !== "";

  const newClientIsValid =
    !newClientMode ||
    !hasNewClientData ||
    (
      name.trim().length >= 1 &&
      nameIsValid &&
      phoneIsValid
    );

  const isFormValid =
    garmentsAreValid &&
    observationsAreValid &&
    newClientIsValid;


  /*
   * ============================
   * CARGAR CLIENTES
   * ============================
   */

  useEffect(() => {
    async function loadClients() {
      try {
        const result =
          await getClients();

        setClients(result);
      } catch (error) {
        if (error instanceof Error) {

        }
      }
    }

    void loadClients();
  }, []);


  /*
   * ============================
   * SELECCIONAR CLIENTE
   * ============================
   */

  function handleClientChange(
    clientId: string,
  ) {
    setSelectedClientId(clientId);

    setNewClientMode(false);

    if (!clientId) {
      setName("");
      setPhone("");

      return;
    }

    const selectedClient =
      clients.find(
        (client) =>
          client.id === Number(clientId),
      );

    setName(
      selectedClient?.name ?? "",
    );

    setPhone(
      selectedClient?.phone ?? "",
    );
  }


  /*
   * ============================
   * NUEVO CLIENTE
   * ============================
   */

  function handleNewClient() {
    setSelectedClientId("");

    setName("");
    setPhone("");

    setNewClientMode(true);

  }


  /*
   * ============================
   * LIMPIAR FORMULARIO
   * ============================
   */

    function handleClear(
        clearNotification = true,
      ) {
        setSelectedClientId("");
        setNewClientMode(false);

        setName("");
        setPhone("");

        setTotalGarments("");
        setObservations("");

        if (clearNotification) {
          setNotification(null);
        }
    }


  /*
   * ============================
   * GUARDAR SERVICIO
   * ============================
   */

   async function handleSubmit(
      event: FormEvent<HTMLFormElement>,
    ) {
      event.preventDefault();

      if (!garmentsAreValid) {
        setNotification({
          type: "error",
          title: "Datos incompletos",
          message:
            "El total de prendas debe estar entre 1 y 100.",
        });

        return;
      }

      if (!observationsAreValid) {
        setNotification({
          type: "error",
          title: "Observaciones requeridas",
          message:
            "Ingresa una observación de máximo 150 caracteres.",
        });

        return;
      }

      if (
        newClientMode &&
        phone &&
        !phoneIsValid
      ) {
        setNotification({
          type: "error",
          title: "Teléfono inválido",
          message:
            "El teléfono debe contener exactamente 8 dígitos.",
        });

        return;
      }

      if (
        newClientMode &&
        hasNewClientData &&
        !name.trim()
      ) {
        setNotification({
          type: "error",
          title: "Nombre requerido",
          message:
            "Ingresa el nombre para registrar al nuevo cliente.",
        });

        return;
      }

      try {
        setIsSubmitting(true);
        setNotification(null);

        const result =
          await createService({
            idCliente:
              selectedClientId
                ? Number(selectedClientId)
                : null,

            clienteNuevo:
              newClientMode &&
              name.trim()
                ? {
                    nombre:
                      name.trim(),

                    telefono:
                      phone || null,
                  }
                : null,

            totalPrendas:
              garments,

            observaciones:
              observations.trim(),
          });

        setNotification({
          type: "success",
          title: "Servicio registrado",
          message:
            `El servicio ${result.service.code} fue registrado correctamente.`,
        });

        handleClear(false);

      } catch (error) {
        setNotification({
          type: "error",
          title: "No fue posible guardar",
          message:
            error instanceof Error
              ? error.message
              : "Ocurrió un error inesperado.",
        });

      } finally {
        setIsSubmitting(false);
      }
    }


  

  /*
   * ============================
   * INTERFAZ
   * ============================
   */

  return (
    <AppLayout>

          {notification && (
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={() =>
              setNotification(null)
            }
          />
        )}

      <div className="service-page-header">

        <h1>
          Nuevo servicio
        </h1>

        <p>
          Registra la recepción de una bolsa o canasto y genera
          su código QR.
        </p>

      </div>


      <form
        className="service-form-card"
        onSubmit={handleSubmit}
      >

        {/* =========================
            DATOS DEL CLIENTE
        ========================== */}

        <div className="service-section">

          <div className="service-section-heading">

            <span className="section-number">
              1
            </span>

            <h2>
              Datos del cliente
            </h2>

          </div>


          <div className="client-row">

            <Select
              id="client"
              label="Cliente registrado"
              value={selectedClientId}
              onChange={(event) =>
                handleClientChange(
                  event.target.value,
                )
              }
            >

              <option value="">
                Sin cliente asociado
              </option>

              {clients.map((client) => (
                <option
                  key={client.id}
                  value={client.id}
                >
                  {client.name}
                </option>
              ))}

            </Select>


            <Button
              type="button"
              variant="secondary"
              onClick={handleNewClient}
            >
              + Nuevo cliente
            </Button>

          </div>


          <p className="form-help">
            Los datos del cliente pueden omitirse si no son proporcionados.
          </p>


          <div className="form-grid">

            <Input
              id="name"
              name="name"
              label="Nombre"
              type="text"
              placeholder="Opcional"

              maxLength={25}

              value={name}

              disabled={
                !newClientMode &&
                !selectedClientId
              }

              readOnly={
                Boolean(selectedClientId)
              }

              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
            />


           <Input
              id="phone"
              name="phone"
              label="Teléfono"
              type="tel"

              placeholder="00000000"

              inputMode="numeric"
              maxLength={8}

              value={phone}

              disabled={
                !newClientMode &&
                !selectedClientId
              }

              readOnly={
                Boolean(selectedClientId)
              }

              onChange={(event) => {
                const numericValue =
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 8);

                setPhone(numericValue);
              }}
            />

          </div>

        </div>


        {/* =========================
            DATOS DEL SERVICIO
        ========================== */}

        <div className="service-section">

          <div className="service-section-heading">

            <span className="section-number">
              2
            </span>

            <h2>
              Datos del servicio
            </h2>

          </div>


          <div className="form-grid">

            <Input
              id="garments"
              name="garments"
              label="Total de prendas"
              type="number"

              required

              min="1"
              max="100"

              value={totalGarments}

              onChange={(event) =>
                setTotalGarments(
                  event.target.value,
                )
              }
            />


            <Select
              id="status"
              label="Estado inicial"
              value="RECIBIDA"
              disabled
            >

              <option value="RECIBIDA">
                Recibida
              </option>

            </Select>

          </div>


          <p className="form-help">
            Conteo total ingresado manualmente; no se registran
            prendas individualmente.
          </p>


          <div className="observations-field">

        <Textarea
            id="observations"
            name="observations"
            label="Observaciones"
            placeholder="Observaciones de recepción..."

            required

            maxLength={150}

            value={observations}

            onChange={(event) =>
              setObservations(
                event.target.value,
              )
            }
          />

          <div
            className={`character-counter ${
              observations.length >= 140
                ? "character-counter--limit"
                : ""
            }`}
          >
            {observations.length}/150
          </div>

        </div>

      </div>


        {/* =========================
            ACCIONES
        ========================== */}

        <div className="service-actions">

          <Button
            type="button"
            variant="secondary"
            onClick={() => handleClear()}
          >
            Limpiar
          </Button>


          <Button
            type="submit"
            disabled={
              !isFormValid ||
              isSubmitting
            }
          >
            {isSubmitting
              ? "Guardando..."
              : "Guardar servicio"}
          </Button>

        </div>

      </form>

    </AppLayout>
  );
}