import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Textarea } from "../../components/Textarea";

import { AppLayout } from "../../layout/AppLayout";

import "../../styles/register-service.css";

export function RegisterServicePage() {
  return (
    <AppLayout>

      <div className="service-page-header">
        <h1>Nuevo servicio</h1>

        <p>
          Registra la recepción de una bolsa o canasto y genera
          su boleta con código QR.
        </p>
      </div>


      <section className="service-form-card">

        {/* DATOS DEL CLIENTE */}

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
              defaultValue=""
            >
              <option value="">
                Sin cliente asociado
              </option>

              <option value="1">
                Cliente de ejemplo
              </option>
            </Select>


            <Button
              type="button"
              variant="secondary"
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
            />

            <Input
              id="phone"
              name="phone"
              label="Teléfono"
              type="tel"
              placeholder="Opcional"
            />

          </div>

        </div>


        {/* DATOS DEL SERVICIO */}

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
              min="1"
              defaultValue="1"
            />


            <Select
              id="status"
              label="Estado inicial"
              defaultValue="received"
            >
              <option value="received">
                Recibida
              </option>
            </Select>

          </div>


          <p className="form-help">
            Conteo total ingresado manualmente; no se registran
            prendas individualmente.
          </p>


          <Textarea
            id="observations"
            name="observations"
            label="Observaciones"
            placeholder="Observaciones de recepción..."
          />

        </div>


        {/* ACCIONES */}

        <div className="service-actions">

          <Button
            type="button"
            variant="secondary"
          >
            Limpiar
          </Button>


          <Button type="button">
            Guardar servicio 
          </Button>

        </div>

      </section>

    </AppLayout>
  );
}