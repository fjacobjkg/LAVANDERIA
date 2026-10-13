export class OwnerError
  extends Error {

  statusCode: number;


  constructor(
    statusCode: number,
    message: string,
  ) {
    super(
      message,
    );

    this.name =
      "OwnerError";

    this.statusCode =
      statusCode;
  }
}