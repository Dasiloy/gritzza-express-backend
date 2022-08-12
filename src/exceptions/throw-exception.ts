import { UnAuthenticatedException } from "./auth-error";
import { BadRequestException } from "./bad-request";
import { ConflictException } from "./conflict-error";
import { NotFoundException } from "./not-found";
import { UnAuthorizedException } from "./permission-error";
import { ServerException } from "./server-error";
import { Logger } from "../services/logger.service";

export class ThrowException {
  private static logger = Logger.getInstance();

  private static logError(message: string) {
    this.logger.error(message);
  }

  public static notFound(message: string) {
    this.logError(message);
    throw new NotFoundException(message);
  }

  public static badRequest(
    message: string
  ): BadRequestException {
    this.logError(message);
    throw new BadRequestException(message);
  }

  public static conflict(
    message: string
  ): ConflictException {
    this.logError(message);
    throw new ConflictException(message);
  }

  public static unAuthorized(
    message: string
  ): UnAuthorizedException {
    this.logError(message);
    throw new UnAuthorizedException(message);
  }

  public static unAuthenticated(
    message: string
  ): UnAuthenticatedException {
    this.logError(message);
    throw new UnAuthenticatedException(message);
  }

  public static serverError(
    message: string
  ): ServerException {
    this.logError(message);
    throw new ServerException(message);
  }
}
