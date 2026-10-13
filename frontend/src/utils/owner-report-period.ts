export const FIRST_REPORT_YEAR = 2026;
export const REPORT_YEAR_COUNT = 5;
export const REPORT_YEARS = Array.from({ length: REPORT_YEAR_COUNT }, (_, index) => FIRST_REPORT_YEAR + index);

export function getInitialReportMonth(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Guatemala", year: "numeric", month: "2-digit",
  }).formatToParts(now);
  const currentYear = Number(parts.find((part) => part.type === "year")!.value);
  const year = Math.min(FIRST_REPORT_YEAR + REPORT_YEAR_COUNT - 1, Math.max(FIRST_REPORT_YEAR, currentYear));
  const month = parts.find((part) => part.type === "month")!.value;
  return `${year}-${month}`;
}
