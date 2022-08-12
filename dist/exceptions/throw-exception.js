"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrowException = void 0;
const auth_error_1 = require("./auth-error");
const bad_request_1 = require("./bad-request");
const conflict_error_1 = require("./conflict-error");
const not_found_1 = require("./not-found");
const permission_error_1 = require("./permission-error");
const server_error_1 = require("./server-error");
const logger_service_1 = require("../services/logger.service");
class ThrowException {
    static logError(message) {
        this.logger.error(message);
    }
    static notFound(message) {
        this.logError(message);
        throw new not_found_1.NotFoundException(message);
    }
    static badRequest(message) {
        this.logError(message);
        throw new bad_request_1.BadRequestException(message);
    }
    static conflict(message) {
        this.logError(message);
        throw new conflict_error_1.ConflictException(message);
    }
    static unAuthorized(message) {
        this.logError(message);
        throw new permission_error_1.UnAuthorizedException(message);
    }
    static unAuthenticated(message) {
        this.logError(message);
        throw new auth_error_1.UnAuthenticatedException(message);
    }
    static serverError(message) {
        this.logError(message);
        throw new server_error_1.ServerException(message);
    }
}
exports.ThrowException = ThrowException;
ThrowException.logger = logger_service_1.Logger.getInstance();
