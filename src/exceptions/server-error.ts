import { StatusCodes } from "http-status-codes";
import { CustomException } from "./custom-exception";

export class ServerException extends CustomException {
  constructor(public message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
