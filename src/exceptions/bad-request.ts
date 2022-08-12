import { StatusCodes } from "http-status-codes";
import { CustomException } from "./custom-exception";

export class BadRequestException extends CustomException {
  constructor(public message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
