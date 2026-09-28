import {
  Button,
} from "./Button";

import "../styles/pagination.css";


interface PaginationProps {
  currentPage: number;

  totalPages: number;

  totalItems: number;

  onPageChange: (
    page: number,
  ) => void;

  disabled?: boolean;

  itemLabel?: string;
}


export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  disabled = false,
  itemLabel = "servicio",
}: PaginationProps) {

  const canGoPrevious =
    currentPage > 1;


  const canGoNext =
    currentPage <
    totalPages;


  const pluralLabel =
    totalItems === 1
      ? itemLabel
      : `${itemLabel}s`;


  return (
    <div className="pagination">

      <span className="pagination-summary">

        {totalItems === 0
          ? `No hay ${itemLabel}s registrados.`
          : `${totalItems} ${pluralLabel} encontrado${
              totalItems === 1
                ? ""
                : "s"
            }`}
      </span>


      <div className="pagination-controls">

        <Button
          type="button"
          variant="secondary"

          disabled={
            disabled ||
            !canGoPrevious
          }

          onClick={() =>
            onPageChange(
              currentPage - 1,
            )
          }
        >
          Anterior
        </Button>


        <span className="pagination-page">

          Página{" "}

          <strong>
            {currentPage}
          </strong>

          {" "}de{" "}

          <strong>
            {totalPages}
          </strong>

        </span>


        <Button
          type="button"
          variant="secondary"

          disabled={
            disabled ||
            !canGoNext
          }

          onClick={() =>
            onPageChange(
              currentPage + 1,
            )
          }
        >
          Siguiente
        </Button>

      </div>

    </div>
  );
}