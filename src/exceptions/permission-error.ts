import { StatusCodes } from "http-status-codes";
import { CustomException } from "./custom-exception";

export class UnAuthorizedException extends CustomException {
  constructor(public message: string) {
    super(message, StatusCodes.FORBIDDEN);
  }
}
