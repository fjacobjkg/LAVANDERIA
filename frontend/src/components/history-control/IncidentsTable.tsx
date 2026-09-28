import {
  IncidentTypeBadge,
} from "./IncidentTypeBadge";

import type {
  IncidentRecord,
} from "../../types/history-control.types";


interface IncidentsTableProps {
  incidents:
    IncidentRecord[];
}


function formatDateTime(
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


export function IncidentsTable({
  incidents,
}: IncidentsTableProps) {

  if (
    incidents.length === 0
  ) {
    return (
      <div className="history-control-empty">
        No hay incidentes registrados.
      </div>
    );
  }


  return (
    <div className="incidents-table-wrapper">

      <table className="incidents-table">

        <thead>
          <tr>
            <th>
              ID
            </th>

            <th>
              Servicio
            </th>

            <th>
              Tipo
            </th>

            <th>
              Detalle
            </th>

            <th>
              Fecha
            </th>

            <th>
              Responsable
            </th>
          </tr>
        </thead>


        <tbody>

          {incidents.map(
            (incident) => (
              <tr
                key={
                  incident.id
                }
              >

                <td>
                  #{incident.id}
                </td>


                <td>
                  <strong>
                    {incident.serviceCode}
                  </strong>
                </td>


                <td>
                  <IncidentTypeBadge
                    type={
                      incident.type
                    }
                  />
                </td>


                <td>
                  {incident.detail}
                </td>


                <td>
                  {formatDateTime(
                    incident.occurredAt,
                  )}
                </td>


                <td>
                  {incident.responsible}
                </td>

              </tr>
            ),
          )}

        </tbody>

      </table>

    </div>
  );
}