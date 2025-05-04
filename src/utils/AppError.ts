import { HttpStatusCode } from "../utils/HttpStatusCode";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly timestamp: string;

  constructor(message: string, statusCode: HttpStatusCode) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
