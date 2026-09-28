export class HistoryControlError extends Error {
  statusCode: number;


  constructor(
    message: string,
    statusCode = 400,
  ) {
    super(message);

    this.name =
      "HistoryControlError";

    this.statusCode =
      statusCode;
  }
}