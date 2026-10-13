import { Select } from "../Select";
import { REPORT_YEARS } from "../../utils/owner-report-period";

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

interface Props { value: string; onChange: (month: string) => void; disabled?: boolean }

export function MonthlyPeriodSelector({ value, onChange, disabled = false }: Props) {
  const [year, month] = value.split("-");
  return (
    <div className="monthly-period-selectors">
      <Select id="monthly-month" label="Mes" value={month} disabled={disabled}
        onChange={(event) => onChange(`${year}-${event.target.value}`)}>
        {MONTHS.map((name, index) => <option key={name} value={String(index + 1).padStart(2, "0")}>{name}</option>)}
      </Select>
      <Select id="monthly-year" label="Año" value={year} disabled={disabled}
        onChange={(event) => onChange(`${event.target.value}-${month}`)}>
        {REPORT_YEARS.map((option) => <option key={option} value={option}>{option}</option>)}
      </Select>
    </div>
  );
}
