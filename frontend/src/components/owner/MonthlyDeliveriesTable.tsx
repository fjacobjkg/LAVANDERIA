import type {
  MonthlyDelivery,
} from "../../types/monthly-deliveries.types";


interface MonthlyDeliveriesTableProps {
  deliveries:
    MonthlyDelivery[];
}


function formatDateTime(
  value: string,
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
      value,
    ),
  );
}


export function MonthlyDeliveriesTable({
  deliveries,
}: MonthlyDeliveriesTableProps) {

  if (
    deliveries.length === 0
  ) {
    return (
      <div className="monthly-deliveries-empty">
        No se encontraron entregas para
        el período seleccionado.
      </div>
    );
  }


  return (
    <div className="monthly-deliveries-table-wrapper">

      <table className="monthly-deliveries-table">

        <thead>
          <tr>
            <th>
              Servicio
            </th>

            <th>
              Cliente
            </th>

            <th>
              Teléfono
            </th>

            <th>
              Prendas
            </th>

            <th>
              Recepción
            </th>

            <th>
              Entrega
            </th>
          </tr>
        </thead>


        <tbody>

          {deliveries.map(
            (delivery) => (

              <tr
                key={
                  delivery.id
                }
              >

                <td>
                  <strong>
                    {delivery.code}
                  </strong>
                </td>


                <td>
                  {delivery.client ??
                    "Sin cliente"}
                </td>


                <td>
                  {delivery.phone ??
                    "No registrado"}
                </td>


                <td>
                  {delivery.garments}
                </td>


                <td>
                  {formatDateTime(
                    delivery.receivedAt,
                  )}
                </td>


                <td>
                  {formatDateTime(
                    delivery.deliveredAt,
                  )}
                </td>

              </tr>

            ),
          )}

        </tbody>

      </table>

    </div>
  );
}