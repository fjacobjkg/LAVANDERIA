import {
  useState,
  type FormEvent,
} from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import { Modal } from "../Modal";

import { createClient } from "../../services/client.service";

import type { Client } from "../../types/service.types";

import "../../styles/register-client-modal.css";


interface RegisterClientModalProps {
  isOpen: boolean;

  onClose: () => void;

  onClientCreated:
    (client: Client) => void;

  onError:
    (message: string) => void;
}


export function RegisterClientModal({
  isOpen,
  onClose,
  onClientCreated,
  onError,
}: RegisterClientModalProps) {

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  const nameIsValid =
    name.trim().length >= 2 &&
    name.trim().length <= 25 &&
    /^[\p{L}]+(?:\s+[\p{L}]+)*$/u
      .test(name.trim());


  const phoneIsValid =
    /^\d{8}$/.test(phone);


  const isFormValid =
    nameIsValid &&
    phoneIsValid;


  function resetForm() {
    setName("");
    setPhone("");
  }


  function handleClose() {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  }


  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();


    if (!isFormValid) {
      return;
    }


    try {
      setIsSubmitting(true);

      const client =
        await createClient(
          name.trim(),
          phone,
        );


      onClientCreated(client);


      resetForm();

      onClose();

    } catch (error) {

      onError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al registrar el cliente.",
      );

    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <Modal
      isOpen={isOpen}
      title="Registrar cliente"
      onClose={handleClose}
    >
      <form
        className="register-client-form"
        noValidate
        onSubmit={handleSubmit}
      >

        <div className="register-client-fields">

          <Input
            id="new-client-name"
            name="name"
            label="Nombre"
            type="text"
            placeholder="Ingresa el nombre"

            required

            maxLength={25}

            value={name}

            onChange={(event) => {
              const alphabeticValue =
                event.target.value
                  .replace(
                    /[^\p{L}\s]/gu,
                    "",
                  );

              setName(
                alphabeticValue,
              );
            }}
          />


          <Input
            id="new-client-phone"
            name="phone"
            label="Teléfono"
            type="tel"
            placeholder="00000000"

            required

            inputMode="numeric"

            maxLength={8}

            value={phone}

            onChange={(event) => {
              const numericValue =
                event.target.value
                  .replace(
                    /\D/g,
                    "",
                  )
                  .slice(
                    0,
                    8,
                  );

              setPhone(
                numericValue,
              );
            }}
          />

        </div>


        <div className="register-client-actions">

          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={handleClose}
          >
            Cancelar
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
              : "Guardar cliente"}
          </Button>

        </div>

      </form>
    </Modal>
  );
}