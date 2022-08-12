import { StatusCodes } from "http-status-codes";
import { CustomException } from "./custom-exception";

export class ConflictException extends CustomException {
  constructor(public message: string) {
    super(message, StatusCodes.CONFLICT);
  }
}
